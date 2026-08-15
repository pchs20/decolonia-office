import { ExportProvider } from "@/application/outbound/export-provider";

export type ExportDocumentType = "budget" | "invoice";

export interface DocumentExportState {
  id: string;
  documentType: ExportDocumentType;
  documentId: string;
  provider: ExportProvider;
  destinationReference: string;
  externalReference: string | null;
  sourceUpdatedAt: Date | null;
  syncedAt: Date | null;
  lastAttemptedAt: Date | null;
  lastError: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentExportStateRepository {
  getByDocument(
    documentType: ExportDocumentType,
    documentId: string,
    provider: ExportProvider,
    destinationReference: string
  ): Promise<DocumentExportState | null>;
  recordSuccess(input: {
    documentType: ExportDocumentType;
    documentId: string;
    provider: ExportProvider;
    destinationReference: string;
    externalReference: string;
    sourceUpdatedAt: Date;
    syncedAt?: Date;
  }): Promise<DocumentExportState>;
  recordFailure(input: {
    documentType: ExportDocumentType;
    documentId: string;
    provider: ExportProvider;
    destinationReference: string;
    error: string;
    attemptedAt?: Date;
  }): Promise<DocumentExportState>;
}
