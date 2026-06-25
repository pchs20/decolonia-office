import { Tax } from "@/domain/entities/tax";
import { TaxRow } from "@/infrastructure/persistence/postgres/models/tax-row";

export function mapTaxRow(row: TaxRow): Tax {
  return {
    id: row.id,
    name: row.name,
    rate: Number(row.rate),
    behavior: row.behavior as "added",
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
