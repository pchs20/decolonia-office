import { WorkTemplate } from "@/domain/entities/work-template";
import { WorkTemplateRow } from "@/infrastructure/persistence/postgres/models/work-template-row";

export function mapWorkTemplateRow(row: WorkTemplateRow): WorkTemplate {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    defaultUnitPrice: row.default_unit_price ? Number(row.default_unit_price) : null,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
