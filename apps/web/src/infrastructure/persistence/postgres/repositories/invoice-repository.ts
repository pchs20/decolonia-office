import { ensureDatabaseReady, getDbPool } from "@/infrastructure/persistence/postgres/db";
import { EntityNotFoundError } from "@/domain/exceptions";
import { Invoice } from "@/domain/entities/invoice";
import { InvoiceRepository } from "@/application/outbound/invoice-repository";
import { InvoiceRow } from "@/infrastructure/persistence/postgres/models/invoice-row";
import { mapInvoiceRow } from "@/infrastructure/persistence/postgres/mappers/invoice-row-mapper";

async function querySingleInvoice(sql: string, params: unknown[]): Promise<Invoice> {
  await ensureDatabaseReady();
  const result = await getDbPool().query<InvoiceRow>(sql, params);
  const row = result.rows[0];

  if (!row) {
    throw new EntityNotFoundError("Invoice not found");
  }

  return mapInvoiceRow(row);
}

export async function createInvoiceRecord(invoice: Invoice): Promise<Invoice> {
  await ensureDatabaseReady();
  const pool = getDbPool();

  try {
    await pool.query("BEGIN");

    const invoiceResult = await pool.query<InvoiceRow>(
      `
        INSERT INTO invoices (
          id, number, client_id, worker_id, notes, issued_at, source_budget_id,
          client_snapshot_name, client_snapshot_tax_id, client_snapshot_phone, client_snapshot_email,
          client_snapshot_work_street, client_snapshot_work_city, client_snapshot_work_postal_code,
          client_snapshot_billing_street, client_snapshot_billing_city, client_snapshot_billing_postal_code,
          worker_snapshot_name, worker_snapshot_tax_id, worker_snapshot_phone, worker_snapshot_email,
          worker_snapshot_work_street, worker_snapshot_work_city, worker_snapshot_work_postal_code,
          worker_snapshot_billing_street, worker_snapshot_billing_city, worker_snapshot_billing_postal_code,
          worker_snapshot_bank_account,
          tax_snapshot_name, tax_snapshot_rate, tax_snapshot_behavior,
          pricing_mode, manual_subtotal_amount,
          subtotal_amount, tax_amount, total_amount, created_at, updated_at
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11,
          $12, $13, $14,
          $15, $16, $17,
          $18, $19, $20, $21,
          $22, $23, $24,
          $25, $26, $27,
          $28,
          $29, $30, $31,
          $32, $33,
          $34, $35, $36, $37, $38
        )
        RETURNING id, number, client_id, worker_id, notes, issued_at, source_budget_id,
          client_snapshot_name, client_snapshot_tax_id, client_snapshot_phone, client_snapshot_email,
          client_snapshot_work_street, client_snapshot_work_city, client_snapshot_work_postal_code,
          client_snapshot_billing_street, client_snapshot_billing_city, client_snapshot_billing_postal_code,
          worker_snapshot_name, worker_snapshot_tax_id, worker_snapshot_phone, worker_snapshot_email,
          worker_snapshot_work_street, worker_snapshot_work_city, worker_snapshot_work_postal_code,
          worker_snapshot_billing_street, worker_snapshot_billing_city, worker_snapshot_billing_postal_code,
          worker_snapshot_bank_account,
          tax_snapshot_name, tax_snapshot_rate, tax_snapshot_behavior,
          pricing_mode, manual_subtotal_amount,
          subtotal_amount, tax_amount, total_amount, created_at, updated_at
      `,
      [
        invoice.id,
        invoice.number,
        invoice.clientId,
        invoice.workerId,
        invoice.notes,
        invoice.issuedAt,
        invoice.sourceBudgetId,
        invoice.clientSnapshot.name,
        invoice.clientSnapshot.taxId,
        invoice.clientSnapshot.phone,
        invoice.clientSnapshot.email,
        invoice.clientSnapshot.workAddress.street,
        invoice.clientSnapshot.workAddress.city,
        invoice.clientSnapshot.workAddress.postalCode,
        invoice.clientSnapshot.billingAddress.street,
        invoice.clientSnapshot.billingAddress.city,
        invoice.clientSnapshot.billingAddress.postalCode,
        invoice.workerSnapshot.name,
        invoice.workerSnapshot.taxId,
        invoice.workerSnapshot.phone,
        invoice.workerSnapshot.email,
        invoice.workerSnapshot.workAddress.street,
        invoice.workerSnapshot.workAddress.city,
        invoice.workerSnapshot.workAddress.postalCode,
        invoice.workerSnapshot.billingAddress.street,
        invoice.workerSnapshot.billingAddress.city,
        invoice.workerSnapshot.billingAddress.postalCode,
        invoice.workerSnapshot.bankAccount,
        invoice.taxSnapshot?.name ?? null,
        invoice.taxSnapshot?.rate ?? null,
        invoice.taxSnapshot?.behavior ?? null,
        invoice.pricingMode,
        invoice.manualSubtotalAmount,
        invoice.subtotalAmount,
        invoice.taxAmount,
        invoice.totalAmount,
        invoice.createdAt,
        invoice.updatedAt
      ]
    );

    await pool.query("COMMIT");

    const invoiceRow = invoiceResult.rows[0];
    if (!invoiceRow) {
      throw new Error("Failed to create invoice");
    }

    return mapInvoiceRow(invoiceRow);
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
}

export async function getInvoiceById(id: string): Promise<Invoice> {
  return querySingleInvoice(
    `
      SELECT id, number, client_id, worker_id, notes, issued_at, source_budget_id,
        client_snapshot_name, client_snapshot_tax_id, client_snapshot_phone, client_snapshot_email,
        client_snapshot_work_street, client_snapshot_work_city, client_snapshot_work_postal_code,
        client_snapshot_billing_street, client_snapshot_billing_city, client_snapshot_billing_postal_code,
        worker_snapshot_name, worker_snapshot_tax_id, worker_snapshot_phone, worker_snapshot_email,
        worker_snapshot_work_street, worker_snapshot_work_city, worker_snapshot_work_postal_code,
        worker_snapshot_billing_street, worker_snapshot_billing_city, worker_snapshot_billing_postal_code,
        worker_snapshot_bank_account,
        tax_snapshot_name, tax_snapshot_rate, tax_snapshot_behavior,
        pricing_mode, manual_subtotal_amount,
        subtotal_amount, tax_amount, total_amount, created_at, updated_at
      FROM invoices
      WHERE id = $1
    `,
    [id]
  );
}

export async function listInvoices(
  page: number,
  limit: number,
  clientId?: string,
  year?: number,
  search?: string
): Promise<{
  invoices: Invoice[];
  total: number;
  page: number;
  limit: number;
}> {
  await ensureDatabaseReady();
  const safePage = Math.max(1, Math.floor(page || 1));
  const safeLimit = Math.max(1, Math.min(100, Math.floor(limit || 20)));
  const offset = (safePage - 1) * safeLimit;

  let query = `
    SELECT id, number, client_id, worker_id, notes, issued_at, source_budget_id,
      client_snapshot_name, client_snapshot_tax_id, client_snapshot_phone, client_snapshot_email,
      client_snapshot_work_street, client_snapshot_work_city, client_snapshot_work_postal_code,
      client_snapshot_billing_street, client_snapshot_billing_city, client_snapshot_billing_postal_code,
      worker_snapshot_name, worker_snapshot_tax_id, worker_snapshot_phone, worker_snapshot_email,
      worker_snapshot_work_street, worker_snapshot_work_city, worker_snapshot_work_postal_code,
      worker_snapshot_billing_street, worker_snapshot_billing_city, worker_snapshot_billing_postal_code,
      worker_snapshot_bank_account,
      tax_snapshot_name, tax_snapshot_rate, tax_snapshot_behavior,
      pricing_mode, manual_subtotal_amount,
      subtotal_amount, tax_amount, total_amount, created_at, updated_at
    FROM invoices
    WHERE 1=1
  `;
  const params: unknown[] = [];

  if (clientId) {
    query += ` AND client_id = $${params.length + 1}`;
    params.push(clientId);
  }

  if (year) {
    query += ` AND EXTRACT(YEAR FROM created_at) = $${params.length + 1}`;
    params.push(year);
  }

  if (search && search.trim()) {
    const searchParam = `%${search.trim()}%`;
    query += ` AND (
      number ILIKE $${params.length + 1}
      OR client_snapshot_name ILIKE $${params.length + 1}
      OR worker_snapshot_name ILIKE $${params.length + 1}
      OR client_snapshot_work_city ILIKE $${params.length + 1}
      OR worker_snapshot_work_city ILIKE $${params.length + 1}
    )`;
    params.push(searchParam);
  }

  query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(safeLimit, offset);

  const pool = getDbPool();
  const listResult = await pool.query<InvoiceRow>(query, params);

  const countQuery = query.replace(
    /SELECT.*?FROM/,
    "SELECT COUNT(*)::text AS total FROM"
  ).replace(/ORDER BY.*?OFFSET.*/, "");
  const countParams = params.slice(0, -2);
  const countResult = await pool.query<{ total: string }>(countQuery, countParams);
  const total = parseInt(countResult.rows[0]?.total ?? "0", 10);

  return {
    invoices: listResult.rows.map(mapInvoiceRow),
    total,
    page: safePage,
    limit: safeLimit
  };
}

export async function updateInvoiceRecord(invoice: Invoice): Promise<Invoice> {
  return querySingleInvoice(
    `
      UPDATE invoices SET
        notes = $1, issued_at = $2, source_budget_id = $3,
        client_snapshot_name = $4, client_snapshot_tax_id = $5, client_snapshot_phone = $6, client_snapshot_email = $7,
        client_snapshot_work_street = $8, client_snapshot_work_city = $9, client_snapshot_work_postal_code = $10,
        client_snapshot_billing_street = $11, client_snapshot_billing_city = $12, client_snapshot_billing_postal_code = $13,
        worker_snapshot_name = $14, worker_snapshot_tax_id = $15, worker_snapshot_phone = $16, worker_snapshot_email = $17,
        worker_snapshot_work_street = $18, worker_snapshot_work_city = $19, worker_snapshot_work_postal_code = $20,
        worker_snapshot_billing_street = $21, worker_snapshot_billing_city = $22, worker_snapshot_billing_postal_code = $23,
        worker_snapshot_bank_account = $24,
        tax_snapshot_name = $25, tax_snapshot_rate = $26, tax_snapshot_behavior = $27,
        pricing_mode = $28, manual_subtotal_amount = $29,
        subtotal_amount = $30, tax_amount = $31, total_amount = $32, updated_at = $33
      WHERE id = $34
      RETURNING id, number, client_id, worker_id, notes, issued_at, source_budget_id,
        client_snapshot_name, client_snapshot_tax_id, client_snapshot_phone, client_snapshot_email,
        client_snapshot_work_street, client_snapshot_work_city, client_snapshot_work_postal_code,
        client_snapshot_billing_street, client_snapshot_billing_city, client_snapshot_billing_postal_code,
        worker_snapshot_name, worker_snapshot_tax_id, worker_snapshot_phone, worker_snapshot_email,
        worker_snapshot_work_street, worker_snapshot_work_city, worker_snapshot_work_postal_code,
        worker_snapshot_billing_street, worker_snapshot_billing_city, worker_snapshot_billing_postal_code,
        worker_snapshot_bank_account,
        tax_snapshot_name, tax_snapshot_rate, tax_snapshot_behavior,
        pricing_mode, manual_subtotal_amount,
        subtotal_amount, tax_amount, total_amount, created_at, updated_at
    `,
    [
      invoice.notes,
      invoice.issuedAt,
      invoice.sourceBudgetId,
      invoice.clientSnapshot.name,
      invoice.clientSnapshot.taxId,
      invoice.clientSnapshot.phone,
      invoice.clientSnapshot.email,
      invoice.clientSnapshot.workAddress.street,
      invoice.clientSnapshot.workAddress.city,
      invoice.clientSnapshot.workAddress.postalCode,
      invoice.clientSnapshot.billingAddress.street,
      invoice.clientSnapshot.billingAddress.city,
      invoice.clientSnapshot.billingAddress.postalCode,
      invoice.workerSnapshot.name,
      invoice.workerSnapshot.taxId,
      invoice.workerSnapshot.phone,
      invoice.workerSnapshot.email,
      invoice.workerSnapshot.workAddress.street,
      invoice.workerSnapshot.workAddress.city,
      invoice.workerSnapshot.workAddress.postalCode,
      invoice.workerSnapshot.billingAddress.street,
      invoice.workerSnapshot.billingAddress.city,
      invoice.workerSnapshot.billingAddress.postalCode,
      invoice.workerSnapshot.bankAccount,
      invoice.taxSnapshot?.name ?? null,
      invoice.taxSnapshot?.rate ?? null,
      invoice.taxSnapshot?.behavior ?? null,
      invoice.pricingMode,
      invoice.manualSubtotalAmount,
      invoice.subtotalAmount,
      invoice.taxAmount,
      invoice.totalAmount,
      invoice.updatedAt,
      invoice.id
    ]
  );
}

export async function deleteInvoiceRecord(id: string): Promise<void> {
  await ensureDatabaseReady();
  const result = await getDbPool().query("DELETE FROM invoices WHERE id = $1", [id]);
  if (result.rowCount === 0) {
    throw new EntityNotFoundError("Invoice not found");
  }
}

export const postgresInvoiceRepository: InvoiceRepository = {
  create: createInvoiceRecord,
  getById: getInvoiceById,
  list: listInvoices,
  update: updateInvoiceRecord,
  delete: deleteInvoiceRecord
};
