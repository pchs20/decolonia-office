import fs from "node:fs";
import path from "node:path";

describe("commercial document item-add brand colors", () => {
  const invoiceForm = fs.readFileSync(
    path.resolve(__dirname, "../invoices/InvoiceForm.tsx"),
    "utf8"
  );
  const budgetForm = fs.readFileSync(
    path.resolve(__dirname, "../commercial-documents/BudgetForm.tsx"),
    "utf8"
  );
  const jobItemForm = fs.readFileSync(
    path.resolve(__dirname, "../commercial-documents/JobItemForm.tsx"),
    "utf8"
  );

  it("passes invoice green to the nested item form", () => {
    expect(invoiceForm).toContain('brandColor="invoices"');
    expect(jobItemForm).toContain(
      'budgets: "bg-budgets hover:bg-budgets/90",'
    );
    expect(jobItemForm).toContain(
      'invoices: "bg-invoices hover:bg-invoices/90"'
    );
  });

  it("passes budget blue to the nested item form", () => {
    expect(budgetForm).toContain('brandColor="budgets"');
  });
});
