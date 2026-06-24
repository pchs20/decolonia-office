import { Invoice } from "@/domain/entities/invoice";
import { InvoiceResponse } from "@/api/schemas/invoice-schemas";

export function mapInvoiceToResponse(invoice: Invoice): InvoiceResponse {
  return {
    id: invoice.id,
    number: invoice.number,
    client: {
      id: invoice.clientId,
      name: invoice.clientSnapshot.name,
      taxId: invoice.clientSnapshot.taxId,
      phone: invoice.clientSnapshot.phone,
      email: invoice.clientSnapshot.email,
      workAddress: {
        street: invoice.clientSnapshot.workAddress.street,
        city: invoice.clientSnapshot.workAddress.city,
        postalCode: invoice.clientSnapshot.workAddress.postalCode
      },
      billingAddress: {
        street: invoice.clientSnapshot.billingAddress.street,
        city: invoice.clientSnapshot.billingAddress.city,
        postalCode: invoice.clientSnapshot.billingAddress.postalCode
      }
    },
    worker: {
      id: invoice.workerId,
      name: invoice.workerSnapshot.name,
      taxId: invoice.workerSnapshot.taxId,
      phone: invoice.workerSnapshot.phone,
      email: invoice.workerSnapshot.email,
      workAddress: {
        street: invoice.workerSnapshot.workAddress.street,
        city: invoice.workerSnapshot.workAddress.city,
        postalCode: invoice.workerSnapshot.workAddress.postalCode
      },
      billingAddress: {
        street: invoice.workerSnapshot.billingAddress.street,
        city: invoice.workerSnapshot.billingAddress.city,
        postalCode: invoice.workerSnapshot.billingAddress.postalCode
      }
    },
    notes: invoice.notes,
    pricingMode: invoice.pricingMode,
    manualSubtotalAmount: invoice.manualSubtotalAmount,
    tax: invoice.taxSnapshot
      ? {
          name: invoice.taxSnapshot.name,
          rate: invoice.taxSnapshot.rate,
          behavior: invoice.taxSnapshot.behavior
        }
      : null,
    subtotalAmount: invoice.subtotalAmount,
    taxAmount: invoice.taxAmount,
    totalAmount: invoice.totalAmount,
    issuedAt: invoice.issuedAt,
    sourceBudgetId: invoice.sourceBudgetId,
    createdAt: invoice.createdAt,
    updatedAt: invoice.updatedAt
  };
}
