import { NextRequest } from "next/server";
import { POST as duplicateBudget } from "../../app/api/budgets/[id]/duplicate/route";
import { POST as duplicateInvoice } from "../../app/api/invoices/[id]/duplicate/route";
import { commercialDocumentsUseCases } from "@/api/composition/commercial-documents";

const budget = { id: "budget-new", number: "8" };
const invoice = { id: "invoice-new", number: "4/2026" };

jest.mock("@/api/composition/commercial-documents", () => ({
  commercialDocumentsUseCases: {
    duplicateBudget: jest.fn(),
    duplicateInvoice: jest.fn()
  }
}));

jest.mock("@/api/mappers/budget-mapper", () => ({
  mapBudgetToResponse: (value: unknown) => value
}));

jest.mock("@/api/mappers/invoice-mapper", () => ({
  mapInvoiceToResponse: (value: unknown) => value
}));

describe("commercial document duplication routes", () => {
  const mockDuplicateBudgetUseCase = commercialDocumentsUseCases.duplicateBudget as jest.Mock;
  const mockDuplicateInvoiceUseCase = commercialDocumentsUseCases.duplicateInvoice as jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns a duplicated budget with HTTP 201", async () => {
    mockDuplicateBudgetUseCase.mockResolvedValue(budget);

    const response = await duplicateBudget(
      new NextRequest("http://localhost/api/budgets/budget-1/duplicate", { method: "POST" }),
      { params: Promise.resolve({ id: "budget-1" }) }
    );

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual(budget);
    expect(mockDuplicateBudgetUseCase).toHaveBeenCalledWith("budget-1");
  });

  it("returns a duplicated invoice with HTTP 201", async () => {
    mockDuplicateInvoiceUseCase.mockResolvedValue(invoice);

    const response = await duplicateInvoice(
      new NextRequest("http://localhost/api/invoices/invoice-1/duplicate", { method: "POST" }),
      { params: Promise.resolve({ id: "invoice-1" }) }
    );

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual(invoice);
    expect(mockDuplicateInvoiceUseCase).toHaveBeenCalledWith("invoice-1");
  });

  it("maps a missing source to HTTP 404", async () => {
    const { EntityNotFoundError } = await import("@/domain/exceptions");
    mockDuplicateBudgetUseCase.mockRejectedValue(new EntityNotFoundError("Budget not found"));

    const response = await duplicateBudget(
      new NextRequest("http://localhost/api/budgets/missing/duplicate", { method: "POST" }),
      { params: Promise.resolve({ id: "missing" }) }
    );

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ message: "Budget not found" });
  });
});
