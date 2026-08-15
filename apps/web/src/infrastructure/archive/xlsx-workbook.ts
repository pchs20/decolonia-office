import * as XLSX from "xlsx";
import { BackupTable } from "@/application/outbound/backup-export-ports";

export function createWorkbookBytes(tables: BackupTable[]): Uint8Array {
  const workbook = XLSX.utils.book_new();

  for (const table of tables) {
    const worksheet = XLSX.utils.aoa_to_sheet([table.columns, ...table.rows]);
    XLSX.utils.book_append_sheet(workbook, worksheet, table.name);
  }

  return new Uint8Array(XLSX.write(workbook, { bookType: "xlsx", type: "buffer" }));
}
