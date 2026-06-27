import { randomUUID } from "crypto";
import { Invoice } from "@/domain/entities/invoice";
import { InvoiceRepository } from "@/application/outbound/invoice-repository";
import { JobItemRepository } from "@/application/outbound/job-item-repository";
import { CommercialDocumentSettingsRepository } from "@/application/outbound/commercial-document-settings-repository";
import { ClientRepository } from "@/application/outbound/client-repository";
import { WorkerRepository } from "@/application/outbound/worker-repository";
import { TaxRepository } from "@/application/outbound/tax-repository";
import { ClientSnapshot } from "@/domain/value-objects/client-snapshot";
import { PricingMode } from "@/domain/value-objects/pricing-mode";
import { WorkerSnapshot } from "@/domain/value-objects/worker-snapshot";

export async function createInvoice(
  clientId: string,
  workerId: string,
  notes: string | null,
  taxId: string | null,
  pricingMode: PricingMode,
  manualSubtotalAmount: number | null,
  sourceBudgetId: string | null,
  clientSnapshotOverride: ClientSnapshot | null,
  workerSnapshotOverride: WorkerSnapshot | null,
  invoiceRepo: InvoiceRepository,
  settingsRepo: CommercialDocumentSettingsRepository,
  clientRepo: ClientRepository,
  workerRepo: WorkerRepository,
  taxRepo: TaxRepository
): Promise<Invoice> {
  const client = await clientRepo.getById(clientId);
  const worker = await workerRepo.getById(workerId);
  const tax = taxId ? await taxRepo.getById(taxId) : null;

  const currentYear = new Date().getFullYear();
  const number = await settingsRepo.allocateNumber("invoice", currentYear);
  const invoiceNumber = `${number}/${currentYear}`;

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
  const invoice: Invoice = {
    id: randomUUID(),
    number: invoiceNumber,
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
    issuedAt: null,
    sourceBudgetId,
    createdAt: now,
    updatedAt: now
  };

  return invoiceRepo.create(invoice);
}

export async function updateInvoiceTax(
  invoiceId: string,
  taxId: string | null,
  invoiceRepo: InvoiceRepository,
  taxRepo: TaxRepository
): Promise<Invoice> {
  const invoice = await invoiceRepo.getById(invoiceId);
  const tax = taxId ? await taxRepo.getById(taxId) : null;

  invoice.taxSnapshot = tax
    ? {
        name: tax.name,
        rate: tax.rate,
        behavior: tax.behavior
      }
    : null;
  invoice.updatedAt = new Date();

  return invoiceRepo.update(invoice);
}

export async function calculateInvoiceTotals(
  invoiceId: string,
  jobItemRepo: JobItemRepository,
  invoiceRepo: InvoiceRepository
): Promise<Invoice> {
  const invoice = await invoiceRepo.getById(invoiceId);
  const items = await jobItemRepo.findByDocumentId(invoiceId);

  let subtotal = 0;
  if (invoice.pricingMode === "manual-subtotal") {
    subtotal = invoice.manualSubtotalAmount ?? 0;
  } else {
    for (const item of items) {
      if (item.totalPrice !== null) {
        subtotal += item.totalPrice;
      } else if (item.quantity !== null && item.unitPrice !== null) {
        subtotal += item.quantity * item.unitPrice;
      }
    }
  }

  const taxAmount = invoice.taxSnapshot ? (subtotal * invoice.taxSnapshot.rate) / 100 : 0;
  const total = subtotal + taxAmount;

  invoice.subtotalAmount = subtotal;
  invoice.taxAmount = taxAmount;
  invoice.totalAmount = total;
  invoice.updatedAt = new Date();

  return invoiceRepo.update(invoice);
}
