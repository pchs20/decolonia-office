## Context

The Google Drive sync feature currently runs in batches, processing budgets and invoices incrementally. Each batch returns a `CloudSyncBatchResult` containing counts: `processed`, `skipped`, `remaining`, and `failures` array. The UI aggregates these counts across batches and displays a simple summary: "X uploaded, Y skipped, Z failed."

Users lack visibility into which specific documents were synced or where files ended up in Google Drive. Only failures are captured with details; successful uploads are tracked only as a counter.

## Goals / Non-Goals

**Goals:**
- Display full Google Drive paths (Folder/Year/Quarter/filename.pdf) for uploaded documents
- Categorize results: Uploaded (list), Skipped (count), Failed (list with errors)
- Provide users with confidence in backup completeness and accuracy
- Enable users to verify file locations by checking Google Drive

**Non-Goals:**
- Add user-configurable folder structures or naming schemes
- Modify the batching strategy or sync algorithm
- Build a full sync history or audit trail
- Support filtering or searching uploaded documents

## Decisions

**1. Collect document paths during sync, not after**
- *Decision*: Modify `CloudSyncBatchResult` to include `uploadedDocuments` and `skippedDocuments` arrays containing path metadata
- *Rationale*: Paths are already computed during sync (year, period, filename are all available). Collecting them incrementally is cheaper than reconstructing them post-sync
- *Alternative considered*: Store paths in a database and query them after sync completes. Rejected: adds latency and complexity for immediate UI feedback

**2. Path format: Folder/Year/Quarter/Filename**
- *Decision*: Construct paths as `{folderType}/{year}/{period}/{filename}.pdf` (e.g., `Budgets/2026/Q3/presupuesto-005.pdf`)
- *Rationale*: Matches Google Drive folder hierarchy users see; users can manually verify by navigating Drive
- *No alternative*: This is the structure already being created

**3. Don't show skipped document details**
- *Decision*: Include `skippedCount` in summary but don't render individual skipped documents
- *Rationale*: Skipped files are unchanged from last sync—not actionable for users. Including count gives visibility into total documents processed without cluttering the UI
- *Alternative considered*: Show all skipped paths in a collapsible section. Rejected: adds UI state management, is rarely useful, and adds visual clutter

**4. Render as simple bullet lists**
- *Decision*: Use HTML `<ul>` / `<li>` elements for uploaded and failed lists, no tree or nested hierarchy
- *Rationale*: Simple, scannable, accessible, requires minimal code. Each path is independent—no hierarchy needed
- *Alternative considered*: Group by folder type or year to create a collapsible tree. Rejected: overcomplicates rendering and state management

**5. Extend CloudSyncBatchResult interface**
- *Decision*: Add `uploadedDocuments: { type: string; path: string }[]` and `skippedCount: number` to `CloudSyncBatchResult`
- *Rationale*: Keeps all sync result data in one place, maintains backward compatibility of the interface shape
- *No alternative*: This is the minimal extension to the existing structure

**6. Accumulate paths across batches in UI**
- *Decision*: The UI component aggregates `uploadedDocuments` arrays across batch responses (similar to how it already aggregates `processed` and `failures`)
- *Rationale*: Sync runs in batches; accumulating at UI level is already done for counts. Same pattern for paths
- *No alternative*: Alternative would be to return accumulated totals from the backend, but that's less efficient

## Risks / Trade-offs

**[Risk] Large syncs with many documents**
- Concern: If a user syncs 1000+ documents, the rendered list will be very long and potentially slow to render
- Mitigation: Start with simple lists; if performance becomes an issue, add pagination or a "show all" toggle later. For now, assume typical syncs are 10-50 documents

**[Risk] Path accuracy depends on sync logic**
- Concern: If the folder structure changes or date calculations are wrong, displayed paths won't match actual Drive structure
- Mitigation: This inherits the risk from the existing sync logic. No new risk introduced; same data that was used to create files is now displayed

**[Trade-off] No ability to re-verify old syncs**
- Trade-off: Paths are only shown after current sync completes; users can't query what was synced in previous runs
- Justification: This is acceptable for initial scope. Can add sync history later if needed

## Migration Plan

1. Modify `CloudSyncBatchResult` interface to include `uploadedDocuments` array
2. Update `synchronizeCloudBatch()` to collect document paths during processing
3. Update `/api/backup/cloud` endpoint to return new fields in batch response
4. Update `BackupExportPanel` component to:
   - Accumulate `uploadedDocuments` across batches
   - Render "Uploaded" and "Failed" sections with bullet lists
   - Remove old "X processed, Y skipped" message
5. Test end-to-end with real sync in dev environment

No database migrations needed. No API breaking changes (only additive fields).

## Open Questions

- Should we track which folder (Budgets vs Invoices) in the UI summary, or keep it generic?
- For very large syncs (1000+ docs), should we paginate or truncate the list?
