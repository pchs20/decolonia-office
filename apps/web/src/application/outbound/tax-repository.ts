import { Tax } from "@/domain/entities/tax";

export interface TaxRepository {
  create(tax: Tax): Promise<Tax>;
  getById(id: string): Promise<Tax>;
  list(page: number, limit: number, includeInactive?: boolean): Promise<{
    taxes: Tax[];
    total: number;
    page: number;
    limit: number;
  }>;
  update(tax: Tax): Promise<Tax>;
  archive(id: string): Promise<void>;
}
