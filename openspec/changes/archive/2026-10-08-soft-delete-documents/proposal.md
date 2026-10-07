## Why

Users need to remove clients, budgets, and invoices from active work without destroying historical records. The current client action already archives clients, but budgets and invoices are hard-deleted and exports do not distinguish records that should no longer be active.

## What Changes

- Add soft-delete state to budgets and invoices, matching the existing client behavior.
- Exclude inactive clients, budgets, and invoices from normal reads, listings, duplication, PDF access, and local backup exports.
- Keep documents belonging to inactive clients visible as historical records.
- Clear `source_budget_id` when a source budget is soft-deleted, preserving linked invoices.
- Reconcile Google Drive exports on the next sync by removing inactive records from the spreadsheet and moving their exported PDFs to Drive trash, retrying failures later.
- Add simple-confirmation delete actions to the list and detail views for clients, budgets, and invoices.
- Defer restore functionality.

## Capabilities

### New Capabilities

- `soft-delete-records`: Archive clients, budgets, and invoices while excluding inactive records from active workflows and exports.
- `export-deletion-reconciliation`: Remove records soft-deleted locally from the next Google Drive synchronization, including trashing exported PDFs.

### Modified Capabilities

- None.

## Impact

- PostgreSQL migrations and client, budget, invoice, and export-state repositories.
- Commercial document use cases and API route behavior for get, list, duplicate, PDF, and delete operations.
- Local backup assembly and Google Drive synchronization ports/adapters.
- Client, budget, and invoice list/detail UI and translations.
- Tests covering persistence filtering, soft-delete behavior, export omission/reconciliation, and UI/API delete flows.
