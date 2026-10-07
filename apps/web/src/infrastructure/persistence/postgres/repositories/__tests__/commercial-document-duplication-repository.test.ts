import { deleteBudgetRecord, duplicateBudgetRecord } from "@/infrastructure/persistence/postgres/repositories/budget-repository";
import { deleteInvoiceRecord, duplicateInvoiceRecord } from "@/infrastructure/persistence/postgres/repositories/invoice-repository";

const query = jest.fn();
const release = jest.fn();
const connect = jest.fn(async () => ({ query, release }));
const poolQuery = jest.fn();

jest.mock("@/infrastructure/persistence/postgres/db", () => ({
  ensureDatabaseReady: jest.fn().mockResolvedValue(undefined),
  getDbPool: jest.fn(() => ({ connect, query: poolQuery }))
}));

function budgetRow() {
  return {
    id: "budget-new",
    number: "8",
    identifier_source: "custom" as const,
    client_id: "client-1",
    worker_id: "worker-1",
    notes: "Notes",
    delivered_at: null,
    client_snapshot_name: "Client",
    client_snapshot_tax_id: "TAX",
    client_snapshot_phone: null,
    client_snapshot_email: null,
    client_snapshot_work_street: "Street",
    client_snapshot_work_city: "City",
    client_snapshot_work_postal_code: "123",
    client_snapshot_billing_street: "Billing",
    client_snapshot_billing_city: "City",
    client_snapshot_billing_postal_code: "123",
    worker_snapshot_name: "Worker",
    worker_snapshot_tax_id: "WTAX",
    worker_snapshot_phone: null,
    worker_snapshot_email: null,
    worker_snapshot_work_street: "Worker Street",
    worker_snapshot_work_city: "City",
    worker_snapshot_work_postal_code: "123",
    worker_snapshot_billing_street: "Worker Billing",
    worker_snapshot_billing_city: "City",
    worker_snapshot_billing_postal_code: "123",
    worker_snapshot_bank_account: null,
    tax_snapshot_name: null,
    tax_snapshot_rate: null,
    tax_snapshot_behavior: null,
    pricing_mode: "computed" as const,
    manual_subtotal_amount: null,
    subtotal_amount: "100",
    tax_amount: "0",
    total_amount: "100",
    created_at: new Date(),
    updated_at: new Date()
  };
}

function invoiceRow() {
  return {
    ...budgetRow(),
    id: "invoice-new",
    number: "4/2026",
    issued_at: null,
    source_budget_id: "budget-1"
  };
}

describe("commercial document duplication repositories", () => {
  beforeEach(() => {
    query.mockReset();
    release.mockReset();
    poolQuery.mockReset();
  });

  it("duplicates a budget and its line items in one transaction", async () => {
    query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ id: "budget-1" }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ next_number: 8 }] })
      .mockResolvedValueOnce({ rows: [budgetRow()] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    const result = await duplicateBudgetRecord("budget-1");

    expect(result.id).toBe("budget-new");
    expect(result.number).toBe("8");
    expect(result.identifierSource).toBe("custom");
    const budgetInsert = query.mock.calls.find(([sql]) => String(sql).includes("INSERT INTO budgets"));
    expect(budgetInsert?.[0]).toContain("SELECT $1, $2, identifier_source, client_id");
    expect(query).toHaveBeenLastCalledWith("COMMIT");
    expect(release).toHaveBeenCalledTimes(1);
    expect(query.mock.calls.some(([sql]) => String(sql).includes("gen_random_uuid()"))).toBe(true);
  });

  it("duplicates an invoice using the current year sequence and preserves its source budget", async () => {
    query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ id: "invoice-1" }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ invoice_next_numbers: { "2026": 4 } }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [invoiceRow()] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    const result = await duplicateInvoiceRecord("invoice-1");

    expect(result.number).toBe("4/2026");
    expect(result.sourceBudgetId).toBe("budget-1");
    expect(result.issuedAt).toBeNull();
    const invoiceInsert = query.mock.calls.find(([sql]) => String(sql).includes("INSERT INTO invoices"));
    expect(invoiceInsert?.[0]).toContain("SELECT $1, $2, identifier_source, client_id");
    expect(query).toHaveBeenLastCalledWith("COMMIT");
    expect(release).toHaveBeenCalledTimes(1);
  });

  it("does not allocate a budget number when the source does not exist", async () => {
    query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    await expect(duplicateBudgetRecord("missing")).rejects.toThrow("Budget not found");

    expect(query).not.toHaveBeenCalledWith(expect.stringContaining("default_budget_next_number"));
    expect(query).toHaveBeenLastCalledWith("ROLLBACK");
    expect(release).toHaveBeenCalledTimes(1);
  });

  it("rolls back an invoice when line-item persistence fails", async () => {
    query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ id: "invoice-1" }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ invoice_next_numbers: {} }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [invoiceRow()] })
      .mockRejectedValueOnce(new Error("line item insert failed"))
      .mockResolvedValueOnce({ rows: [] });

    await expect(duplicateInvoiceRecord("invoice-1")).rejects.toThrow("line item insert failed");

    expect(query).toHaveBeenLastCalledWith("ROLLBACK");
    expect(release).toHaveBeenCalledTimes(1);
  });

  it("soft-deletes a budget and clears invoice source references transactionally", async () => {
    query
      .mockResolvedValueOnce({ rowCount: 1 })
      .mockResolvedValueOnce({ rowCount: 2 })
      .mockResolvedValueOnce({ rows: [] });

    await deleteBudgetRecord("budget-1");

    expect(query.mock.calls[1][0]).toContain("UPDATE budgets SET is_active = false");
    expect(query.mock.calls[2]).toEqual([
      "UPDATE invoices SET source_budget_id = NULL WHERE source_budget_id = $1",
      ["budget-1"]
    ]);
    expect(query).toHaveBeenLastCalledWith("COMMIT");
  });

  it("soft-deletes an invoice without deleting its aggregate", async () => {
    poolQuery.mockResolvedValueOnce({ rowCount: 1 });

    await deleteInvoiceRecord("invoice-1");

    expect(poolQuery).toHaveBeenCalledWith(
      "UPDATE invoices SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND is_active = true",
      ["invoice-1"]
    );
    expect(poolQuery.mock.calls.some(([sql]) => String(sql).startsWith("DELETE FROM"))).toBe(false);
  });
});
