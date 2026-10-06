## Context

Batch export assembly currently uses English folder labels in both output paths and the Google Drive destination adapter. The application already separates user-facing export names from internal document types: `budget` and `invoice` are stable application values, while PDF filenames already use Spanish prefixes. The existing export-state records store provider file references and do not depend on folder names.

The change is intentionally forward-only. Google Drive's existing English folders are not discovered for migration and are not removed. A future synchronization prepares separate Spanish-named root folders, while stateful file updates continue to use their stored external file references.

## Architecture Diagrams

```text
                 current database
                        |
              +---------+---------+
              |                   |
       local bundle             cloud sync
              |                   |
       ZIP path builder     Drive destination adapter
              |                   |
   Presupuestos / Facturas  Presupuestos / Facturas
```

Assumption: workbook tab names are structured backup schema names and remain English; only PDF folder labels are localized.

## Goals / Non-Goals

**Goals:**

- Use `Presupuestos` for budget PDF folders in ZIP and Google Drive exports.
- Use `Facturas` for invoice PDF folders in ZIP and Google Drive exports.
- Keep cloud completion paths aligned with the actual destination hierarchy.
- Preserve internal document types, export-state identity, filename conventions, quarter folders, and workbook tabs.
- Leave existing English Google Drive folders and files untouched.

**Non-Goals:**

- Renaming or moving existing Google Drive folders or files.
- Migrating historical ZIP archives.
- Localizing spreadsheet tab names, API contracts, database values, or export-state keys.
- Introducing a new localization abstraction for unrelated application surfaces.

## Decisions

### Use one shared pair of export folder labels

Update the folder labels at the boundaries that produce external paths: the backup bundle assembler, cloud-sync path reporting, and Google Drive destination preparation. Keep the application-level type union unchanged and use explicit mapping from `budget`/`invoice` to the Spanish labels.

Alternative considered: changing the internal document type values to Spanish. Rejected because those values are used by APIs, persistence, export state, and PDF rendering and are not user-facing folder names.

### Create new Drive folders rather than migrate old ones

Continue using `ensureFolder`, but request `Presupuestos` and `Facturas` as the folder names. This creates or reuses the new folders without requiring broad Drive permissions or risky historical file moves. Existing export-state file IDs remain usable; a subsequent update moves a referenced file into the new date hierarchy when that document is processed.

Alternative considered: search for and rename `Budgets` and `Invoices`. Rejected because the requested behavior applies from now on and historical folder ownership/content may be outside the application's control.

### Preserve the workbook schema

Keep `Clients`, `Budgets`, and `Invoices` as workbook tab names. The folder localization is a navigational concern for PDF files, not a change to the structured backup data contract.

Alternative considered: localizing tabs as well. Rejected because it expands the backup schema change without being requested.

### Validate paths at both bundle and cloud-sync boundaries

Update focused tests for ZIP bundle paths, cloud-sync reported paths, and Google Drive folder preparation. These tests verify that the two destinations stay aligned and that internal filename prefixes remain unchanged.

## Risks / Trade-offs

- [Risk] Existing English Drive folders remain visible beside new Spanish folders. -> Mitigation: document the forward-only behavior and avoid destructive migration.
- [Risk] A stored file reference may be moved from an old folder during a later sync. -> Mitigation: retain the existing in-place update behavior and verify the new parent folder is selected before upload.
- [Risk] Future code could introduce divergent folder labels again. -> Mitigation: centralize the mapping in the export path code and assert exact paths in focused tests.

## Migration Plan

1. Deploy the application with Spanish folder labels for future ZIP and Drive exports.
2. On the next Drive synchronization, create or reuse `Presupuestos` and `Facturas` under the configured root.
3. Leave existing `Budgets` and `Invoices` folders unchanged; no data migration or rollback operation is required.
4. If rolled back, future exports resume using the prior English labels; already-created Spanish folders remain untouched.

## Open Questions

None. The requested scope excludes historical folder migration and spreadsheet tab localization.
