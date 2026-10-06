## Why

Batch exports currently create English-named document folders even though the application's user-facing document terminology is Spanish. Renaming the folders for future exports makes downloaded ZIP archives and Google Drive backups easier for the intended users to browse, without changing internal document identifiers or the existing structured workbook schema.

## What Changes

- Rename budget PDF folders in local ZIP exports from `Budgets` to `Presupuestos`.
- Rename invoice PDF folders in local ZIP exports from `Invoices` to `Facturas`.
- Create and use `Presupuestos` and `Facturas` as the corresponding Google Drive folders for future synchronizations.
- Report cloud-sync document paths using the Spanish folder names.
- Keep workbook tabs named `Clients`, `Budgets`, and `Invoices`.
- Keep internal document types, API values, export-state keys, and PDF filename prefixes unchanged.
- Do not migrate, rename, or delete existing `Budgets` or `Invoices` folders or their contents in Google Drive.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `document-backup-export`: Change the required ZIP PDF folder paths to use `Presupuestos` and `Facturas` while preserving the workbook tabs and quarter hierarchy.
- `document-cloud-sync`: Change the Google Drive PDF folder hierarchy and completion paths to use `Presupuestos` and `Facturas` for future exports, without migrating existing English-named folders.

## Impact

- Updates the shared folder-name constants/paths used by the backup bundle assembler, cloud synchronization use case, and Google Drive destination adapter.
- Updates focused tests and relevant OpenSpec requirements/examples.
- No database migration, API contract change, export-state schema change, or dependency change is expected.
- Existing Google Drive export-state records remain valid; subsequent exports use the new folders while existing English folders are left untouched.
