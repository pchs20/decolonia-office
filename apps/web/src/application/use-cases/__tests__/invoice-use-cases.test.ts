import {
  calculateInvoiceTotals,
  createInvoice
} from "@/application/use-cases/invoice-use-cases";
import { InvoiceRepository } from "@/application/outbound/invoice-repository";
import { CommercialDocumentSettingsRepository } from "@/application/outbound/commercial-document-settings-repository";
import { ClientRepository } from "@/application/outbound/client-repository";
import { WorkerRepository } from "@/application/outbound/worker-repository";
import { TaxRepository } from "@/application/outbound/tax-repository";
import { JobItemRepository } from "@/application/outbound/job-item-repository";

describe("invoice use-cases", () => {
  const invoiceRepo: jest.Mocked<InvoiceRepository> = {
    create: jest.fn(),
    getById: jest.fn(),
    list: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    duplicate: jest.fn()
  };

  const settingsRepo: jest.Mocked<CommercialDocumentSettingsRepository> = {
    getDefaultPricingModes: jest.fn(),
    setDefaultPricingModes: jest.fn(),
    getSequence: jest.fn(),
    allocateNumber: jest.fn(),
    adjustSequence: jest.fn()
  };

  const clientRepo: jest.Mocked<ClientRepository> = {
    create: jest.fn(),
    getById: jest.fn(),
    list: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  };

  const workerRepo: jest.Mocked<WorkerRepository> = {
    create: jest.fn(),
    getById: jest.fn(),
    getByPrimary: jest.fn(),
    list: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    setPrimary: jest.fn()
  };

  const taxRepo: jest.Mocked<TaxRepository> = {
    create: jest.fn(),
    getById: jest.fn(),
    list: jest.fn(),
    update: jest.fn(),
    archive: jest.fn()
  };

  const jobItemRepo: jest.Mocked<JobItemRepository> = {
    create: jest.fn(),
    findByDocumentId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("creates invoice with year-scoped sequence number", async () => {
    clientRepo.getById.mockResolvedValueOnce({
      id: "c-1",
      name: "Client A",
      type: "company",
      workAddress: { street: "W", city: "C", postalCode: "1" },
      billingAddress: { street: "B", city: "BC", postalCode: "2" },
      taxId: "T1",
      phone: null,
      email: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    workerRepo.getById.mockResolvedValueOnce({
      id: "w-1",
      name: "Worker A",
      workAddress: { street: "W2", city: "C2", postalCode: "3" },
      billingAddress: { street: "B2", city: "BC2", postalCode: "4" },
      taxId: "TW",
      phone: null,
      email: null,
      bankAccount: null,
      isActive: true,
      isPrimary: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    taxRepo.getById.mockResolvedValueOnce({
      id: "t-1",
      name: "VAT",
      rate: 21,
      behavior: "added",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    settingsRepo.allocateNumber.mockResolvedValueOnce(7);
    invoiceRepo.create.mockImplementation(async invoice => invoice);

    const created = await createInvoice(
      "c-1",
      "w-1",
      "note",
      "t-1",
      "computed",
      null,
      "b-1",
      null,
      null,
      invoiceRepo,
      settingsRepo,
      clientRepo,
      workerRepo,
      taxRepo
    );

    expect(settingsRepo.allocateNumber).toHaveBeenCalled();
    expect(created.number).toContain("7/");
    expect(created.sourceBudgetId).toBe("b-1");
  });

  it("recalculates invoice totals from items and tax", async () => {
    invoiceRepo.getById.mockResolvedValueOnce({
      id: "i-1",
      number: "1/2026",
      clientId: "c-1",
      clientSnapshot: {
        name: "Client A",
        taxId: "T1",
        phone: null,
        email: null,
        workAddress: { street: "W", city: "C", postalCode: "1" },
        billingAddress: { street: "B", city: "BC", postalCode: "2" }
      },
      workerId: "w-1",
      workerSnapshot: {
        name: "Worker A",
        taxId: "TW",
        phone: null,
        email: null,
        bankAccount: null,
        workAddress: { street: "W2", city: "C2", postalCode: "3" },
        billingAddress: { street: "B2", city: "BC2", postalCode: "4" }
      },
      notes: null,
      taxSnapshot: { name: "VAT", rate: 21, behavior: "added" },
      pricingMode: "computed",
      manualSubtotalAmount: null,
      subtotalAmount: 0,
      taxAmount: 0,
      totalAmount: 0,
      issuedAt: null,
      sourceBudgetId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    jobItemRepo.findByDocumentId.mockResolvedValueOnce([
      {
        id: "j1",
        commercialDocumentId: "i-1",
        position: 1,
        title: "A",
        description: null,
        quantity: 2,
        unitPrice: 30,
        totalPrice: null
      }
    ]);
    invoiceRepo.update.mockImplementation(async invoice => invoice);

    const updated = await calculateInvoiceTotals("i-1", jobItemRepo, invoiceRepo);

    expect(updated.subtotalAmount).toBe(60);
    expect(updated.taxAmount).toBe(12.6);
    expect(updated.totalAmount).toBe(72.6);
  });
});
