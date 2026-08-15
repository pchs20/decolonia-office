import { DocumentExportStateRepository } from "@/application/outbound/document-export-state-repository";
import { ExportProvider } from "@/application/outbound/export-provider";
import { ensureDatabaseReady, getDbPool } from "@/infrastructure/persistence/postgres/db";

interface DocumentExportStateRow {
  id: string;
  document_type: "budget" | "invoice";
  document_id: string;
  provider: string;
  destination_reference: string;
  external_reference: string | null;
  source_updated_at: Date | null;
  synced_at: Date | null;
  last_attempted_at: Date | null;
  last_error: string | null;
  created_at: Date;
  updated_at: Date;
}

function mapRow(row: DocumentExportStateRow) {
  return {
    id: row.id,
    documentType: row.document_type,
    documentId: row.document_id,
    provider: row.provider as ExportProvider,
    destinationReference: row.destination_reference,
    externalReference: row.external_reference,
    sourceUpdatedAt: row.source_updated_at,
    syncedAt: row.synced_at,
    lastAttemptedAt: row.last_attempted_at,
    lastError: row.last_error,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function getByDocument(
  documentType: "budget" | "invoice",
  documentId: string,
  provider: ExportProvider,
  destinationReference: string
) {
  await ensureDatabaseReady();
  const result = await getDbPool().query<DocumentExportStateRow>(
    `
      SELECT id, document_type, document_id, provider, destination_reference, external_reference,
             source_updated_at, synced_at, last_attempted_at, last_error,
             created_at, updated_at
      FROM document_export_states
      WHERE document_type = $1 AND document_id = $2 AND provider = $3 AND destination_reference = $4
    `,
    [documentType, documentId, provider, destinationReference]
  );

  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

async function recordSuccess(input: {
  documentType: "budget" | "invoice";
  documentId: string;
  provider: ExportProvider;
  destinationReference: string;
  externalReference: string;
  sourceUpdatedAt: Date;
  syncedAt?: Date;
}) {
  await ensureDatabaseReady();
  const syncedAt = input.syncedAt ?? new Date();
  const result = await getDbPool().query<DocumentExportStateRow>(
    `
      INSERT INTO document_export_states (
        document_type, document_id, provider, destination_reference, external_reference,
        source_updated_at, synced_at, last_attempted_at, last_error
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $7, NULL)
      ON CONFLICT (document_type, document_id, provider, destination_reference)
      DO UPDATE SET
        external_reference = EXCLUDED.external_reference,
        source_updated_at = EXCLUDED.source_updated_at,
        synced_at = EXCLUDED.synced_at,
        last_attempted_at = EXCLUDED.last_attempted_at,
        last_error = NULL,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, document_type, document_id, provider, destination_reference, external_reference,
                source_updated_at, synced_at, last_attempted_at, last_error,
                created_at, updated_at
    `,
    [input.documentType, input.documentId, input.provider, input.destinationReference, input.externalReference, input.sourceUpdatedAt, syncedAt]
  );

  return mapRow(result.rows[0]);
}

async function recordFailure(input: {
  documentType: "budget" | "invoice";
  documentId: string;
  provider: ExportProvider;
  destinationReference: string;
  error: string;
  attemptedAt?: Date;
}) {
  await ensureDatabaseReady();
  const attemptedAt = input.attemptedAt ?? new Date();
  const result = await getDbPool().query<DocumentExportStateRow>(
    `
      INSERT INTO document_export_states (
        document_type, document_id, provider, destination_reference, last_attempted_at, last_error
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (document_type, document_id, provider, destination_reference)
      DO UPDATE SET
        last_attempted_at = EXCLUDED.last_attempted_at,
        last_error = EXCLUDED.last_error,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, document_type, document_id, provider, destination_reference, external_reference,
                source_updated_at, synced_at, last_attempted_at, last_error,
                created_at, updated_at
    `,
    [input.documentType, input.documentId, input.provider, input.destinationReference, attemptedAt, input.error]
  );

  return mapRow(result.rows[0]);
}

export const postgresDocumentExportStateRepository: DocumentExportStateRepository = {
  getByDocument,
  recordSuccess,
  recordFailure
};
