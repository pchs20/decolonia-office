## Why

When editing a budget or invoice, users need to adjust the display order of job line items to reflect logical grouping or client-facing narrative. Currently there is no reorder mechanism — items are fixed in insertion order — forcing workarounds like deleting and re-adding items.

## What Changes

- Add **up/down reorder controls** to each job item row in the `JobItemsTable` when in editable mode, enabling adjacent-position swaps.
- Add a `reorderJobItem` use case that swaps the `position` values of two items within the same document.
- Expose a `PATCH /api/budgets/[id]/items/[itemId]` and `PATCH /api/invoices/[id]/items/[itemId]` endpoint variant (or a dedicated `POST …/reorder`) that updates item position.
- The `updateJobItemRecord` repository method currently does **not** update `position`; extend it or add a dedicated `swapPositions` query.

## Capabilities

### New Capabilities

- `job-item-reorder`: Allow users to move a job item up or down within the ordered list of a budget or invoice, persisting the new positions immediately.

### Modified Capabilities

- `budget-management`: The "Add job items to budget" requirement gains a reorder sub-behaviour (move item up/down, renumber remaining positions on display).
- `invoice-management`: Same reorder sub-behaviour mirrored for invoices.

## Impact

- **Domain**: `JobItem` value object unchanged; `position` field already exists.
- **Use cases**: New `reorderJobItem` use case (or `swapJobItemPositions`) in `job-item-use-cases.ts`.
- **Repository**: `JobItemRepository` interface gains a `swap` or `updatePosition` method; Postgres implementation updated accordingly.
- **API routes**: `PATCH /api/budgets/[id]/items/[itemId]` and `PATCH /api/invoices/[id]/items/[itemId]` need to accept `{ direction: "up" | "down" }` or a new sibling `POST .../reorder` route.
- **UI**: `JobItemsTable` gains up/down arrow buttons in editable mode; top item has no "move up", bottom item has no "move down".
- **No external dependencies added** (plain button controls; no drag-and-drop library required for MVP).
