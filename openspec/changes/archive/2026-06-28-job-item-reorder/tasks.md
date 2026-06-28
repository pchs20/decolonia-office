## 1. Repository Layer

- [x] 1.1 Update `JobItemRepository.update(jobItem)` in `src/infrastructure/persistence/postgres/repositories/job-item-repository.ts` to intelligently preserve fields: fetch current item first, use provided `commercialDocumentId` or fall back to current, use provided `position` if > 0 or fall back to current
- [x] 1.2 Removed: `swapJobItemPositions` method (simplified to direct position field updates)

## 2. Use Case Layer

- [x] 2.1 Update `updateJobItem` in `src/application/use-cases/job-item-use-cases.ts` to accept optional `position?: number` parameter
- [x] 2.2 Simplified: Pass position as-is (0 if not provided); repository handles preservation logic
- [x] 2.3 Removed: `reorderJobItem` function (replaced by position parameter in updateJobItem)
- [x] 2.4 Tests: Updated to 3 core tests (addJobItem, updateJobItem, removeJobItem); removed old reorder test cases

## 3. API Routes

- [x] 3.1 Updated `PATCH /api/budgets/[id]/items/[itemId]/route.ts` to extract `position?: number` from payload and validate it
- [x] 3.2 Updated `PATCH /api/invoices/[id]/items/[itemId]/route.ts` with same position-handling logic
- [x] 3.3 Updated `JobItemUpdateRequest` schema to include `position?: number` field
- [x] 3.4 Removed: Direction-based logic; now uses direct position values

## 4. UI — JobItemsTable

- [x] 4.1 Added `onMoveUp?: (id: string) => Promise<void>` and `onMoveDown?: (id: string) => Promise<void>` props to `JobItemsTableProps`
- [x] 4.2 Render "↑" and "↓" icon buttons in the actions column when `editable` is true; disable "↑" for first item and "↓" for last item
- [x] 4.3 Wire up button clicks to call prop handlers with item `id`, showing loading state (mirror delete pattern)

## 5. Budget Edit Form Integration

- [x] 5.1 Updated `BudgetForm.tsx` with handlers: `handleDraftItemMoveUp`, `handleDraftItemMoveDown` that swap items in state and renumber positions
- [x] 5.2 On save, detect position changes in `positionChanges` filter: compare current position vs original position
- [x] 5.3 For each item with position change, call `updateItem` with `position: item.position` directly (not direction-based)
- [x] 5.4 Pass `onMoveUp` and `onMoveDown` handlers to `<JobItemsTable>`

## 6. Invoice Edit Form Integration

- [x] 6.1 Updated `InvoiceForm.tsx` with identical handlers and save logic to BudgetForm
- [x] 6.2 Pass `onMoveUp` and `onMoveDown` handlers to `<JobItemsTable>`

## 7. Tech Debt Cleanup

- [x] 7.1 Removed: `swapJobItemPositions` from `JobItemRepository` interface
- [x] 7.2 Removed: `swapJobItemPositionsRecord` from Postgres implementation
- [x] 7.3 Removed: `reorderJobItem` from use cases
- [x] 7.4 Removed: `reorderBudgetItem` and `reorderInvoiceItem` from commercial-documents-service
- [x] 7.5 Removed: `JobItemReorderRequest` schema
- [x] 7.6 Removed: `reorderItem` methods from BudgetService and InvoiceService
- [x] 7.7 Removed: All direction-based tests and methods

