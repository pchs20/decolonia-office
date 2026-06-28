## Why

Workers are a first-class navigation item with the same UX as clients, but the app has a single worker (the self-employed contractor issuing all documents). The worker selector on budget/invoice forms adds friction with no value, and the workers section in the main nav clutters the navigation for a concept that is effectively static configuration.

## What Changes

- Remove the Workers tab from the main navigation bar
- Move worker management (CRUD) to a new "Workers" tab inside Settings (5th tab in `CommercialDocumentCatalogAndSettings`)
- Introduce an **is_primary** flag on the Worker entity to designate the one active worker whose snapshot is automatically captured on new commercial documents
- Remove the worker picker from BudgetForm and InvoiceForm; the primary worker snapshot is resolved server-side silently
- Block budget/invoice creation with an informative error when no primary worker is configured
- Move worker routes from `/workers/*` to `/settings/workers/*`

## Capabilities

### New Capabilities
- `primary-worker-designation`: Designate one worker as primary; all new commercial documents automatically capture the primary worker snapshot without user interaction

### Modified Capabilities
- `worker-profiles`: Management UI moves to Settings; worker routes relocate to `/settings/workers/*`; new `is_primary` field added to the data model and API
- `budget-management`: Worker picker removed from BudgetForm; primary worker snapshot auto-resolved on creation; form blocks when no primary worker is set
- `invoice-management`: Worker picker removed from InvoiceForm; primary worker snapshot auto-resolved on creation; form blocks when no primary worker is set

## Impact

- **DB migration**: Add `is_primary BOOLEAN DEFAULT false` to `workers` table with a partial unique index enforcing at most one primary worker
- **API**: `PATCH /api/workers/:id` extended to support `isPrimary: true` (atomically unsets all others); new `GET /api/workers/primary` endpoint (or query param) to resolve the active worker
- **Presentation**: `AppShell` nav loses the Workers link; `CommercialDocumentCatalogAndSettings` gains a Workers tab; `BudgetForm`/`InvoiceForm` drop the worker selector and gain a blocking callout if no primary worker exists
- **Routing**: Pages under `/workers/*` are replaced by `/settings/workers/*`; the old routes should redirect or be removed
