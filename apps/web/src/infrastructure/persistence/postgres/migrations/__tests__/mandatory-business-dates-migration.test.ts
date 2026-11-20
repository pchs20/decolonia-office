import { readFileSync } from "node:fs";
import { join } from "node:path";

const migration = readFileSync(join(__dirname, "../2026112000000-MakeCommercialDocumentBusinessDatesRequired.sql"), "utf8");

describe("mandatory business dates migration", () => {
  it("backfills from creation timestamps and enforces non-null values", () => {
    expect(migration).toContain("SET delivered_at = created_at");
    expect(migration).toContain("SET issued_at = created_at");
    expect(migration).toContain("ALTER TABLE budgets ALTER COLUMN delivered_at SET NOT NULL");
    expect(migration).toContain("ALTER TABLE invoices ALTER COLUMN issued_at SET NOT NULL");
    expect(migration).toContain("created_at IS NULL");
    expect(migration).not.toContain("DEFAULT CURRENT_TIMESTAMP");
  });
});
