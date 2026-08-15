import {
  BackupBundle,
  BackupCell,
  BackupDataSource,
  BackupTable,
  DocumentPdfRenderer
} from "@/application/outbound/backup-export-ports";
import { getDatePath } from "@/application/use-cases/backup-export/date-path";

const documentNumberPattern = /[^a-zA-Z0-9-]/g;

type ExportRecord = Record<string, BackupCell>;

export function buildBackupTables(
  name: BackupTable["name"],
  records: ExportRecord[]
): BackupTable {
  const columns = [...new Set(records.flatMap((record) => Object.keys(record)))].sort();

  return {
    name,
    columns,
    rows: records.map((record) => columns.map((column) => record[column] ?? null))
  };
}

function getRecordValue(record: ExportRecord, ...names: string[]): BackupCell {
  for (const name of names) {
    if (record[name] !== null && record[name] !== undefined) {
      return record[name];
    }
  }

  return null;
}

function formatDocumentNumber(value: BackupCell, fallbackId: string): string {
  const number = String(value ?? fallbackId).replace(documentNumberPattern, "-");
  return number || fallbackId;
}

function getRecordId(record: ExportRecord): string {
  return String(getRecordValue(record, "id") ?? "unknown");
}

async function renderDocumentFiles(
  records: ExportRecord[],
  documentType: "budget" | "invoice",
  render: (documentId: string) => Promise<Uint8Array>
) {
  return Promise.all(
    records.map(async (record) => {
      const documentId = getRecordId(record);
      const dateValue = getRecordValue(record, "issuedAt", "issued_at", "deliveredAt", "delivered_at", "createdAt", "created_at");
      const date = typeof dateValue === "string" ? dateValue : null;
      const { year, period } = getDatePath(date);
      const number = formatDocumentNumber(getRecordValue(record, "number"), documentId);
      const prefix = documentType === "budget" ? "presupuesto" : "factura";
      const content = await render(documentId);

      return {
        path: `${documentType === "budget" ? "Budgets" : "Invoices"}/${year}/${period}/${prefix}-${number}.pdf`,
        content,
        contentType: "application/pdf",
        documentType,
        documentId,
        sourceUpdatedAt: new Date(String(getRecordValue(record, "updatedAt", "updated_at") ?? 0))
      };
    })
  );
}

export interface BackupBundleAssemblerDependencies {
  dataSource: BackupDataSource;
  pdfRenderer: DocumentPdfRenderer;
}

export async function assembleBackupBundle(
  dependencies: BackupBundleAssemblerDependencies
): Promise<BackupBundle> {
  const [clients, budgets, invoices] = await Promise.all([
    dependencies.dataSource.getClientsForExport(),
    dependencies.dataSource.getBudgetsForExport(),
    dependencies.dataSource.getInvoicesForExport()
  ]);

  const [budgetFiles, invoiceFiles] = await Promise.all([
    renderDocumentFiles(budgets, "budget", dependencies.pdfRenderer.renderBudgetPdf),
    renderDocumentFiles(invoices, "invoice", dependencies.pdfRenderer.renderInvoicePdf)
  ]);

  return {
    tables: [
      buildBackupTables("Clients", clients),
      buildBackupTables("Budgets", budgets),
      buildBackupTables("Invoices", invoices)
    ],
    files: [...budgetFiles, ...invoiceFiles]
  };
}
