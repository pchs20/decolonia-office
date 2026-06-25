import { randomUUID } from "crypto";
import { Tax } from "@/domain/entities/tax";
import { TaxRepository } from "@/application/outbound/tax-repository";

export async function createTax(
  name: string,
  rate: number,
  taxRepo: TaxRepository
): Promise<Tax> {
  const now = new Date();
  const tax: Tax = {
    id: randomUUID(),
    name,
    rate,
    behavior: "added",
    isActive: true,
    createdAt: now,
    updatedAt: now
  };

  return taxRepo.create(tax);
}

export async function updateTax(
  taxId: string,
  name: string,
  rate: number,
  taxRepo: TaxRepository
): Promise<Tax> {
  const tax = await taxRepo.getById(taxId);
  tax.name = name;
  tax.rate = rate;
  tax.updatedAt = new Date();
  return taxRepo.update(tax);
}

export async function deactivateTax(
  taxId: string,
  taxRepo: TaxRepository
): Promise<Tax> {
  const tax = await taxRepo.getById(taxId);
  tax.isActive = false;
  tax.updatedAt = new Date();
  return taxRepo.update(tax);
}

export async function archiveTax(
  taxId: string,
  taxRepo: TaxRepository
): Promise<void> {
  await taxRepo.archive(taxId);
}
