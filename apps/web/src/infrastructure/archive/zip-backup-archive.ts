import JSZip from "jszip";
import { BackupArchivePort, BackupBundle } from "@/application/outbound/backup-export-ports";
import { createWorkbookBytes } from "@/infrastructure/archive/xlsx-workbook";

export class ZipBackupArchive implements BackupArchivePort {
  async createArchive(bundle: BackupBundle): Promise<Uint8Array> {
    const archive = new JSZip();
    archive.file("Decolonia-data.xlsx", createWorkbookBytes(bundle.tables));

    for (const file of bundle.files) {
      archive.file(file.path, file.content);
    }

    return archive.generateAsync({ type: "uint8array", compression: "DEFLATE" });
  }
}

export const zipBackupArchive = new ZipBackupArchive();
