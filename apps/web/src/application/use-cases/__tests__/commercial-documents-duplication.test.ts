import { createCommercialDocumentsUseCases } from "@/application/use-cases/commercial-documents/commercial-documents-service";
import { BudgetRepository } from "@/application/outbound/budget-repository";
import { InvoiceRepository } from "@/application/outbound/invoice-repository";
import { JobItemRepository } from "@/application/outbound/job-item-repository";
import { ClientRepository } from "@/application/outbound/client-repository";
import { WorkerRepository } from "@/application/outbound/worker-repository";
import { TaxRepository } from "@/application/outbound/tax-repository";
import { CommercialDocumentSettingsRepository } from "@/application/outbound/commercial-document-settings-repository";

describe("commercial document duplication", () => {
  const budgetRepository = { duplicate: jest.fn() } as unknown as jest.Mocked<BudgetRepository>;
  const invoiceRepository = { duplicate: jest.fn() } as unknown as jest.Mocked<InvoiceRepository>;
  const dependencies = {
    budgetRepository,
    invoiceRepository,
    jobItemRepository: {} as JobItemRepository,
    clientRepository: {} as ClientRepository,
    workerRepository: {} as WorkerRepository,
    taxRepository: {} as TaxRepository,
    settingsRepository: {} as CommercialDocumentSettingsRepository
  };

  beforeEach(() => jest.resetAllMocks());

  it("delegates budget duplication to the budget repository by id", async () => {
    const duplicate = { id: "new-budget" } as never;
    budgetRepository.duplicate.mockResolvedValue(duplicate);

    const result = await createCommercialDocumentsUseCases(dependencies).duplicateBudget("budget-1");

    expect(result).toBe(duplicate);
    expect(budgetRepository.duplicate).toHaveBeenCalledWith("budget-1");
  });

  it("delegates invoice duplication to the invoice repository by id without a year", async () => {
    const duplicate = { id: "new-invoice" } as never;
    invoiceRepository.duplicate.mockResolvedValue(duplicate);

    const result = await createCommercialDocumentsUseCases(dependencies).duplicateInvoice("invoice-1");

    expect(result).toBe(duplicate);
    expect(invoiceRepository.duplicate).toHaveBeenCalledWith("invoice-1");
  });
});
