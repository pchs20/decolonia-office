import { readFileSync } from "node:fs";
import { join } from "node:path";

const migration = readFileSync(join(__dirname, "../2026100600000-AllowUnrestrictedJobItemTitles.sql"), "utf8");

describe("unrestricted job item titles migration", () => {
  it("changes the title column to unrestricted text", () => {
    expect(migration).toContain("ALTER TABLE job_items");
    expect(migration).toContain("ALTER COLUMN title TYPE TEXT");
  });
});
