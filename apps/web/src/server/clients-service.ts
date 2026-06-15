import { QueryResult } from "pg";
import { getDbPool } from "@/server/db";
import { ApiError } from "@/server/api-errors";
import { Client, CreateClientInput, UpdateClientInput } from "@/types/client";

type ClientRow = {
  id: string;
  name: string;
  type: "individual" | "company";
  address: string;
  billing_address: string | null;
  tax_id: string;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  created_at: Date | string;
  updated_at: Date | string;
};

function mapClientRow(row: ClientRow): Client {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    address: row.address,
    billingAddress: row.billing_address,
    taxId: row.tax_id,
    phone: row.phone,
    email: row.email,
    isActive: row.is_active,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString()
  };
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateType(type: unknown): asserts type is "individual" | "company" {
  if (type !== "individual" && type !== "company") {
    throw new ApiError(400, "Client type must be either 'individual' or 'company'");
  }
}

function normalizeString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  return value.trim();
}

export function validateCreateInput(payload: unknown): CreateClientInput {
  if (!payload || typeof payload !== "object") {
    throw new ApiError(400, "Request body must be an object");
  }

  const data = payload as Record<string, unknown>;

  const name = normalizeString(data.name);
  if (!name) throw new ApiError(400, "Client name is required");

  validateType(data.type);

  const address = normalizeString(data.address);
  if (!address) throw new ApiError(400, "Client address is required");

  const taxId = normalizeString(data.taxId);
  if (!taxId) throw new ApiError(400, "Client tax ID is required");

  const billingAddress = normalizeString(data.billingAddress);
  const phone = normalizeString(data.phone);
  const email = normalizeString(data.email);

  if (email && !isValidEmail(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  if (phone && phone.length < 6) {
    throw new ApiError(400, "Phone number must be at least 6 characters");
  }

  return {
    name,
    type: data.type,
    address,
    billingAddress,
    taxId,
    phone,
    email
  };
}

export function validateUpdateInput(payload: unknown): UpdateClientInput {
  if (!payload || typeof payload !== "object") {
    throw new ApiError(400, "Request body must be an object");
  }

  const data = payload as Record<string, unknown>;
  const output: UpdateClientInput = {};

  if ("name" in data) {
    const name = normalizeString(data.name);
    if (!name) throw new ApiError(400, "Client name is required");
    output.name = name;
  }

  if ("type" in data) {
    validateType(data.type);
    output.type = data.type;
  }

  if ("address" in data) {
    const address = normalizeString(data.address);
    if (!address) throw new ApiError(400, "Client address is required");
    output.address = address;
  }

  if ("billingAddress" in data) {
    output.billingAddress = normalizeString(data.billingAddress);
  }

  if ("taxId" in data) {
    const taxId = normalizeString(data.taxId);
    if (!taxId) throw new ApiError(400, "Client tax ID is required");
    output.taxId = taxId;
  }

  if ("phone" in data) {
    const phone = normalizeString(data.phone);
    if (phone && phone.length < 6) {
      throw new ApiError(400, "Phone number must be at least 6 characters");
    }
    output.phone = phone;
  }

  if ("email" in data) {
    const email = normalizeString(data.email);
    if (email && !isValidEmail(email)) {
      throw new ApiError(400, "Invalid email format");
    }
    output.email = email;
  }

  return output;
}

async function querySingleClient(sql: string, params: unknown[]): Promise<Client> {
  const result = await getDbPool().query<ClientRow>(sql, params);
  const row = result.rows[0];

  if (!row) {
    throw new ApiError(404, "Client not found");
  }

  return mapClientRow(row);
}

export async function createClient(input: CreateClientInput): Promise<Client> {
  const billingAddress = input.billingAddress?.trim() || input.address;

  return querySingleClient(
    `
      INSERT INTO clients (name, type, address, billing_address, tax_id, phone, email, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, true)
      RETURNING id, name, type, address, billing_address, tax_id, phone, email, is_active, created_at, updated_at
    `,
    [
      input.name,
      input.type,
      input.address,
      billingAddress,
      input.taxId,
      input.phone ?? null,
      input.email ?? null
    ]
  );
}

export async function getClientById(id: string): Promise<Client> {
  return querySingleClient(
    `
      SELECT id, name, type, address, billing_address, tax_id, phone, email, is_active, created_at, updated_at
      FROM clients
      WHERE id = $1 AND is_active = true
    `,
    [id]
  );
}

export async function listClients(page: number, limit: number, search?: string): Promise<{
  clients: Client[];
  total: number;
  page: number;
  limit: number;
}> {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(Math.floor(limit), 100) : 10;
  const offset = (safePage - 1) * safeLimit;

  let listQuery: QueryResult<ClientRow>;
  let countQuery: QueryResult<{ total: string }>;

  if (search && search.trim()) {
    const searchValue = `%${search.trim()}%`;
    listQuery = await getDbPool().query<ClientRow>(
      `
        SELECT id, name, type, address, billing_address, tax_id, phone, email, is_active, created_at, updated_at
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
        SELECT id, name, type, address, billing_address, tax_id, phone, email, is_active, created_at, updated_at
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

export async function updateClient(id: string, input: UpdateClientInput): Promise<Client> {
  await getClientById(id);

  const fields: string[] = [];
  const values: unknown[] = [];

  const setField = (column: string, value: unknown) => {
    values.push(value);
    fields.push(`${column} = $${values.length}`);
  };

  if (input.name !== undefined) setField("name", input.name);
  if (input.type !== undefined) setField("type", input.type);
  if (input.address !== undefined) setField("address", input.address);
  if (input.taxId !== undefined) setField("tax_id", input.taxId);
  if (input.phone !== undefined) setField("phone", input.phone ?? null);
  if (input.email !== undefined) setField("email", input.email ?? null);

  if (input.billingAddress !== undefined) {
    setField("billing_address", input.billingAddress?.trim() || null);
  }

  if (input.address !== undefined && input.billingAddress === undefined) {
    const current = await getClientById(id);
    if (!current.billingAddress?.trim()) {
      setField("billing_address", input.address);
    }
  }

  if (fields.length === 0) {
    return getClientById(id);
  }

  setField("updated_at", new Date());
  values.push(id);

  return querySingleClient(
    `
      UPDATE clients
      SET ${fields.join(", ")}
      WHERE id = $${values.length} AND is_active = true
      RETURNING id, name, type, address, billing_address, tax_id, phone, email, is_active, created_at, updated_at
    `,
    values
  );
}

export async function deleteClient(id: string): Promise<void> {
  const result = await getDbPool().query(
    `
      UPDATE clients
      SET is_active = false, updated_at = NOW()
      WHERE id = $1 AND is_active = true
    `,
    [id]
  );

  if ((result.rowCount ?? 0) === 0) {
    throw new ApiError(404, "Client not found");
  }
}
