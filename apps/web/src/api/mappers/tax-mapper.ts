import { Tax } from "@/domain/entities/tax";
import { TaxResponse } from "@/api/schemas/tax-schemas";

export function mapTaxToResponse(tax: Tax): TaxResponse {
  return {
    id: tax.id,
    name: tax.name,
    rate: tax.rate,
    behavior: tax.behavior,
    isActive: tax.isActive,
    createdAt: tax.createdAt,
    updatedAt: tax.updatedAt
  };
}
