import {
  calculateBudgetTotals,
  createBudget
} from "@/application/use-cases/budget-use-cases";
import { BudgetRepository } from "@/application/outbound/budget-repository";
import { CommercialDocumentSettingsRepository } from "@/application/outbound/commercial-document-settings-repository";
import { ClientRepository } from "@/application/outbound/client-repository";
import { WorkerRepository } from "@/application/outbound/worker-repository";
import { TaxRepository } from "@/application/outbound/tax-repository";
import { JobItemRepository } from "@/application/outbound/job-item-repository";

describe("budget use-cases", () => {
  const budgetRepo: jest.Mocked<BudgetRepository> = {
    create: jest.fn(),
    getById: jest.fn(),
    list: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
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
    list: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
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

  it("creates budget with materialized party/tax data", async () => {
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
      isActive: true,
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
    settingsRepo.allocateNumber.mockResolvedValueOnce(12);
    budgetRepo.create.mockImplementation(async budget => budget);

    const created = await createBudget(
      "c-1",
      "w-1",
      "note",
      "t-1",
      "computed",
      null,
      null,
      null,
      budgetRepo,
      settingsRepo,
      clientRepo,
      workerRepo,
      taxRepo
    );

    expect(settingsRepo.allocateNumber).toHaveBeenCalledWith("budget", null);
    expect(created.number).toBe("12");
    expect(created.clientSnapshot.name).toBe("Client A");
    expect(created.workerSnapshot.name).toBe("Worker A");
    expect(created.taxSnapshot?.rate).toBe(21);
  });

  it("recalculates totals from items and tax", async () => {
    budgetRepo.getById.mockResolvedValueOnce({
      id: "b-1",
      number: "1",
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
        workAddress: { street: "W2", city: "C2", postalCode: "3" },
        billingAddress: { street: "B2", city: "BC2", postalCode: "4" }
      },
      notes: null,
      taxSnapshot: { name: "VAT", rate: 10, behavior: "added" },
      pricingMode: "computed",
      manualSubtotalAmount: null,
      subtotalAmount: 0,
      taxAmount: 0,
      totalAmount: 0,
      deliveredAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    jobItemRepo.findByDocumentId.mockResolvedValueOnce([
      {
        id: "i1",
        commercialDocumentId: "b-1",
        position: 1,
        title: "A",
        description: null,
        quantity: null,
        unitPrice: null,
        totalPrice: 100
      },
      {
        id: "i2",
        commercialDocumentId: "b-1",
        position: 2,
        title: "B",
        description: null,
        quantity: 2,
        unitPrice: 50,
        totalPrice: null
      }
    ]);
    budgetRepo.update.mockImplementation(async budget => budget);

    const updated = await calculateBudgetTotals("b-1", jobItemRepo, budgetRepo);

    expect(updated.subtotalAmount).toBe(200);
    expect(updated.taxAmount).toBe(20);
    expect(updated.totalAmount).toBe(220);
  });
});
