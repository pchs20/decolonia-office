import { QueryResult } from "pg";
import { ensureDatabaseReady, getDbPool } from "@/infrastructure/persistence/postgres/db";
import { EntityNotFoundError } from "@/domain/exceptions";
import { Worker } from "@/domain/entities/worker";
import { WorkerRow } from "@/infrastructure/persistence/postgres/models/worker-row";
import { mapWorkerRow } from "@/infrastructure/persistence/postgres/mappers/worker-row-mapper";
import { WorkerRepository } from "@/application/outbound/worker-repository";

async function querySingleWorker(sql: string, params: unknown[]): Promise<Worker> {
  await ensureDatabaseReady();
  const result = await getDbPool().query<WorkerRow>(sql, params);
  const row = result.rows[0];

  if (!row) {
    throw new EntityNotFoundError("Worker not found");
  }

  return mapWorkerRow(row);
}

export async function createWorkerRecord(worker: Worker): Promise<Worker> {
  return querySingleWorker(
    `
      INSERT INTO workers (
        id,
        name,
        street,
        city,
        postal_code,
        billing_street,
        billing_city,
        billing_postal_code,
        tax_id,
        phone,
        email,
        is_active,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id, name, street, city, postal_code, billing_street, billing_city, billing_postal_code, tax_id, phone, email, is_active, created_at, updated_at
    `,
    [
      worker.id,
      worker.name,
      worker.workAddress.street,
      worker.workAddress.city,
      worker.workAddress.postalCode,
      worker.billingAddress.street,
      worker.billingAddress.city,
      worker.billingAddress.postalCode,
      worker.taxId,
      worker.phone,
      worker.email,
      worker.isActive,
      worker.createdAt,
      worker.updatedAt
    ]
  );
}

export async function getActiveWorkerById(id: string): Promise<Worker> {
  return querySingleWorker(
    `
      SELECT id, name, street, city, postal_code, billing_street, billing_city, billing_postal_code, tax_id, phone, email, is_active, created_at, updated_at
      FROM workers
      WHERE id = $1 AND is_active = true
    `,
    [id]
  );
}

export async function listActiveWorkers(page: number, limit: number, search?: string): Promise<{
  workers: Worker[];
  total: number;
  page: number;
  limit: number;
}> {
  await ensureDatabaseReady();
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(Math.floor(limit), 100) : 10;
  const offset = (safePage - 1) * safeLimit;

  let listQuery: QueryResult<WorkerRow>;
  let countQuery: QueryResult<{ total: string }>;

  if (search && search.trim()) {
    const searchValue = `%${search.trim()}%`;
    listQuery = await getDbPool().query<WorkerRow>(
      `
        SELECT id, name, street, city, postal_code, billing_street, billing_city, billing_postal_code, tax_id, phone, email, is_active, created_at, updated_at
        FROM workers
        WHERE is_active = true AND name ILIKE $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `,
      [searchValue, safeLimit, offset]
    );

    countQuery = await getDbPool().query<{ total: string }>(
      `
        SELECT COUNT(*)::text AS total
        FROM workers
        WHERE is_active = true AND name ILIKE $1
      `,
      [searchValue]
    );
  } else {
    listQuery = await getDbPool().query<WorkerRow>(
      `
        SELECT id, name, street, city, postal_code, billing_street, billing_city, billing_postal_code, tax_id, phone, email, is_active, created_at, updated_at
        FROM workers
        WHERE is_active = true
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `,
      [safeLimit, offset]
    );

    countQuery = await getDbPool().query<{ total: string }>(
      `
        SELECT COUNT(*)::text AS total
        FROM workers
        WHERE is_active = true
      `
    );
  }

  return {
    workers: listQuery.rows.map(mapWorkerRow),
    total: Number(countQuery.rows[0]?.total ?? 0),
    page: safePage,
    limit: safeLimit
  };
}

export async function updateWorkerRecord(worker: Worker): Promise<Worker> {
  return querySingleWorker(
    `
      UPDATE workers
      SET
        name = $1,
        street = $2,
        city = $3,
        postal_code = $4,
        billing_street = $5,
        billing_city = $6,
        billing_postal_code = $7,
        tax_id = $8,
        phone = $9,
        email = $10,
        is_active = $11,
        updated_at = $12
      WHERE id = $13 AND is_active = true
      RETURNING id, name, street, city, postal_code, billing_street, billing_city, billing_postal_code, tax_id, phone, email, is_active, created_at, updated_at
    `,
    [
      worker.name,
      worker.workAddress.street,
      worker.workAddress.city,
      worker.workAddress.postalCode,
      worker.billingAddress.street,
      worker.billingAddress.city,
      worker.billingAddress.postalCode,
      worker.taxId,
      worker.phone,
      worker.email,
      worker.isActive,
      worker.updatedAt,
      worker.id
    ]
  );
}

export async function softDeleteWorkerRecord(id: string): Promise<void> {
  await ensureDatabaseReady();
  const result = await getDbPool().query(
    `
      UPDATE workers
      SET is_active = false, updated_at = NOW()
      WHERE id = $1 AND is_active = true
    `,
    [id]
  );

  if ((result.rowCount ?? 0) === 0) {
    throw new EntityNotFoundError("Worker not found");
  }
}

export const postgresWorkerRepository: WorkerRepository = {
  create: createWorkerRecord,
  getById: getActiveWorkerById,
  list: listActiveWorkers,
  update: updateWorkerRecord,
  delete: softDeleteWorkerRecord
};