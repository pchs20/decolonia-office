## 1. Type Definitions

- [x] 1.1 Update `CloudSyncBatchResult` interface to include `uploadedDocuments: Array<{type: string; path: string}>` and `skippedCount: number`
- [x] 1.2 Update `SyncResult` interface in `BackupExportPanel.tsx` to match new `CloudSyncBatchResult` shape

## 2. Backend: Sync Use Case

- [x] 2.1 Modify `synchronizeCloudBatch()` to build document path strings during processing (format: `{folderType}/{year}/{quarter}/{filename}`)
- [x] 2.2 Collect successfully uploaded documents in an array during the document loop (before or after recordSuccess call)
- [x] 2.3 Return `uploadedDocuments` array and `skippedCount` in `CloudSyncBatchResult`

## 3. Backend: API Endpoint

- [x] 3.1 Verify `/api/backup/cloud` endpoint correctly returns `uploadedDocuments` and `skippedCount` fields from the use case
- [x] 3.2 Test API response shape with a manual sync request

## 4. Frontend: UI Component

- [x] 4.1 Update `BackupExportPanel.tsx` to accumulate `uploadedDocuments` across batches (similar to how `processed` is accumulated)
- [x] 4.2 Accumulate `skippedCount` across batches
- [x] 4.3 Remove or replace the old vague message "X processed, Y skipped, Z failed"
- [x] 4.4 Render new completion message format: "✅ Sync completed (N uploaded, M skipped, K failed)"
- [x] 4.5 Add "Uploaded" section with bullet-point list of document paths
- [x] 4.6 Keep existing "Failed" section (already rendering with details)
- [x] 4.7 Style lists for readability (ensure proper indentation, consistent bullet styling)

## 5. Testing

- [x] 5.1 Manual test: Sync documents and verify paths display correctly
- [x] 5.2 Verify paths match actual Google Drive folder structure by navigating Drive
- [x] 5.3 Test with batched sync (multiple batch requests) to verify aggregation works
- [x] 5.4 Test with some failed documents to ensure failures still display with error messages
- [x] 5.5 Test with no new uploads (all skipped) to verify counts display correctly
- [x] 5.6 Test on mobile/narrow viewport to ensure lists wrap and remain readable

## 6. Code Review

- [x] 6.1 Review type changes for backward compatibility
- [x] 6.2 Verify no performance regression from path collection during sync
- [x] 6.3 Check UI rendering for accessibility (list semantics, ARIA labels if needed)
