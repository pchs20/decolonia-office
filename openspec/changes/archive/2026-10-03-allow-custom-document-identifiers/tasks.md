## 1. Persistence and Domain Contracts

- [x] 1.1 Add a migration removing the `UNIQUE` constraints from `budgets.number` and `invoices.number` while retaining searchable indexes.
- [x] 1.2 Add identifier validation shared by budget and invoice create/update flows: trim, require non-empty text, reject control characters, and enforce 255 characters.
- [x] 1.3 Add explicit `automatic`/`custom` identifier source tracking to budget and invoice persistence, domain entities, responses, and request contracts; do not infer it from identifier equality.
- [x] 1.4 Extend budget and invoice request schemas, domain/use-case parameters, and repository contracts to carry identifier mode, an optional custom identifier, and explicit duplicate confirmation.
- [x] 1.5 Add same-type identifier lookup methods that exclude the current document during updates.

## 2. Create and Update Behavior

- [x] 2.1 Preserve automatic allocation when creation remains in automatic mode; ensure custom creation does not mutate sequence settings.
- [x] 2.2 Implement creation-form reset-to-automatic behavior and ensure it restores the original suggestion without changing sequence state.
- [x] 2.3 Implement duplicate warning responses for unconfirmed custom creates and updates, including enough conflicting-document context for the UI.
- [x] 2.4 Implement confirmed duplicate persistence for budget and invoice creation and editing while preserving the internal UUID.
- [x] 2.5 Map database and validation errors to stable API responses and update the generated OpenAPI contract.

## 3. User Interface

- [x] 3.1 Add an identifier display/edit/reset control to the budget form that starts in automatic mode and switches explicitly to custom mode.
- [x] 3.2 Add the equivalent identifier display/edit/reset control and duplicate-confirmation flow to the invoice form.
- [x] 3.3 Add localized labels, validation messages, duplicate warnings, and confirmation copy for all supported locales.
- [x] 3.4 Ensure list/detail views clearly distinguish documents that share an identifier using existing client/date context where needed.

## 4. Export Safety

- [x] 4.1 Create a shared export filename helper that sanitizes identifiers and appends a stable short UUID suffix.
- [x] 4.2 Use the helper for local ZIP exports and Google Drive synchronization without changing the identifier stored in XLSX or rendered document content.
- [x] 4.3 Verify export state continues to key updates by document type and internal UUID so identifier edits rename only the correct external file.

## 5. Verification and Migration

- [x] 5.1 Add unit and route tests for automatic/custom source tracking, reset-to-automatic, custom text identifiers, validation failures, same-type duplicate warnings, cross-type reuse, and confirmed duplicates.
- [x] 5.2 Add repository and migration tests proving source tracking, duplicate numbers persist with distinct UUIDs, and updates exclude the current row from duplicate detection.
- [x] 5.3 Add export tests for duplicate identifiers, sanitized filename collisions, stable suffixes, and cloud rename behavior.
- [x] 5.4 Run the application test suite and type checks; document any migration rollback limitations. OpenSpec's installed CLI has no `verify` command.
