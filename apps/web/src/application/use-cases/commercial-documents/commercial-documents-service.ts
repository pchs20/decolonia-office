import { Budget } from "@/domain/entities/budget";
import { Invoice } from "@/domain/entities/invoice";
import { Tax } from "@/domain/entities/tax";
import { WorkTemplate } from "@/domain/entities/work-template";
import { DocumentSequence } from "@/domain/entities/document-sequence";
import { JobItem } from "@/domain/value-objects/job-item";
import { BudgetRepository } from "@/application/outbound/budget-repository";
import { InvoiceRepository } from "@/application/outbound/invoice-repository";
import { JobItemRepository } from "@/application/outbound/job-item-repository";
import { ClientRepository } from "@/application/outbound/client-repository";
import { WorkerRepository } from "@/application/outbound/worker-repository";
import { TaxRepository } from "@/application/outbound/tax-repository";
import { WorkTemplateRepository } from "@/application/outbound/work-template-repository";
import { CommercialDocumentSettingsRepository } from "@/application/outbound/commercial-document-settings-repository";
import {
  createBudget,
  updateBudgetTax,
  calculateBudgetTotals
} from "@/application/use-cases/budget-use-cases";
import {
  createInvoice,
  updateInvoiceTax,
  calculateInvoiceTotals
} from "@/application/use-cases/invoice-use-cases";
import { addJobItem, updateJobItem, removeJobItem } from "@/application/use-cases/job-item-use-cases";
import {
  createTax as createTaxUseCase,
  updateTax as updateTaxUseCase,
  deactivateTax as deactivateTaxUseCase,
  archiveTax as archiveTaxUseCase
} from "@/application/use-cases/tax-use-cases";
import {
  createWorkTemplate,
  updateWorkTemplate,
  deactivateWorkTemplate,
  archiveWorkTemplate
} from "@/application/use-cases/work-template-use-cases";
import { ClientSnapshot } from "@/domain/value-objects/client-snapshot";
import { PricingMode } from "@/domain/value-objects/pricing-mode";
import { WorkerSnapshot } from "@/domain/value-objects/worker-snapshot";

interface CommercialDocumentDeps {
  budgetRepository: BudgetRepository;
  invoiceRepository: InvoiceRepository;
  jobItemRepository: JobItemRepository;
  clientRepository: ClientRepository;
  workerRepository: WorkerRepository;
  taxRepository: TaxRepository;
  templateRepository: WorkTemplateRepository;
  settingsRepository: CommercialDocumentSettingsRepository;
}

export function createCommercialDocumentsUseCases(deps: CommercialDocumentDeps) {
  return {
    async createBudget(params: {
      clientId: string;
      workerId: string;
      clientSnapshot: ClientSnapshot | null;
      workerSnapshot: WorkerSnapshot | null;
      notes: string | null;
      taxId: string | null;
      pricingMode?: PricingMode;
      manualSubtotalAmount?: number | null;
    }): Promise<Budget> {
      const defaultPricingModes = await deps.settingsRepository.getDefaultPricingModes();
      return createBudget(
        params.clientId,
        params.workerId,
        params.notes,
        params.taxId,
        params.pricingMode ?? defaultPricingModes.budget,
        params.manualSubtotalAmount ?? null,
        params.clientSnapshot,
        params.workerSnapshot,
        deps.budgetRepository,
        deps.settingsRepository,
        deps.clientRepository,
        deps.workerRepository,
        deps.taxRepository
      );
    },

    async listBudgets(page: number, limit: number, clientId?: string, search?: string) {
      return deps.budgetRepository.list(page, limit, clientId, search);
    },

    async getBudgetById(id: string): Promise<Budget> {
      return deps.budgetRepository.getById(id);
    },

    async updateBudget(
      id: string,
      params: {
        notes?: string | null;
        deliveredAt?: Date | null;
        taxId?: string | null;
        pricingMode?: PricingMode;
        manualSubtotalAmount?: number | null;
        clientSnapshot?: ClientSnapshot;
        workerSnapshot?: WorkerSnapshot;
      }
    ): Promise<Budget> {
      if (params.taxId !== undefined) {
        await updateBudgetTax(id, params.taxId, deps.budgetRepository, deps.taxRepository);
      }

      const budget = await deps.budgetRepository.getById(id);
      if (params.notes !== undefined) {
        budget.notes = params.notes;
      }
      if (params.deliveredAt !== undefined) {
        budget.deliveredAt = params.deliveredAt;
      }
      if (params.clientSnapshot !== undefined) {
        budget.clientSnapshot = params.clientSnapshot;
      }
      if (params.workerSnapshot !== undefined) {
        budget.workerSnapshot = params.workerSnapshot;
      }
      if (params.pricingMode !== undefined) {
        budget.pricingMode = params.pricingMode;
      }
      if (params.manualSubtotalAmount !== undefined) {
        budget.manualSubtotalAmount = params.manualSubtotalAmount;
      }
      budget.updatedAt = new Date();
      await deps.budgetRepository.update(budget);
      return calculateBudgetTotals(id, deps.jobItemRepository, deps.budgetRepository);
    },

    async addBudgetItem(
      budgetId: string,
      params: { title: string; description: string | null; quantity: number | null; unitPrice: number | null; totalPrice: number | null }
    ): Promise<JobItem> {
      const item = await addJobItem(
        budgetId,
        params.title,
        params.description,
        params.quantity,
        params.unitPrice,
        params.totalPrice,
        deps.jobItemRepository
      );
      await calculateBudgetTotals(budgetId, deps.jobItemRepository, deps.budgetRepository);
      return item;
    },

    async listBudgetItems(budgetId: string): Promise<JobItem[]> {
      return deps.jobItemRepository.findByDocumentId(budgetId);
    },

    async updateBudgetItem(
      budgetId: string,
      itemId: string,
      params: { title: string; description: string | null; quantity: number | null; unitPrice: number | null; totalPrice: number | null; position?: number }
    ): Promise<JobItem> {
      const item = await updateJobItem(
        itemId,
        params.title,
        params.description,
        params.quantity,
        params.unitPrice,
        params.totalPrice,
        deps.jobItemRepository,
        params.position
      );
      await calculateBudgetTotals(budgetId, deps.jobItemRepository, deps.budgetRepository);
      return item;
    },

    async removeBudgetItem(budgetId: string, itemId: string): Promise<void> {
      await removeJobItem(itemId, deps.jobItemRepository);
      await calculateBudgetTotals(budgetId, deps.jobItemRepository, deps.budgetRepository);
    },

    async createInvoice(params: {
      clientId: string;
      workerId: string;
      clientSnapshot: ClientSnapshot | null;
      workerSnapshot: WorkerSnapshot | null;
      notes: string | null;
      taxId: string | null;
      pricingMode?: PricingMode;
      manualSubtotalAmount?: number | null;
      sourceBudgetId: string | null;
    }): Promise<Invoice> {
      const defaultPricingModes = await deps.settingsRepository.getDefaultPricingModes();
      return createInvoice(
        params.clientId,
        params.workerId,
        params.notes,
        params.taxId,
        params.pricingMode ?? defaultPricingModes.invoice,
        params.manualSubtotalAmount ?? null,
        params.sourceBudgetId,
        params.clientSnapshot,
        params.workerSnapshot,
        deps.invoiceRepository,
        deps.settingsRepository,
        deps.clientRepository,
        deps.workerRepository,
        deps.taxRepository
      );
    },

    async listInvoices(page: number, limit: number, clientId?: string, year?: number, search?: string) {
      return deps.invoiceRepository.list(page, limit, clientId, year, search);
    },

    async getInvoiceById(id: string): Promise<Invoice> {
      return deps.invoiceRepository.getById(id);
    },

    async updateInvoice(
      id: string,
      params: {
        notes?: string | null;
        issuedAt?: Date | null;
        taxId?: string | null;
        pricingMode?: PricingMode;
        manualSubtotalAmount?: number | null;
        sourceBudgetId?: string | null;
        clientSnapshot?: ClientSnapshot;
        workerSnapshot?: WorkerSnapshot;
      }
    ): Promise<Invoice> {
      if (params.taxId !== undefined) {
        await updateInvoiceTax(id, params.taxId, deps.invoiceRepository, deps.taxRepository);
      }

      const invoice = await deps.invoiceRepository.getById(id);
      if (params.notes !== undefined) {
        invoice.notes = params.notes;
      }
      if (params.issuedAt !== undefined) {
        invoice.issuedAt = params.issuedAt;
      }
      if (params.sourceBudgetId !== undefined) {
        invoice.sourceBudgetId = params.sourceBudgetId;
      }
      if (params.clientSnapshot !== undefined) {
        invoice.clientSnapshot = params.clientSnapshot;
      }
      if (params.workerSnapshot !== undefined) {
        invoice.workerSnapshot = params.workerSnapshot;
      }
      if (params.pricingMode !== undefined) {
        invoice.pricingMode = params.pricingMode;
      }
      if (params.manualSubtotalAmount !== undefined) {
        invoice.manualSubtotalAmount = params.manualSubtotalAmount;
      }
      invoice.updatedAt = new Date();
      await deps.invoiceRepository.update(invoice);
      return calculateInvoiceTotals(id, deps.jobItemRepository, deps.invoiceRepository);
    },

    async addInvoiceItem(
      invoiceId: string,
      params: { title: string; description: string | null; quantity: number | null; unitPrice: number | null; totalPrice: number | null }
    ): Promise<JobItem> {
      const item = await addJobItem(
        invoiceId,
        params.title,
        params.description,
        params.quantity,
        params.unitPrice,
        params.totalPrice,
        deps.jobItemRepository
      );
      await calculateInvoiceTotals(invoiceId, deps.jobItemRepository, deps.invoiceRepository);
      return item;
    },

    async listInvoiceItems(invoiceId: string): Promise<JobItem[]> {
      return deps.jobItemRepository.findByDocumentId(invoiceId);
    },

    async updateInvoiceItem(
      invoiceId: string,
      itemId: string,
      params: { title: string; description: string | null; quantity: number | null; unitPrice: number | null; totalPrice: number | null; position?: number }
    ): Promise<JobItem> {
      const item = await updateJobItem(
        itemId,
        params.title,
        params.description,
        params.quantity,
        params.unitPrice,
        params.totalPrice,
        deps.jobItemRepository,
        params.position
      );
      await calculateInvoiceTotals(invoiceId, deps.jobItemRepository, deps.invoiceRepository);
      return item;
    },

    async removeInvoiceItem(invoiceId: string, itemId: string): Promise<void> {
      await removeJobItem(itemId, deps.jobItemRepository);
      await calculateInvoiceTotals(invoiceId, deps.jobItemRepository, deps.invoiceRepository);
    },

    async createTax(params: { name: string; rate: number }): Promise<Tax> {
      return createTaxUseCase(params.name, params.rate, deps.taxRepository);
    },

    async listTaxes(page: number, limit: number, includeInactive?: boolean) {
      return deps.taxRepository.list(page, limit, includeInactive);
    },

    async getTaxById(id: string): Promise<Tax> {
      return deps.taxRepository.getById(id);
    },

    async updateTax(
      id: string,
      params: { name: string; rate: number; isActive?: boolean }
    ): Promise<Tax> {
      let tax = await updateTaxUseCase(id, params.name, params.rate, deps.taxRepository);
      if (params.isActive === false) {
        tax = await deactivateTaxUseCase(id, deps.taxRepository);
      }
      return tax;
    },

    async archiveTax(id: string): Promise<void> {
      return archiveTaxUseCase(id, deps.taxRepository);
    },

    async createWorkTemplate(params: {
      title: string;
      description: string | null;
      defaultUnitPrice: number | null;
    }): Promise<WorkTemplate> {
      return createWorkTemplate(params.title, params.description, params.defaultUnitPrice, deps.templateRepository);
    },

    async listWorkTemplates(page: number, limit: number, includeInactive?: boolean) {
      return deps.templateRepository.list(page, limit, includeInactive);
    },

    async getWorkTemplateById(id: string): Promise<WorkTemplate> {
      return deps.templateRepository.getById(id);
    },

    async updateWorkTemplate(
      id: string,
      params: { title: string; description: string | null; defaultUnitPrice: number | null; isActive?: boolean }
    ): Promise<WorkTemplate> {
      let template = await updateWorkTemplate(
        id,
        params.title,
        params.description,
        params.defaultUnitPrice,
        deps.templateRepository
      );
      if (params.isActive === false) {
        template = await deactivateWorkTemplate(id, deps.templateRepository);
      }
      return template;
    },

    async archiveWorkTemplate(id: string): Promise<void> {
      return archiveWorkTemplate(id, deps.templateRepository);
    },

    async getSequenceState(documentType: "budget" | "invoice", year: number | null): Promise<DocumentSequence> {
      return deps.settingsRepository.getSequence(documentType, year);
    },

    async adjustSequence(
      documentType: "budget" | "invoice",
      year: number | null,
      nextNumber: number
    ): Promise<DocumentSequence> {
      return deps.settingsRepository.adjustSequence(documentType, year, nextNumber);
    },

    async getDefaultPricingModes(): Promise<{ budget: PricingMode; invoice: PricingMode }> {
      return deps.settingsRepository.getDefaultPricingModes();
    },

    async setDefaultPricingModes(modes: { budget: PricingMode; invoice: PricingMode }): Promise<{ budget: PricingMode; invoice: PricingMode }> {
      return deps.settingsRepository.setDefaultPricingModes(modes);
    }
  };
}
