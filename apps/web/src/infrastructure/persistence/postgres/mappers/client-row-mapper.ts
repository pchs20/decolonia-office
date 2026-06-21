import { Client } from "@/domain/entities/client";
import { ClientRow } from "@/infrastructure/persistence/postgres/models/client-row";

export function mapClientRow(row: ClientRow): Client {
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
    type: row.type,
    workAddress,
    billingAddress,
    taxId: row.tax_id,
    phone: row.phone,
    email: row.email,
    isActive: row.is_active,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at)
  };
}