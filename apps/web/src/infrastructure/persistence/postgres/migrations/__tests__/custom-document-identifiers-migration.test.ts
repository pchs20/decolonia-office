import { readFileSync } from "node:fs";
import { join } from "node:path";

const migration = readFileSync(join(__dirname, "../2026100300000-AllowCustomDocumentIdentifiers.sql"), "utf8");

describe("custom document identifiers migration", () => {
  it("removes number uniqueness and adds source tracking", () => {
    expect(migration).toContain("DROP CONSTRAINT IF EXISTS budgets_number_key");
    expect(migration).toContain("DROP CONSTRAINT IF EXISTS invoices_number_key");
    expect(migration).toContain("identifier_source");
    expect(migration).toContain("chk_budgets_identifier_source");
    expect(migration).toContain("chk_invoices_identifier_source");
  });
});
