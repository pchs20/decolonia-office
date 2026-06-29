## 1. Fix backend gap: reactivation support

- [x] 1.1 In `commercial-documents-service.ts`, extend `updateWorkTemplate` to also handle `isActive === true` (reactivation) — currently only `isActive === false` triggers a state change; `true` is silently ignored
- [x] 1.2 Verify `PATCH /api/taxes/:id` route and tax service correctly handle `isActive: true` for reactivation (it passes `isActive` directly to `updateTax`, which should be fine — confirm no silent drop)

## 2. Extend API service clients

- [x] 2.1 Add `TaxService.update(id, data: TaxUpdateRequest): Promise<TaxResponse>` — `PATCH /api/taxes/:id` with `{ name, rate, isActive }`
- [x] 2.2 Add `TaxService.toggleActive(id, isActive: boolean): Promise<TaxResponse>` — `PATCH /api/taxes/:id` with `{ isActive }` only
- [x] 2.3 Add `WorkTemplateService.update(id, data: WorkTemplateUpdateRequest): Promise<WorkTemplateResponse>` — `PATCH /api/work-templates/:id`
- [x] 2.4 Add `WorkTemplateService.toggleActive(id, isActive: boolean): Promise<WorkTemplateResponse>` — `PATCH /api/work-templates/:id` with `{ isActive }` only
- [x] 2.5 Verify `TaxUpdateRequest` and `WorkTemplateUpdateRequest` schemas include `isActive?: boolean` (add to schema files if missing)

## 3. Extend frontend hooks

- [x] 3.1 Add `update(id, data)` and `toggleActive(id, isActive)` callbacks to `useTaxesList` hook in `catalog-hooks.ts` — follow existing `create` pattern (optimistic state update or re-fetch)
- [x] 3.2 Add `update(id, data)` and `toggleActive(id, isActive)` callbacks to `useWorkTemplatesList` hook in `catalog-hooks.ts`

## 4. Fix i18n

- [x] 4.1 Add `catalog.templates.status.active` and `catalog.templates.status.inactive` keys to `en.json`
- [x] 4.2 Add the same keys to `es.json`
- [x] 4.3 Add the same keys to `ca.json`
- [x] 4.4 Rename existing `catalog.taxes.status.archived` key to `catalog.taxes.status.inactive` in all three locale files, and update `TaxCatalogManager` references accordingly (aligns with active/inactive model)

## 5. Update TaxCatalogManager component

- [x] 5.1 Fix status badge label: replace `archivedStatusLabel` references with `inactive` key
- [x] 5.2 Add `editingId` and `editFormData` state (separate from the add form state)
- [x] 5.3 Add "Edit" button to each active row; clicking sets `editingId` and pre-populates `editFormData`
- [x] 5.4 Render inline edit form (name, rate) when `editingId` matches a row; include Save and Cancel actions
- [x] 5.5 Add "Deactivate" button to each active row; calls `toggleActive(id, false)` and refreshes list
- [x] 5.6 Add "Reactivate" button to each inactive row; calls `toggleActive(id, true)` and refreshes list
- [x] 5.7 Remove the `as any` casts for status label translation keys (they should now be properly typed after i18n task 4.4)

## 6. Update WorkTemplateCatalogManager component

- [x] 6.1 Fix broken status badge: replace `t("catalog.templates.title")` with correct active status key `t("catalog.templates.status.active")`
- [x] 6.2 Fix hardcoded `"Archived"` string: replace with `t("catalog.templates.status.inactive")`
- [x] 6.3 Add `editingId` and `editFormData` state (separate from the add form state)
- [x] 6.4 Add "Edit" button to each active row; clicking sets `editingId` and pre-populates `editFormData`
- [x] 6.5 Render inline edit form (title, description, defaultUnitPrice) when `editingId` matches a row; include Save and Cancel actions
- [x] 6.6 Add "Deactivate" button to each active row; calls `toggleActive(id, false)` and refreshes list
- [x] 6.7 Add "Reactivate" button to each inactive row; calls `toggleActive(id, true)` and refreshes list

## 7. Verify document forms only show active items

- [x] 7.1 Confirm `JobItemForm` calls `loadTemplates(1, 100, false)` — already correct, no change needed (verify and mark done)
- [x] 7.2 Locate where taxes are loaded for budget/invoice line item forms and confirm `includeInactive: false` (or equivalent filtering); fix if inactive taxes are being shown
