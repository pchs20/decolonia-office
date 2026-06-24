import { ensureDatabaseReady, getDbPool } from "@/infrastructure/persistence/postgres/db";
import { EntityNotFoundError } from "@/domain/exceptions";
import { WorkTemplate } from "@/domain/entities/work-template";
import { WorkTemplateRepository } from "@/application/outbound/work-template-repository";
import { WorkTemplateRow } from "@/infrastructure/persistence/postgres/models/work-template-row";
import { mapWorkTemplateRow } from "@/infrastructure/persistence/postgres/mappers/work-template-row-mapper";

async function querySingleTemplate(sql: string, params: unknown[]): Promise<WorkTemplate> {
  await ensureDatabaseReady();
  const result = await getDbPool().query<WorkTemplateRow>(sql, params);
  const row = result.rows[0];

  if (!row) {
    throw new EntityNotFoundError("Work template not found");
  }

  return mapWorkTemplateRow(row);
}

export async function createWorkTemplateRecord(template: WorkTemplate): Promise<WorkTemplate> {
  return querySingleTemplate(
    `
      INSERT INTO work_templates (id, title, description, default_unit_price, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, title, description, default_unit_price, is_active, created_at, updated_at
    `,
    [template.id, template.title, template.description, template.defaultUnitPrice, template.isActive, template.createdAt, template.updatedAt]
  );
}

export async function getWorkTemplateById(id: string): Promise<WorkTemplate> {
  return querySingleTemplate(
    `
      SELECT id, title, description, default_unit_price, is_active, created_at, updated_at
      FROM work_templates
      WHERE id = $1
    `,
    [id]
  );
}

export async function listWorkTemplates(
  page: number,
  limit: number,
  includeInactive?: boolean
): Promise<{
  templates: WorkTemplate[];
  total: number;
  page: number;
  limit: number;
}> {
  await ensureDatabaseReady();
  const safePage = Math.max(1, Math.floor(page || 1));
  const safeLimit = Math.max(1, Math.min(100, Math.floor(limit || 20)));
  const offset = (safePage - 1) * safeLimit;

  let query = `
    SELECT id, title, description, default_unit_price, is_active, created_at, updated_at
    FROM work_templates
  `;
  const params: unknown[] = [];

  if (!includeInactive) {
    query += ` WHERE is_active = true`;
  }

  query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(safeLimit, offset);

  const pool = getDbPool();
  const listResult = await pool.query<WorkTemplateRow>(query, params);

  const countQuery = `SELECT COUNT(*)::text AS total FROM work_templates${!includeInactive ? " WHERE is_active = true" : ""}`;
  const countResult = await pool.query<{ total: string }>(countQuery);
  const total = parseInt(countResult.rows[0]?.total ?? "0", 10);

  return {
    templates: listResult.rows.map(mapWorkTemplateRow),
    total,
    page: safePage,
    limit: safeLimit
  };
}

export async function updateWorkTemplateRecord(template: WorkTemplate): Promise<WorkTemplate> {
  return querySingleTemplate(
    `
      UPDATE work_templates SET
        title = $1, description = $2, default_unit_price = $3, is_active = $4, updated_at = $5
      WHERE id = $6
      RETURNING id, title, description, default_unit_price, is_active, created_at, updated_at
    `,
    [template.title, template.description, template.defaultUnitPrice, template.isActive, template.updatedAt, template.id]
  );
}

export async function archiveWorkTemplateRecord(id: string): Promise<void> {
  await ensureDatabaseReady();
  const result = await getDbPool().query(
    `
      UPDATE work_templates SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `,
    [id]
  );

  if (result.rowCount === 0) {
    throw new EntityNotFoundError("Work template not found");
  }
}

export const postgresWorkTemplateRepository: WorkTemplateRepository = {
  create: createWorkTemplateRecord,
  getById: getWorkTemplateById,
  list: listWorkTemplates,
  update: updateWorkTemplateRecord,
  archive: archiveWorkTemplateRecord
};
