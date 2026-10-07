## Context

Clients already use an `is_active` soft-delete flag. Budgets and invoices currently have hard-delete repository methods, while their related `job_items` and `document_export_states` rows are not protected by foreign keys. Local backup queries currently export every row, and Google Drive synchronization only processes records returned by those queries, so removing inactive records from the source queries alone would leave previously uploaded PDFs in Drive.

The change must preserve historical documents, keep documents readable when their client is archived, and avoid physically deleting aggregate children or export metadata. The design follows the existing layered architecture and concrete budget/invoice tables described by ADR-0003.

## Architecture Diagrams

### Active record and export flow

```text
User
  |
  v
Next.js API/UI
  |
  +--> Client/Budget/Invoice use cases
  |       |
  |       +--> PostgreSQL repositories -- is_active = true for active reads
  |       |
  |       +--> soft-delete mutation
  |              - mark record inactive
  |              - clear invoice source_budget_id when needed
  |
  +--> Backup/export use cases
          |
          +--> active rows --> local archive / Drive spreadsheet
          |
          +--> prior export states for inactive documents
                  |
                  +--> Drive file port --> move PDF to trash
```

Assumption: the existing export-state table is the source of truth for locating PDFs previously uploaded by this application. The Drive spreadsheet is rebuilt from active source rows and does not need per-row deletion calls.

## Goals / Non-Goals

**Goals:**

- Make client, budget, and invoice removal non-destructive and consistent.
- Ensure inactive records do not participate in active application workflows or local exports.
- Remove inactive records from the next Drive spreadsheet synchronization.
- Trash previously exported inactive budget/invoice PDFs on the next Drive sync.
- Preserve active documents and their snapshots when their client is inactive.
- Expose delete actions in list and detail views with simple confirmation.

**Non-Goals:**

- Restore or undelete workflows.
- Permanent database deletion or cleanup of inactive rows, job items, or export states.
- Hiding historical budgets or invoices because their client is inactive.
- Automatically trashing files from Drive outside a synchronization run.
- Changing authorization rules beyond the existing authenticated API behavior.

## Decisions

### 1. Use `is_active` for budgets and invoices

Add a non-null boolean `is_active` with a default of `true` to both tables. Repository get/list queries will filter inactive rows. Delete methods will become update operations. This matches clients and avoids introducing a second deletion state or a polymorphic parent table.

Alternative considered: add `deleted_at`. A timestamp would improve auditability, but the existing client contract and domain model already use `is_active`; consistency is more valuable for this focused change.

### 2. Preserve aggregate children and export state

Soft-deleting a budget or invoice will not remove `job_items` or `document_export_states`. Job items are part of the commercial-document aggregate, and export state is needed to locate a Drive file for deletion and retry failures. The rows become unreachable through active document workflows but remain available for historical cleanup or future restore support.

Alternative considered: mark child rows inactive or delete them. That would duplicate parent lifecycle state and make future restoration harder without solving the Drive reconciliation problem.

### 3. Clear budget provenance when archiving a budget

When a budget becomes inactive, update active and inactive invoices that reference it so `source_budget_id` is `NULL`. Invoices remain intact and no longer point at an unavailable source budget. This avoids foreign-key conflicts and prevents the UI from offering a dead source link.

Alternative considered: keep the reference and allow a historical budget lookup. That conflicts with the requirement that inactive budgets are unavailable to active reads and would require a separate inactive-document read model.

### 4. Reconcile Drive deletions from export state

Extend the file port with a trash/delete operation and the export-state repository with a query for exported documents that are no longer active. During sync, process inactive document states before or alongside active uploads. If a tracked external reference exists, move it to Drive trash; on failure, record the error and retain the state for a later retry. Once deletion succeeds, clear the external reference or remove the state so it is not retried indefinitely.

Alternative considered: leave PDFs in Drive after removing source rows. That creates stale customer/accounting files and violates the confirmed behavior.

### 5. Keep active documents visible for inactive clients

Budget and invoice queries will filter their own `is_active` state, not the client’s `is_active` state. Existing document snapshots make these records self-contained for historical use and export. Client lists exclude inactive clients, but document lists and detail pages remain available through their document IDs and document filters.

### 6. Share the delete interaction pattern

Use the existing client list confirmation behavior for all three lists and add equivalent controls to client, budget, and invoice detail pages. Confirmed detail deletion redirects to the entity list. No new modal abstraction is required unless existing components make reuse straightforward.

## Risks / Trade-offs

- [Risk] Existing databases lack `is_active` on budgets/invoices. → Add an idempotent migration with a default and backfill all existing rows as active.
- [Risk] A Drive file may already be missing or inaccessible when reconciliation runs. → Treat a confirmed not-found/trash state as complete where the adapter can distinguish it; record other failures for retry.
- [Risk] Export-state records can outlive their document indefinitely. → Preserve them in this change for retryability and future restore; avoid a destructive cleanup policy.
- [Risk] A sync may process many inactive documents in addition to active uploads. → Use bounded batches and report deletion failures through the existing sync result structure.
- [Risk] A soft-deleted document URL may be opened from an old bookmark. → Active get/PDF routes return the existing not-found response, consistent with archived clients.
- [Risk] Existing tests may assume hard-delete repository calls. → Update contracts and tests to assert inactive updates and relationship clearing.

## Migration Plan

1. Add `is_active BOOLEAN NOT NULL DEFAULT true` to `budgets` and `invoices`.
2. Deploy application code that reads the new flag, performs soft deletion, and supports Drive reconciliation.
3. Existing rows remain active; no data migration beyond the column default is required.
4. Run focused persistence, API, UI, local export, and Drive adapter tests, then the repository standard checks.

Rollback of application code is safe after the migration because older code ignores the added columns, but old hard-delete endpoints must not be re-enabled as the intended behavior. Database rollback is not planned because repository migrations are forward-only and inactive state is expected to persist.

## Open Questions

None for the confirmed scope. Restore and inactive-record retention/cleanup can be addressed by a future change.
