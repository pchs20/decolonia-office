import JSZip from "jszip";
import * as XLSX from "xlsx";
import { zipBackupArchive } from "@/infrastructure/archive/zip-backup-archive";
import { BackupBundle } from "@/application/outbound/backup-export-ports";

describe("ZipBackupArchive", () => {
  it("contains the workbook and deterministic document paths", async () => {
    const bundle: BackupBundle = {
      tables: [
        { name: "Clients", columns: ["id"], rows: [["client-1"]] },
        { name: "Budgets", columns: ["id"], rows: [["budget-1"]] },
        { name: "Invoices", columns: ["id"], rows: [["invoice-1"]] }
      ],
      files: [
        {
          path: "Budgets/2026/Q1/presupuesto-1.pdf",
          content: new Uint8Array([1, 2, 3]),
          contentType: "application/pdf"
        },
        {
          path: "Invoices/2026/Q1/factura-1.pdf",
          content: new Uint8Array([4, 5, 6]),
          contentType: "application/pdf"
        }
      ]
    };

    const archiveBytes = await zipBackupArchive.createArchive(bundle);
    const archive = await JSZip.loadAsync(archiveBytes);
    const workbook = XLSX.read(await archive.file("Decolonia-data.xlsx")?.async("uint8array"), { type: "array" });

    expect(Object.keys(archive.files).filter((path) => !path.endsWith("/"))).toEqual([
      "Decolonia-data.xlsx",
      "Budgets/2026/Q1/presupuesto-1.pdf",
      "Invoices/2026/Q1/factura-1.pdf"
    ]);
    expect(workbook.SheetNames).toEqual(["Clients", "Budgets", "Invoices"]);
    expect(await archive.file("Budgets/2026/Q1/presupuesto-1.pdf")?.async("uint8array")).toEqual(new Uint8Array([1, 2, 3]));
  });
});
