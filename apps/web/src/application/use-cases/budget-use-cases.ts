import { randomUUID } from "crypto";
import { Budget } from "@/domain/entities/budget";
import { BudgetRepository } from "@/application/outbound/budget-repository";
import { JobItemRepository } from "@/application/outbound/job-item-repository";
import { CommercialDocumentSettingsRepository } from "@/application/outbound/commercial-document-settings-repository";
import { ClientRepository } from "@/application/outbound/client-repository";
import { WorkerRepository } from "@/application/outbound/worker-repository";
import { TaxRepository } from "@/application/outbound/tax-repository";
import { ClientSnapshot } from "@/domain/value-objects/client-snapshot";
import { PricingMode } from "@/domain/value-objects/pricing-mode";
import { WorkerSnapshot } from "@/domain/value-objects/worker-snapshot";

export async function createBudget(
  clientId: string,
  workerId: string,
  notes: string | null,
  taxId: string | null,
  pricingMode: PricingMode,
  manualSubtotalAmount: number | null,
  clientSnapshotOverride: ClientSnapshot | null,
  workerSnapshotOverride: WorkerSnapshot | null,
  budgetRepo: BudgetRepository,
  settingsRepo: CommercialDocumentSettingsRepository,
  clientRepo: ClientRepository,
  workerRepo: WorkerRepository,
  taxRepo: TaxRepository
): Promise<Budget> {
  const client = await clientRepo.getById(clientId);
  const worker = await workerRepo.getById(workerId);
  const tax = taxId ? await taxRepo.getById(taxId) : null;

  const number = await settingsRepo.allocateNumber("budget", null);
  const budgetNumber = `${number}`;

  const clientSnapshot: ClientSnapshot = clientSnapshotOverride ?? {
    name: client.name,
    taxId: client.taxId,
    phone: client.phone,
    email: client.email,
    workAddress: client.workAddress,
    billingAddress: client.billingAddress
  };

  const workerSnapshot: WorkerSnapshot = workerSnapshotOverride ?? {
    name: worker.name,
    taxId: worker.taxId,
    phone: worker.phone,
    email: worker.email,
    bankAccount: worker.bankAccount,
    workAddress: worker.workAddress,
    billingAddress: worker.billingAddress
  };

  const now = new Date();
  const budget: Budget = {
    id: randomUUID(),
    number: budgetNumber,
    clientId,
    clientSnapshot,
    workerId,
    workerSnapshot,
    notes,
    taxSnapshot: tax
      ? {
          name: tax.name,
          rate: tax.rate,
          behavior: tax.behavior
        }
      : null,
    pricingMode,
    manualSubtotalAmount,
    subtotalAmount: 0,
    taxAmount: 0,
    totalAmount: 0,
    deliveredAt: null,
    createdAt: now,
    updatedAt: now
  };

  return budgetRepo.create(budget);
}

export async function updateBudgetTax(
  budgetId: string,
  taxId: string | null,
  budgetRepo: BudgetRepository,
  taxRepo: TaxRepository
): Promise<Budget> {
  const budget = await budgetRepo.getById(budgetId);
  const tax = taxId ? await taxRepo.getById(taxId) : null;

  budget.taxSnapshot = tax
    ? {
        name: tax.name,
        rate: tax.rate,
        behavior: tax.behavior
      }
    : null;
  budget.updatedAt = new Date();

  return budgetRepo.update(budget);
}

export async function calculateBudgetTotals(
  budgetId: string,
  jobItemRepo: JobItemRepository,
  budgetRepo: BudgetRepository
): Promise<Budget> {
  const budget = await budgetRepo.getById(budgetId);
  const items = await jobItemRepo.findByDocumentId(budgetId);

  let subtotal = 0;
  if (budget.pricingMode === "manual-subtotal") {
    subtotal = budget.manualSubtotalAmount ?? 0;
  } else {
    for (const item of items) {
      if (item.totalPrice !== null) {
        subtotal += item.totalPrice;
      } else if (item.quantity !== null && item.unitPrice !== null) {
        subtotal += item.quantity * item.unitPrice;
      }
    }
  }

  const taxAmount = budget.taxSnapshot ? (subtotal * budget.taxSnapshot.rate) / 100 : 0;
  const total = subtotal + taxAmount;

  budget.subtotalAmount = subtotal;
  budget.taxAmount = taxAmount;
  budget.totalAmount = total;
  budget.updatedAt = new Date();

  return budgetRepo.update(budget);
}
