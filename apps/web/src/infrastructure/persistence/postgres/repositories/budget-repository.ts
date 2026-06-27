import { ensureDatabaseReady, getDbPool } from "@/infrastructure/persistence/postgres/db";
import { EntityNotFoundError } from "@/domain/exceptions";
import { Budget } from "@/domain/entities/budget";
import { BudgetRepository } from "@/application/outbound/budget-repository";
import { BudgetRow } from "@/infrastructure/persistence/postgres/models/budget-row";
import { mapBudgetRow } from "@/infrastructure/persistence/postgres/mappers/budget-row-mapper";
import { JobItemRepository } from "@/application/outbound/job-item-repository";
import { postgresJobItemRepository } from "@/infrastructure/persistence/postgres/repositories/job-item-repository";

async function querySingleBudget(sql: string, params: unknown[]): Promise<Budget> {
  await ensureDatabaseReady();
  const result = await getDbPool().query<BudgetRow>(sql, params);
  const row = result.rows[0];

  if (!row) {
    throw new EntityNotFoundError("Budget not found");
  }

  return mapBudgetRow(row);
}

export async function createBudgetRecord(
  budget: Budget,
  _jobItemRepo: JobItemRepository
): Promise<Budget> {
  await ensureDatabaseReady();
  const pool = getDbPool();

  try {
    await pool.query("BEGIN");

    const budgetResult = await pool.query<BudgetRow>(
      `
        INSERT INTO budgets (
          id, number, client_id, worker_id, notes, delivered_at,
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
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10,
          $11, $12, $13,
          $14, $15, $16,
          $17, $18, $19, $20,
          $21, $22, $23,
          $24, $25, $26,
          $27,
          $28, $29, $30,
          $31, $32,
          $33, $34, $35, $36, $37
        )
        RETURNING id, number, client_id, worker_id, notes, delivered_at,
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
        budget.id,
        budget.number,
        budget.clientId,
        budget.workerId,
        budget.notes,
        budget.deliveredAt,
        budget.clientSnapshot.name,
        budget.clientSnapshot.taxId,
        budget.clientSnapshot.phone,
        budget.clientSnapshot.email,
        budget.clientSnapshot.workAddress.street,
        budget.clientSnapshot.workAddress.city,
        budget.clientSnapshot.workAddress.postalCode,
        budget.clientSnapshot.billingAddress.street,
        budget.clientSnapshot.billingAddress.city,
        budget.clientSnapshot.billingAddress.postalCode,
        budget.workerSnapshot.name,
        budget.workerSnapshot.taxId,
        budget.workerSnapshot.phone,
        budget.workerSnapshot.email,
        budget.workerSnapshot.workAddress.street,
        budget.workerSnapshot.workAddress.city,
        budget.workerSnapshot.workAddress.postalCode,
        budget.workerSnapshot.billingAddress.street,
        budget.workerSnapshot.billingAddress.city,
        budget.workerSnapshot.billingAddress.postalCode,
        budget.workerSnapshot.bankAccount,
        budget.taxSnapshot?.name ?? null,
        budget.taxSnapshot?.rate ?? null,
        budget.taxSnapshot?.behavior ?? null,
        budget.pricingMode,
        budget.manualSubtotalAmount,
        budget.subtotalAmount,
        budget.taxAmount,
        budget.totalAmount,
        budget.createdAt,
        budget.updatedAt
      ]
    );

    await pool.query("COMMIT");

    const budgetRow = budgetResult.rows[0];
    if (!budgetRow) {
      throw new Error("Failed to create budget");
    }

    return mapBudgetRow(budgetRow);
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
}

export async function getBudgetById(id: string): Promise<Budget> {
  return querySingleBudget(
    `
      SELECT id, number, client_id, worker_id, notes, delivered_at,
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
      FROM budgets
      WHERE id = $1
    `,
    [id]
  );
}

export async function listBudgets(
  page: number,
  limit: number,
  clientId?: string,
  search?: string
): Promise<{
  budgets: Budget[];
  total: number;
  page: number;
  limit: number;
}> {
  await ensureDatabaseReady();
  const safePage = Math.max(1, Math.floor(page || 1));
  const safeLimit = Math.max(1, Math.min(100, Math.floor(limit || 20)));
  const offset = (safePage - 1) * safeLimit;

  let query = `
    SELECT id, number, client_id, worker_id, notes, delivered_at,
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
    FROM budgets
    WHERE 1=1
  `;
  const params: unknown[] = [];

  if (clientId) {
    query += ` AND client_id = $${params.length + 1}`;
    params.push(clientId);
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
  const listResult = await pool.query<BudgetRow>(query, params);

  const countQuery = query.replace(
    /SELECT.*?FROM/,
    "SELECT COUNT(*)::text AS total FROM"
  ).replace(/ORDER BY.*?OFFSET.*/, "");
  const countParams = params.slice(0, -2);
  const countResult = await pool.query<{ total: string }>(countQuery, countParams);
  const total = parseInt(countResult.rows[0]?.total ?? "0", 10);

  return {
    budgets: listResult.rows.map(mapBudgetRow),
    total,
    page: safePage,
    limit: safeLimit
  };
}

export async function updateBudgetRecord(budget: Budget): Promise<Budget> {
  return querySingleBudget(
    `
      UPDATE budgets SET
        notes = $1, delivered_at = $2,
        client_snapshot_name = $3, client_snapshot_tax_id = $4, client_snapshot_phone = $5, client_snapshot_email = $6,
        client_snapshot_work_street = $7, client_snapshot_work_city = $8, client_snapshot_work_postal_code = $9,
        client_snapshot_billing_street = $10, client_snapshot_billing_city = $11, client_snapshot_billing_postal_code = $12,
        worker_snapshot_name = $13, worker_snapshot_tax_id = $14, worker_snapshot_phone = $15, worker_snapshot_email = $16,
        worker_snapshot_work_street = $17, worker_snapshot_work_city = $18, worker_snapshot_work_postal_code = $19,
        worker_snapshot_billing_street = $20, worker_snapshot_billing_city = $21, worker_snapshot_billing_postal_code = $22,
        worker_snapshot_bank_account = $23,
        tax_snapshot_name = $24, tax_snapshot_rate = $25, tax_snapshot_behavior = $26,
        pricing_mode = $27, manual_subtotal_amount = $28,
        subtotal_amount = $29, tax_amount = $30, total_amount = $31, updated_at = $32
      WHERE id = $33
      RETURNING id, number, client_id, worker_id, notes, delivered_at,
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
      budget.notes,
      budget.deliveredAt,
      budget.clientSnapshot.name,
      budget.clientSnapshot.taxId,
      budget.clientSnapshot.phone,
      budget.clientSnapshot.email,
      budget.clientSnapshot.workAddress.street,
      budget.clientSnapshot.workAddress.city,
      budget.clientSnapshot.workAddress.postalCode,
      budget.clientSnapshot.billingAddress.street,
      budget.clientSnapshot.billingAddress.city,
      budget.clientSnapshot.billingAddress.postalCode,
      budget.workerSnapshot.name,
      budget.workerSnapshot.taxId,
      budget.workerSnapshot.phone,
      budget.workerSnapshot.email,
      budget.workerSnapshot.workAddress.street,
      budget.workerSnapshot.workAddress.city,
      budget.workerSnapshot.workAddress.postalCode,
      budget.workerSnapshot.billingAddress.street,
      budget.workerSnapshot.billingAddress.city,
      budget.workerSnapshot.billingAddress.postalCode,
      budget.workerSnapshot.bankAccount,
      budget.taxSnapshot?.name ?? null,
      budget.taxSnapshot?.rate ?? null,
      budget.taxSnapshot?.behavior ?? null,
      budget.pricingMode,
      budget.manualSubtotalAmount,
      budget.subtotalAmount,
      budget.taxAmount,
      budget.totalAmount,
      budget.updatedAt,
      budget.id
    ]
  );
}

export async function deleteBudgetRecord(id: string): Promise<void> {
  await ensureDatabaseReady();
  const result = await getDbPool().query("DELETE FROM budgets WHERE id = $1", [id]);
  if (result.rowCount === 0) {
    throw new EntityNotFoundError("Budget not found");
  }
}

export const postgresBudgetRepository: BudgetRepository = {
  create: (budget) => createBudgetRecord(budget, postgresJobItemRepository),
  getById: getBudgetById,
  list: listBudgets,
  update: updateBudgetRecord,
  delete: deleteBudgetRecord
};
