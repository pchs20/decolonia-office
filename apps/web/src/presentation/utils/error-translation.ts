/**
 * Maps API error messages to translation keys
 * Uses string casting to allow for runtime translation of error messages
 */
export function getErrorTranslationKey(errorMessage: string): string {
  const errorMap: Record<string, string> = {
    // Budget errors
    "Failed to fetch budgets": "budgets.errors.fetchFailed",
    "Failed to create budget": "budgets.errors.createFailed",

    // Invoice errors
    "Failed to fetch invoices": "invoices.errors.fetchFailed",
    "Failed to create invoice": "invoices.errors.createFailed",

    // Client errors
    "Failed to fetch clients": "clients.errors.fetchFailed",
    "Failed to fetch client": "clients.errors.fetchOneFailed",
    "Failed to create client": "clients.errors.createFailed",
    "Failed to update client": "clients.errors.updateFailed",
    "Failed to delete client": "clients.errors.deleteFailed",
    "Client not found": "clients.errors.notFound",

    // Worker errors
    "Failed to fetch workers": "workers.errors.fetchFailed",
    "Failed to fetch worker": "workers.errors.fetchOneFailed",
    "Failed to create worker": "workers.errors.createFailed",
    "Failed to update worker": "workers.errors.updateFailed",
    "Failed to delete worker": "workers.errors.deleteFailed",
    "Worker not found": "workers.errors.notFound",

    // Tax definition errors
    "Failed to fetch tax definitions": "catalog.taxes.errors.fetchFailed",
    "Failed to create tax definition": "catalog.taxes.errors.createFailed",
    "Failed to update tax definition": "catalog.taxes.errors.updateFailed",
    "Failed to delete tax definition": "catalog.taxes.errors.deleteFailed",

  };

  return errorMap[errorMessage] || "common.errors.unknown";
}
