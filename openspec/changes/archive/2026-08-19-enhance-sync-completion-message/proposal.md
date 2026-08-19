## Why

Users currently see a vague sync completion message ("5 uploaded, 3 skipped") with no visibility into which specific documents were synced or where they ended up in Google Drive. This creates uncertainty about backup success and makes it difficult to verify that files are in the expected locations. Adding detailed file paths and categorized sync results (uploaded/skipped/failed) gives users confidence in their backups and enables quick verification.

## What Changes

- Sync completion message now displays the full Google Drive path for each uploaded document (e.g., `Budgets/2026/Q3/presupuesto-005.pdf`)
- Results are categorized into three sections: Uploaded (detailed list), Skipped (count only), Failed (detailed list with error messages)
- Summary header shows counts: "✅ Sync completed (8 uploaded, 2 skipped, 1 failed)"
- Rendered as bullet-point lists for easy scanning and verification

## Capabilities

### New Capabilities

### Modified Capabilities
- `cloud-sync-feedback`: The sync completion feedback now includes document paths and detailed categorization of results instead of generic counters

## Impact

- **Components**: `BackupExportPanel.tsx` — UI now renders detailed lists instead of simple counts
- **Use Cases**: `cloud-sync-use-case.ts` — Sync batching logic now collects document paths during processing
- **Types**: `CloudSyncBatchResult` interface extended to include arrays of uploaded and skipped documents
- **Data Flow**: No API changes; additional data collected and surfaced in existing response structure
- **User Experience**: Settings > Backup & Export page displays enhanced sync completion messages
