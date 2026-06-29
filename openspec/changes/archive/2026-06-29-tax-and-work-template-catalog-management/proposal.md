## Why

The settings UI for tax definitions and work templates lets users create items but provides no way to edit or deactivate them. The backend fully supports update and archive/reactivate operations, but the frontend never exposes them — leaving the status column meaningless and the catalog unmanageable after initial setup.

## What Changes

- Add **edit** (inline) and **deactivate/reactivate** (toggle) row actions to `TaxCatalogManager` and `WorkTemplateCatalogManager`
- Expose `update` and `archive` methods in `TaxService` and `WorkTemplateService` API clients
- Add `update` and `archive` callbacks to `useTaxesList` and `useWorkTemplatesList` hooks
- Fix the broken status badge in `WorkTemplateCatalogManager` (currently renders section title instead of "Active")
- Add missing `catalog.templates.status.active/inactive` i18n keys to all three locale files (`en`, `es`, `ca`)
- Confirm `JobItemForm` only loads active templates (`includeInactive: false`) — already correct, no change needed
- Confirm tax selectors in budget/invoice forms only show active taxes — verify and fix if needed

## Capabilities

### New Capabilities

_(none — this is a gap-fill in an existing capability)_

### Modified Capabilities

- `commercial-document-catalog-and-settings`: Adds edit and active/inactive toggle actions to both tax and work template catalog managers. The requirement that catalogs support full CRUD management (create, edit, deactivate, reactivate) is now enforced in the UI, not just the backend.

## Impact

- **Frontend only** — no backend, DB, or API route changes required
- Files touched:
  - `src/presentation/api-clients/tax.service.ts`
  - `src/presentation/api-clients/work-template.service.ts`
  - `src/presentation/hooks/catalog-hooks.ts`
  - `src/presentation/components/settings/TaxCatalogManager.tsx`
  - `src/presentation/components/settings/WorkTemplateCatalogManager.tsx`
  - `src/presentation/i18n/messages/en.json`, `es.json`, `ca.json`
- No new dependencies
- No breaking changes
