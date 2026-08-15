export type BackupCell = string | number | boolean | null;

export interface BackupTable {
  name: "Clients" | "Budgets" | "Invoices";
  columns: string[];
  rows: BackupCell[][];
}

export interface BackupFile {
  path: string;
  content: Uint8Array;
  contentType: string;
  documentType?: "budget" | "invoice";
  documentId?: string;
  sourceUpdatedAt?: Date;
}

export interface BackupBundle {
  tables: BackupTable[];
  files: BackupFile[];
}

export interface BackupDataSource {
  getClientsForExport(): Promise<Record<string, BackupCell>[]>;
  getBudgetsForExport(): Promise<Record<string, BackupCell>[]>;
  getInvoicesForExport(): Promise<Record<string, BackupCell>[]>;
}

export interface DocumentPdfRenderer {
  renderBudgetPdf(documentId: string, locale?: string | null): Promise<Uint8Array>;
  renderInvoicePdf(documentId: string, locale?: string | null): Promise<Uint8Array>;
  getBudgetNumber(documentId: string): Promise<string>;
  getInvoiceNumber(documentId: string): Promise<string>;
}

export interface CloudSpreadsheetPort {
  ensureSpreadsheet(input: { name: string; parentFolderReference: string }): Promise<{
    externalReference: string;
  }>;
  replaceTables(input: {
    spreadsheetReference: string;
    tables: BackupTable[];
  }): Promise<void>;
}

export interface CloudFilePort {
  ensureFolder(input: {
    name: string;
    parentFolderReference: string | null;
  }): Promise<{ externalReference: string }>;
  upsertFile(input: {
    externalReference?: string;
    parentFolderReference: string;
    name: string;
    content: Uint8Array;
    contentType: string;
  }): Promise<{ externalReference: string }>;
  moveFile(input: {
    externalReference: string;
    parentFolderReference: string;
  }): Promise<void>;
}

export interface BackupArchivePort {
  createArchive(bundle: BackupBundle): Promise<Uint8Array>;
}
