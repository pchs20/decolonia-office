import { NextResponse } from "next/server";
import { assembleBackupBundle } from "@/application/use-cases/backup-export/backup-bundle-use-case";
import { documentPdfRenderer } from "@/api/composition/backup-export";
import { postgresBackupDataSource } from "@/infrastructure/persistence/postgres/backup-data-source";
import { zipBackupArchive } from "@/infrastructure/archive/zip-backup-archive";

export const runtime = "nodejs";

export async function GET() {
  try {
    const bundle = await assembleBackupBundle({
      dataSource: postgresBackupDataSource,
      pdfRenderer: documentPdfRenderer
    });
    const archive = await zipBackupArchive.createArchive(bundle);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    return new NextResponse(archive as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="Decolonia-backup-${timestamp}.zip"`
      }
    });
  } catch (error) {
    console.error("GET /api/backup/download failed", error);
    return NextResponse.json(
      { message: "Backup could not be generated" },
      { status: 500 }
    );
  }
}