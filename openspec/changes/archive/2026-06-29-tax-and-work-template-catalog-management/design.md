## Context

The settings page (`CommercialDocumentCatalogAndSettings`) hosts catalog managers for tax definitions and work templates. Both managers were implemented with create-only UIs despite the backend having full CRUD support (create, update, archive, reactivate) from day one.

Current state:
- `TaxService` and `WorkTemplateService` API clients expose only `create` and `getAll`
- `useTaxesList` and `useWorkTemplatesList` hooks expose only `create` and `getAll`
- Both catalog managers render a status column but provide no actions to change status
- `WorkTemplateCatalogManager` has a broken i18n key for the active status badge (renders "Work Templates" instead of "Active")
- `WorkTemplateResponse` schema has no `update` or `archive` request types (needs adding)
- `JobItemForm` already correctly filters to active-only templates (`includeInactive: false`) — no change needed there

Relevant ADRs in force:
- **ADR-0002** (Layer Boundaries): frontend may only reach the backend through API clients; no direct DB or use-case access from components.
- **ADR-0003** (Commercial Document Design): catalogs support active/inactive lifecycle; inactive items must not appear in document editing forms.

## Goals / Non-Goals

**Goals:**
- Users can edit and toggle active/inactive state for both taxes and work templates from the settings UI
- Status badge in both managers correctly reflects current state with proper i18n
- Only active items appear in document editing forms (already true for templates; verify for taxes)

**Non-Goals:**
- No backend changes — all API routes, use cases, and DB schema are already complete
- No hard-delete — inactive/archived items remain in DB and visible in settings
- No bulk operations
- No change to how taxes are selected in document line items (separate concern)

## Decisions

### 1. Inline edit form per row (not modal)

The existing add-form pattern uses an inline form below the header. Extending this to edit means showing the same form pre-populated when the user clicks "Edit" on a row.

**Alternative considered**: Modal dialog. Rejected — would introduce a new UI pattern not present elsewhere in settings. Inline form keeps consistency.

### 2. Toggle active/inactive, not one-way archive

The backend's `PATCH /api/taxes/:id` accepts `isActive` directly. `PATCH /api/work-templates/:id` does the same (via the update use case). A dedicated `/archive` endpoint also exists but sets `isActive = false` only.

Decision: use `PATCH` with `isActive` toggle for both activate and deactivate. This is simpler, avoids the asymmetric archive endpoint, and keeps both directions available.

**Alternative considered**: Use `/archive` for deactivate + `PATCH isActive: true` for reactivate. Rejected — two different endpoints for what is semantically one toggle is unnecessary complexity.

### 3. Extend service clients and hooks, not bypass them

Per ADR-0002, components must not call `fetch` directly. The missing `update` and `archive/toggle` operations are added to `TaxService`, `WorkTemplateService`, `useTaxesList`, and `useWorkTemplatesList` — following the exact pattern of existing `create`.

### 4. Add `catalog.templates.status` i18n keys; reuse `catalog.taxes.status` keys for taxes

Tax status keys (`catalog.taxes.status.active/inactive`) already exist. Work template status keys are missing — add a parallel `catalog.templates.status.active/inactive` namespace. Both managers then use their own namespace, keeping i18n clean.

Note: the current `TaxCatalogManager` uses `as any` casts for tax status keys because they are missing from the TypeScript type — fixing the `WorkTemplateCatalogManager` bug will expose this too. Properly typing these keys is in scope.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Edit form pre-population logic could conflict with the add form's state | Use separate `editingId` + `editFormData` state, distinct from the add form state |
| `PATCH /api/work-templates/:id` route needs verification it accepts `isActive` toggle (not just title/description/price) | Check route handler before implementing; use archive endpoint as fallback |
| i18n `as any` casts could mask missing keys in `es` and `ca` locales | Add keys to all three locale files in the same task |
