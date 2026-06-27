import { Invoice } from "@/domain/entities/invoice";
import { InvoiceRow } from "@/infrastructure/persistence/postgres/models/invoice-row";

export function mapInvoiceRow(row: InvoiceRow): Invoice {
  return {
    id: row.id,
    number: row.number,
    clientId: row.client_id,
    clientSnapshot: {
      name: row.client_snapshot_name,
      taxId: row.client_snapshot_tax_id,
      phone: row.client_snapshot_phone,
      email: row.client_snapshot_email,
      workAddress: {
        street: row.client_snapshot_work_street,
        city: row.client_snapshot_work_city,
        postalCode: row.client_snapshot_work_postal_code
      },
      billingAddress: {
        street: row.client_snapshot_billing_street,
        city: row.client_snapshot_billing_city,
        postalCode: row.client_snapshot_billing_postal_code
      }
    },
    workerId: row.worker_id,
    workerSnapshot: {
      name: row.worker_snapshot_name,
      taxId: row.worker_snapshot_tax_id,
      phone: row.worker_snapshot_phone,
      email: row.worker_snapshot_email,
      workAddress: {
        street: row.worker_snapshot_work_street,
        city: row.worker_snapshot_work_city,
        postalCode: row.worker_snapshot_work_postal_code
      },
      billingAddress: {
        street: row.worker_snapshot_billing_street,
        city: row.worker_snapshot_billing_city,
        postalCode: row.worker_snapshot_billing_postal_code
      },
      bankAccount: row.worker_snapshot_bank_account
    },
    notes: row.notes,
    taxSnapshot: row.tax_snapshot_name
      ? {
          name: row.tax_snapshot_name,
          rate: Number(row.tax_snapshot_rate),
          behavior: row.tax_snapshot_behavior as "added"
        }
      : null,
    pricingMode: row.pricing_mode,
    manualSubtotalAmount: row.manual_subtotal_amount !== null ? Number(row.manual_subtotal_amount) : null,
    subtotalAmount: Number(row.subtotal_amount),
    taxAmount: Number(row.tax_amount),
    totalAmount: Number(row.total_amount),
    issuedAt: row.issued_at,
    sourceBudgetId: row.source_budget_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
