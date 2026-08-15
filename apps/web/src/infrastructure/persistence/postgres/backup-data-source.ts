import { BackupCell, BackupDataSource } from "@/application/outbound/backup-export-ports";
import { ensureDatabaseReady, getDbPool } from "@/infrastructure/persistence/postgres/db";

function serializeValue(value: unknown): BackupCell {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
  return JSON.stringify(value);
}

function serializeRows(rows: Record<string, unknown>[]): Record<string, BackupCell>[] {
  return rows.map((row) =>
    Object.fromEntries(Object.entries(row).map(([key, value]) => [key, serializeValue(value)]))
  );
}

async function queryExportRows(sql: string): Promise<Record<string, BackupCell>[]> {
  await ensureDatabaseReady();
  const result = await getDbPool().query<Record<string, unknown>>(sql);
  return serializeRows(result.rows);
}

export const postgresBackupDataSource: BackupDataSource = {
  getClientsForExport: () => queryExportRows("SELECT * FROM clients ORDER BY created_at ASC"),
  getBudgetsForExport: () => queryExportRows(`
    SELECT b.*,
      COALESCE(
        (
          SELECT json_agg(ji ORDER BY ji.position)
          FROM job_items ji
          WHERE ji.commercial_document_id = b.id
        ),
        '[]'::json
      ) AS job_items
    FROM budgets b
    ORDER BY b.created_at ASC
  `),
  getInvoicesForExport: () => queryExportRows(`
    SELECT i.*,
      COALESCE(
        (
          SELECT json_agg(ji ORDER BY ji.position)
          FROM job_items ji
          WHERE ji.commercial_document_id = i.id
        ),
        '[]'::json
      ) AS job_items
    FROM invoices i
    ORDER BY i.created_at ASC
  `)
};
