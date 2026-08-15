import { NextRequest } from "next/server";
import { ApiError } from "@/api/errors/api-errors";
import { BackupDataSource } from "@/application/outbound/backup-export-ports";
import { DocumentExportStateRepository } from "@/application/outbound/document-export-state-repository";
import { CloudSyncBatchDependencies } from "@/application/use-cases/backup-export/cloud-sync-use-case";
import { createDocumentPdfRenderer } from "@/infrastructure/pdf/document-pdf-renderer";
import { postgresBackupDataSource } from "@/infrastructure/persistence/postgres/backup-data-source";
import { postgresBudgetRepository } from "@/infrastructure/persistence/postgres/repositories/budget-repository";
import { postgresDocumentExportStateRepository } from "@/infrastructure/persistence/postgres/repositories/document-export-state-repository";
import { postgresInvoiceRepository } from "@/infrastructure/persistence/postgres/repositories/invoice-repository";
import { postgresJobItemRepository } from "@/infrastructure/persistence/postgres/repositories/job-item-repository";
import { prepareGoogleDriveDestination } from "@/infrastructure/google-drive/google-drive-destination";
import {
  getGoogleDriveOAuthCredentials,
  GoogleDriveAuthorizationError,
  GoogleDriveOAuthCredentials
} from "@/infrastructure/google-drive/oauth";

export const documentPdfRenderer = createDocumentPdfRenderer({
  budgetRepository: postgresBudgetRepository,
  invoiceRepository: postgresInvoiceRepository,
  jobItemRepository: postgresJobItemRepository
});

export async function getCloudSyncCredentials(
  request: NextRequest
): Promise<GoogleDriveOAuthCredentials> {
  try {
    return await getGoogleDriveOAuthCredentials(request);
  } catch (error) {
    if (error instanceof GoogleDriveAuthorizationError) {
      throw new ApiError(401, error.message);
    }
    throw error instanceof Error ? error : new Error(String(error));
  }
}

export async function getCloudSyncAuthorizationStatus(
  request: NextRequest
): Promise<{ authorized: boolean }> {
  try {
    await getGoogleDriveOAuthCredentials(request);
    return { authorized: true };
  } catch (error) {
    if (error instanceof GoogleDriveAuthorizationError || error instanceof ApiError) {
      return { authorized: false };
    }
    throw error instanceof Error ? error : new Error(String(error));
  }
}

export async function createCloudSyncDependencies(credentials: GoogleDriveOAuthCredentials): Promise<CloudSyncBatchDependencies> {
  const destination = await prepareGoogleDriveDestination(credentials);
  return {
    dataSource: postgresBackupDataSource as BackupDataSource,
    pdfRenderer: documentPdfRenderer,
    exportStateRepository: postgresDocumentExportStateRepository as DocumentExportStateRepository,
    destination
  };
}
