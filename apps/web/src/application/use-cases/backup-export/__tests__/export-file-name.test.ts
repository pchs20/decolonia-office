import { exportFileName } from "@/application/use-cases/backup-export/export-file-name";

describe("exportFileName", () => {
  it("keeps identifiers readable and adds a stable document suffix", () => {
    expect(exportFileName("budget", "A/1", "budget-1234")).toBe("presupuesto-A-1-budget12.pdf");
  });

  it("produces distinct names for duplicate identifiers", () => {
    expect(exportFileName("invoice", "42", "invoice-1")).not.toBe(exportFileName("invoice", "42", "invoice-2"));
  });
});
