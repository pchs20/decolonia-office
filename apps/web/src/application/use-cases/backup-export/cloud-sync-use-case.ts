import {
  BackupCell,
  BackupDataSource,
  CloudFilePort,
  CloudSpreadsheetPort,
  DocumentPdfRenderer
} from "@/application/outbound/backup-export-ports";
import {
  DocumentExportStateRepository,
  ExportDocumentType
} from "@/application/outbound/document-export-state-repository";
import { ExportProvider } from "@/application/outbound/export-provider";
import { buildBackupTables } from "@/application/use-cases/backup-export/backup-bundle-use-case";
import { getDatePath } from "@/application/use-cases/backup-export/date-path";

interface ExportRecord extends Record<string, BackupCell> {}

export interface CloudSyncDestination {
  provider: ExportProvider;
  destinationReference: string;
  budgetsFolderReference: string;
  invoicesFolderReference: string;
  spreadsheetReference: string;
  filePort: CloudFilePort;
  spreadsheetPort: CloudSpreadsheetPort;
}

export interface CloudSyncBatchDependencies {
  dataSource: BackupDataSource;
  pdfRenderer: DocumentPdfRenderer;
  exportStateRepository: DocumentExportStateRepository;
  destination: CloudSyncDestination;
}

export interface CloudSyncBatchInput {
  cursor?: number;
  batchSize?: number;
}

export interface CloudSyncBatchResult {
  cursor: number;
  nextCursor: number | null;
  processed: number;
  skipped: number;
  skippedCount: number;
  remaining: number;
  spreadsheetUpdated: boolean;
  uploadedDocuments: { type: ExportDocumentType; path: string }[];
  failures: { documentType: ExportDocumentType; documentId: string; message: string }[];
}

function value(record: ExportRecord, ...names: string[]): BackupCell {
  for (const name of names) {
    if (record[name] !== null && record[name] !== undefined) return record[name];
  }
  return null;
}

function asDocumentId(record: ExportRecord): string {
  return String(value(record, "id") ?? "unknown");
}

function asDate(record: ExportRecord, ...names: string[]): Date {
  const raw = value(record, ...names);
  const date = raw ? new Date(String(raw)) : new Date(0);
  return Number.isNaN(date.getTime()) ? new Date(0) : date;
}

function fileName(type: ExportDocumentType, record: ExportRecord): string {
  const number = String(value(record, "number") ?? asDocumentId(record)).replace(/[^a-zA-Z0-9-]/g, "-");
  return `${type === "budget" ? "presupuesto" : "factura"}-${number}.pdf`;
}

async function ensurePeriodFolder(
  filePort: CloudFilePort,
  parentFolderReference: string,
  date: Date
): Promise<string> {
  const year = await filePort.ensureFolder({
    name: String(date.getUTCFullYear()),
    parentFolderReference
  });
  const period = await filePort.ensureFolder({
    name: getDatePath(date).period,
    parentFolderReference: year.externalReference
  });
  return period.externalReference;
}

export async function synchronizeCloudBatch(
  dependencies: CloudSyncBatchDependencies,
  input: CloudSyncBatchInput = {}
): Promise<CloudSyncBatchResult> {
  const cursor = Math.max(0, Math.floor(input.cursor ?? 0));
  const batchSize = Math.min(20, Math.max(1, Math.floor(input.batchSize ?? 5)));
  const [clients, budgets, invoices] = await Promise.all([
    dependencies.dataSource.getClientsForExport(),
    dependencies.dataSource.getBudgetsForExport(),
    dependencies.dataSource.getInvoicesForExport()
  ]);
  const tables = [
    buildBackupTables("Clients", clients),
    buildBackupTables("Budgets", budgets),
    buildBackupTables("Invoices", invoices)
  ];
  let spreadsheetUpdated = false;

  if (cursor === 0) {
    await dependencies.destination.spreadsheetPort.replaceTables({
      spreadsheetReference: dependencies.destination.spreadsheetReference,
      tables
    });
    spreadsheetUpdated = true;
  }

  const documents = [
    ...budgets.map((record) => ({ type: "budget" as const, record })),
    ...invoices.map((record) => ({ type: "invoice" as const, record }))
  ];
  const batch = documents.slice(cursor, cursor + batchSize);
  let processed = 0;
  let skipped = 0;
  const uploadedDocuments: CloudSyncBatchResult["uploadedDocuments"] = [];
  const failures: CloudSyncBatchResult["failures"] = [];

  for (const document of batch) {
    const documentId = asDocumentId(document.record);
    const sourceUpdatedAt = asDate(document.record, "updatedAt", "updated_at");
    const previous = await dependencies.exportStateRepository.getByDocument(
      document.type,
      documentId,
        dependencies.destination.provider,
        dependencies.destination.destinationReference
    );

    if (previous?.sourceUpdatedAt?.getTime() === sourceUpdatedAt.getTime()) {
      skipped += 1;
      continue;
    }

    try {
      const content = document.type === "budget"
        ? await dependencies.pdfRenderer.renderBudgetPdf(documentId)
        : await dependencies.pdfRenderer.renderInvoicePdf(documentId);
      const date = document.type === "budget"
        ? asDate(document.record, "deliveredAt", "delivered_at", "createdAt", "created_at")
        : asDate(document.record, "issuedAt", "issued_at", "createdAt", "created_at");
      const parentFolderReference = await ensurePeriodFolder(
        dependencies.destination.filePort,
        document.type === "budget"
          ? dependencies.destination.budgetsFolderReference
          : dependencies.destination.invoicesFolderReference,
        date
      );
      const uploaded = await dependencies.destination.filePort.upsertFile({
        externalReference: previous?.externalReference ?? undefined,
        parentFolderReference,
        name: fileName(document.type, document.record),
        content,
        contentType: "application/pdf"
      });
      await dependencies.exportStateRepository.recordSuccess({
        documentType: document.type,
        documentId,
        provider: dependencies.destination.provider,
        destinationReference: dependencies.destination.destinationReference,
        externalReference: uploaded.externalReference,
        sourceUpdatedAt
      });
      const folderType = document.type === "budget" ? "Budgets" : "Invoices";
      const datePathInfo = getDatePath(date);
      const path = `${folderType}/${datePathInfo.year}/${datePathInfo.period}/${fileName(document.type, document.record)}`;
      uploadedDocuments.push({ type: document.type, path });
      processed += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Cloud export failed";
      await dependencies.exportStateRepository.recordFailure({
        documentType: document.type,
        documentId,
        provider: dependencies.destination.provider,
        destinationReference: dependencies.destination.destinationReference,
        error: message
      });
      failures.push({ documentType: document.type, documentId, message });
    }
  }

  const nextCursor = cursor + batch.length < documents.length ? cursor + batch.length : null;
  return {
    cursor,
    nextCursor,
    processed,
    skipped,
    skippedCount: skipped,
    remaining: nextCursor === null ? 0 : documents.length - nextCursor,
    spreadsheetUpdated,
    uploadedDocuments,
    failures
  };
}
