import { QueryResult } from "pg";
import { ensureDatabaseReady, getDbPool } from "@/infrastructure/persistence/postgres/db";
import { EntityNotFoundError } from "@/domain/exceptions";
import { Client } from "@/domain/entities/client";
import { ClientRow } from "@/infrastructure/persistence/postgres/models/client-row";
import { mapClientRow } from "@/infrastructure/persistence/postgres/mappers/client-row-mapper";
import { ClientRepository } from "@/application/outbound/client-repository";

async function querySingleClient(sql: string, params: unknown[]): Promise<Client> {
  await ensureDatabaseReady();
  const result = await getDbPool().query<ClientRow>(sql, params);
  const row = result.rows[0];

  if (!row) {
    throw new EntityNotFoundError("Client not found");
  }

  return mapClientRow(row);
}

export async function createClientRecord(client: Client): Promise<Client> {
  return querySingleClient(
    `
      INSERT INTO clients (
        id,
        name,
        type,
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
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING id, name, type, street, city, postal_code, billing_street, billing_city, billing_postal_code, tax_id, phone, email, is_active, created_at, updated_at
    `,
    [
      client.id,
      client.name,
      client.type,
      client.workAddress.street,
      client.workAddress.city,
      client.workAddress.postalCode,
      client.billingAddress.street,
      client.billingAddress.city,
      client.billingAddress.postalCode,
      client.taxId,
      client.phone,
      client.email,
      client.isActive,
      client.createdAt,
      client.updatedAt
    ]
  );
}

export async function getActiveClientById(id: string): Promise<Client> {
  return querySingleClient(
    `
      SELECT id, name, type, street, city, postal_code, billing_street, billing_city, billing_postal_code, tax_id, phone, email, is_active, created_at, updated_at
      FROM clients
      WHERE id = $1 AND is_active = true
    `,
    [id]
  );
}

export async function listActiveClients(page: number, limit: number, search?: string): Promise<{
  clients: Client[];
  total: number;
  page: number;
  limit: number;
}> {
  await ensureDatabaseReady();
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(Math.floor(limit), 100) : 10;
  const offset = (safePage - 1) * safeLimit;

  let listQuery: QueryResult<ClientRow>;
  let countQuery: QueryResult<{ total: string }>;

  if (search && search.trim()) {
    const searchValue = `%${search.trim()}%`;
    listQuery = await getDbPool().query<ClientRow>(
      `
        SELECT id, name, type, street, city, postal_code, billing_street, billing_city, billing_postal_code, tax_id, phone, email, is_active, created_at, updated_at
        FROM clients
        WHERE is_active = true AND name ILIKE $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `,
      [searchValue, safeLimit, offset]
    );

    countQuery = await getDbPool().query<{ total: string }>(
      `
        SELECT COUNT(*)::text AS total
        FROM clients
        WHERE is_active = true AND name ILIKE $1
      `,
      [searchValue]
    );
  } else {
    listQuery = await getDbPool().query<ClientRow>(
      `
        SELECT id, name, type, street, city, postal_code, billing_street, billing_city, billing_postal_code, tax_id, phone, email, is_active, created_at, updated_at
        FROM clients
        WHERE is_active = true
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `,
      [safeLimit, offset]
    );

    countQuery = await getDbPool().query<{ total: string }>(
      `
        SELECT COUNT(*)::text AS total
        FROM clients
        WHERE is_active = true
      `
    );
  }

  return {
    clients: listQuery.rows.map(mapClientRow),
    total: Number(countQuery.rows[0]?.total ?? 0),
    page: safePage,
    limit: safeLimit
  };
}

export async function updateClientRecord(client: Client): Promise<Client> {
  return querySingleClient(
    `
      UPDATE clients
      SET
        name = $1,
        type = $2,
        street = $3,
        city = $4,
        postal_code = $5,
        billing_street = $6,
        billing_city = $7,
        billing_postal_code = $8,
        tax_id = $9,
        phone = $10,
        email = $11,
        is_active = $12,
        updated_at = $13
      WHERE id = $14 AND is_active = true
      RETURNING id, name, type, street, city, postal_code, billing_street, billing_city, billing_postal_code, tax_id, phone, email, is_active, created_at, updated_at
    `,
    [
      client.name,
      client.type,
      client.workAddress.street,
      client.workAddress.city,
      client.workAddress.postalCode,
      client.billingAddress.street,
      client.billingAddress.city,
      client.billingAddress.postalCode,
      client.taxId,
      client.phone,
      client.email,
      client.isActive,
      client.updatedAt,
      client.id
    ]
  );
}

export async function softDeleteClientRecord(id: string): Promise<void> {
  await ensureDatabaseReady();
  const result = await getDbPool().query(
    `
      UPDATE clients
      SET is_active = false, updated_at = NOW()
      WHERE id = $1 AND is_active = true
    `,
    [id]
  );

  if ((result.rowCount ?? 0) === 0) {
    throw new EntityNotFoundError("Client not found");
  }
}

export const postgresClientRepository: ClientRepository = {
  create: createClientRecord,
  getById: getActiveClientById,
  list: listActiveClients,
  update: updateClientRecord,
  delete: softDeleteClientRecord
};