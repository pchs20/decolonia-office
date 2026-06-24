import { ensureDatabaseReady, getDbPool } from "@/infrastructure/persistence/postgres/db";
import { EntityNotFoundError } from "@/domain/exceptions";
import { Tax } from "@/domain/entities/tax";
import { TaxRepository } from "@/application/outbound/tax-repository";
import { TaxRow } from "@/infrastructure/persistence/postgres/models/tax-row";
import { mapTaxRow } from "@/infrastructure/persistence/postgres/mappers/tax-row-mapper";

async function querySingleTax(sql: string, params: unknown[]): Promise<Tax> {
  await ensureDatabaseReady();
  const result = await getDbPool().query<TaxRow>(sql, params);
  const row = result.rows[0];

  if (!row) {
    throw new EntityNotFoundError("Tax not found");
  }

  return mapTaxRow(row);
}

export async function createTaxRecord(tax: Tax): Promise<Tax> {
  return querySingleTax(
    `
      INSERT INTO taxes (id, name, rate, behavior, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, rate, behavior, is_active, created_at, updated_at
    `,
    [tax.id, tax.name, tax.rate, tax.behavior, tax.isActive, tax.createdAt, tax.updatedAt]
  );
}

export async function getTaxById(id: string): Promise<Tax> {
  return querySingleTax(
    `
      SELECT id, name, rate, behavior, is_active, created_at, updated_at
      FROM taxes
      WHERE id = $1
    `,
    [id]
  );
}

export async function listTaxes(
  page: number,
  limit: number,
  includeInactive?: boolean
): Promise<{
  taxes: Tax[];
  total: number;
  page: number;
  limit: number;
}> {
  await ensureDatabaseReady();
  const safePage = Math.max(1, Math.floor(page || 1));
  const safeLimit = Math.max(1, Math.min(100, Math.floor(limit || 20)));
  const offset = (safePage - 1) * safeLimit;

  let query = `
    SELECT id, name, rate, behavior, is_active, created_at, updated_at
    FROM taxes
  `;
  const params: unknown[] = [];

  if (!includeInactive) {
    query += ` WHERE is_active = true`;
  }

  query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(safeLimit, offset);

  const pool = getDbPool();
  const listResult = await pool.query<TaxRow>(query, params);

  const countQuery = `SELECT COUNT(*)::text AS total FROM taxes${!includeInactive ? " WHERE is_active = true" : ""}`;
  const countResult = await pool.query<{ total: string }>(countQuery);
  const total = parseInt(countResult.rows[0]?.total ?? "0", 10);

  return {
    taxes: listResult.rows.map(mapTaxRow),
    total,
    page: safePage,
    limit: safeLimit
  };
}

export async function updateTaxRecord(tax: Tax): Promise<Tax> {
  return querySingleTax(
    `
      UPDATE taxes SET
        name = $1, rate = $2, behavior = $3, is_active = $4, updated_at = $5
      WHERE id = $6
      RETURNING id, name, rate, behavior, is_active, created_at, updated_at
    `,
    [tax.name, tax.rate, tax.behavior, tax.isActive, tax.updatedAt, tax.id]
  );
}

export async function archiveTaxRecord(id: string): Promise<void> {
  await ensureDatabaseReady();
  const result = await getDbPool().query(
    `
      UPDATE taxes SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `,
    [id]
  );

  if (result.rowCount === 0) {
    throw new EntityNotFoundError("Tax not found");
  }
}

export const postgresTaxRepository: TaxRepository = {
  create: createTaxRecord,
  getById: getTaxById,
  list: listTaxes,
  update: updateTaxRecord,
  archive: archiveTaxRecord
};
