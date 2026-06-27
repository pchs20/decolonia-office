## Why

Budgets and invoices are currently only viewable inside the app. Users need to share them with clients as professional PDF documents. The structured data is already in place — this change adds PDF export on top of it.

## What Changes

- Add an "Export PDF" button to the budget and invoice detail pages (view mode).
- Introduce server-side PDF generation via new API routes (`GET /api/budgets/[id]/pdf`, `GET /api/invoices/[id]/pdf`) using `@react-pdf/renderer`.
- Create two distinct PDF templates: `BudgetDocument` and `InvoiceDocument`, with shared sub-components (`IssuerBlock`, `ClientBlock`, `JobItemsTable`, `TotalsBlock`).
- Job items are always rendered as a structured table in the PDF. The `notes` field is intentionally omitted from the PDF (it is internal/worker-facing only).
- Add `bankAccount` (optional string) to the worker profile and materialize it into `WorkerSnapshot`. The invoice template renders a payment block using this field.
- Add a bank account input field to the worker/settings profile edit form.

## Capabilities

### New Capabilities
- `budget-and-invoices-export`: Export budget and invoice documents as PDF files via server-side rendering using structured job items and worker/client snapshots.

### Modified Capabilities
- `worker-profiles`: Add `bankAccount` field to worker profile (stored, editable in settings, materialized into snapshot).
- `budget-management`: Add PDF export entry point on budget detail view.
- `invoice-management`: Add PDF export entry point on invoice detail view.

## Impact

- **Domain**: `WorkerSnapshot` gains `bankAccount?: string`; `Profile`/`Worker` entity gains `bankAccount` field.
- **Persistence**: Additive migration — add `bank_account` column to `profiles` table (nullable).
- **API**: Two new read-only PDF endpoints (`/api/budgets/[id]/pdf`, `/api/invoices/[id]/pdf`); updated worker read/write API to include `bankAccount`.
- **Frontend**: Export button on budget/invoice detail pages; bank account field in worker settings form.
- **Dependencies**: Add `@react-pdf/renderer` to the web app.
