import { Budget } from "@/domain/entities/budget";
import { BudgetResponse } from "@/api/schemas/budget-schemas";

export function mapBudgetToResponse(budget: Budget): BudgetResponse {
  return {
    id: budget.id,
    number: budget.number,
    client: {
      id: budget.clientId,
      name: budget.clientSnapshot.name,
      taxId: budget.clientSnapshot.taxId,
      phone: budget.clientSnapshot.phone,
      email: budget.clientSnapshot.email,
      workAddress: {
        street: budget.clientSnapshot.workAddress.street,
        city: budget.clientSnapshot.workAddress.city,
        postalCode: budget.clientSnapshot.workAddress.postalCode
      },
      billingAddress: {
        street: budget.clientSnapshot.billingAddress.street,
        city: budget.clientSnapshot.billingAddress.city,
        postalCode: budget.clientSnapshot.billingAddress.postalCode
      }
    },
    worker: {
      id: budget.workerId,
      name: budget.workerSnapshot.name,
      taxId: budget.workerSnapshot.taxId,
      phone: budget.workerSnapshot.phone,
      email: budget.workerSnapshot.email,
      bankAccount: budget.workerSnapshot.bankAccount,
      workAddress: {
        street: budget.workerSnapshot.workAddress.street,
        city: budget.workerSnapshot.workAddress.city,
        postalCode: budget.workerSnapshot.workAddress.postalCode
      },
      billingAddress: {
        street: budget.workerSnapshot.billingAddress.street,
        city: budget.workerSnapshot.billingAddress.city,
        postalCode: budget.workerSnapshot.billingAddress.postalCode
      }
    },
    notes: budget.notes,
    pricingMode: budget.pricingMode,
    manualSubtotalAmount: budget.manualSubtotalAmount,
    tax: budget.taxSnapshot
      ? {
          name: budget.taxSnapshot.name,
          rate: budget.taxSnapshot.rate,
          behavior: budget.taxSnapshot.behavior
        }
      : null,
    subtotalAmount: budget.subtotalAmount,
    taxAmount: budget.taxAmount,
    totalAmount: budget.totalAmount,
    deliveredAt: budget.deliveredAt,
    createdAt: budget.createdAt,
    updatedAt: budget.updatedAt
  };
}
