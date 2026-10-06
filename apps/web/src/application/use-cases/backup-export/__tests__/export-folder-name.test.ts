import { exportFolderName } from "@/application/use-cases/backup-export/export-folder-name";

describe("exportFolderName", () => {
  it("maps internal document types to Spanish external folder names", () => {
    expect(exportFolderName("budget")).toBe("Presupuestos");
    expect(exportFolderName("invoice")).toBe("Facturas");
  });
});
