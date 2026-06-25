import { ensureDatabaseReady, getDbPool } from "@/infrastructure/persistence/postgres/db";
import { EntityNotFoundError } from "@/domain/exceptions";
import { JobItem } from "@/domain/value-objects/job-item";
import { JobItemRepository } from "@/application/outbound/job-item-repository";
import { JobItemRow } from "@/infrastructure/persistence/postgres/models/job-item-row";
import { mapJobItemRow } from "@/infrastructure/persistence/postgres/mappers/job-item-row-mapper";

export async function createJobItemRecord(jobItem: JobItem): Promise<JobItem> {
  await ensureDatabaseReady();
  const result = await getDbPool().query<JobItemRow>(
    `
      INSERT INTO job_items (
        id, commercial_document_id, position, title, description,
        quantity, unit_price, total_price, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, commercial_document_id, position, title, description,
        quantity, unit_price, total_price, created_at, updated_at
    `,
    [
      jobItem.id,
      jobItem.commercialDocumentId,
      jobItem.position,
      jobItem.title,
      jobItem.description,
      jobItem.quantity,
      jobItem.unitPrice,
      jobItem.totalPrice,
      new Date(),
      new Date()
    ]
  );

  const row = result.rows[0];
  if (!row) {
    throw new Error("Failed to create job item");
  }

  return mapJobItemRow(row);
}

export async function findJobItemsByDocumentId(commercialDocumentId: string): Promise<JobItem[]> {
  await ensureDatabaseReady();
  const result = await getDbPool().query<JobItemRow>(
    `
      SELECT id, commercial_document_id, position, title, description,
        quantity, unit_price, total_price, created_at, updated_at
      FROM job_items
      WHERE commercial_document_id = $1
      ORDER BY position ASC
    `,
    [commercialDocumentId]
  );

  return result.rows.map(mapJobItemRow);
}

export async function updateJobItemRecord(jobItem: JobItem): Promise<JobItem> {
  await ensureDatabaseReady();
  const result = await getDbPool().query<JobItemRow>(
    `
      UPDATE job_items SET
        title = $1, description = $2,
        quantity = $3, unit_price = $4, total_price = $5, updated_at = $6
      WHERE id = $7
      RETURNING id, commercial_document_id, position, title, description,
        quantity, unit_price, total_price, created_at, updated_at
    `,
    [
      jobItem.title,
      jobItem.description,
      jobItem.quantity,
      jobItem.unitPrice,
      jobItem.totalPrice,
      new Date(),
      jobItem.id
    ]
  );

  const row = result.rows[0];
  if (!row) {
    throw new EntityNotFoundError("Job item not found");
  }

  return mapJobItemRow(row);
}

export async function deleteJobItemRecord(id: string): Promise<void> {
  await ensureDatabaseReady();
  const result = await getDbPool().query("DELETE FROM job_items WHERE id = $1", [id]);
  if (result.rowCount === 0) {
    throw new EntityNotFoundError("Job item not found");
  }
}

export const postgresJobItemRepository: JobItemRepository = {
  create: createJobItemRecord,
  findByDocumentId: findJobItemsByDocumentId,
  update: updateJobItemRecord,
  delete: deleteJobItemRecord
};
