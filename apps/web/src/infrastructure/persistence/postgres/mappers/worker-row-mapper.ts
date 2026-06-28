import { Worker } from "@/domain/entities/worker";
import { WorkerRow } from "@/infrastructure/persistence/postgres/models/worker-row";

export function mapWorkerRow(row: WorkerRow): Worker {
  const workAddress = {
    street: row.street,
    city: row.city,
    postalCode: row.postal_code
  };
  const billingAddress = {
    street: row.billing_street ?? row.street,
    city: row.billing_city ?? row.city,
    postalCode: row.billing_postal_code ?? row.postal_code
  };

  return {
    id: row.id,
    name: row.name,
    workAddress,
    billingAddress,
    taxId: row.tax_id,
    phone: row.phone,
    email: row.email,
    bankAccount: row.bank_account,
    isActive: row.is_active,
    isPrimary: row.is_primary,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at)
  };
}