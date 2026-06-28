## Context

Job items within budgets and invoices are ordered by a `position: number` field stored in the `job_items` DB table. The table is queried `ORDER BY position ASC`. Currently, items are assigned sequential positions on creation (append-only). There is no mechanism to change the order after insertion.

The `JobItemsTable` React component renders an editable table with Edit and Delete action buttons per row. The `JobItem` value object, repository interface, and Postgres implementation are already in place — none of these need structural changes to their fields.

Relevant files:
- `src/domain/value-objects/job-item.ts` — `position: number` already present
- `src/application/use-cases/job-item-use-cases.ts` — `addJobItem`, `updateJobItem`, `removeJobItem`
- `src/application/outbound/job-item-repository.ts` — repository interface
- `src/infrastructure/persistence/postgres/repositories/job-item-repository.ts` — `updateJobItemRecord` does **not** currently update `position`
- `src/presentation/components/commercial-documents/JobItemsTable.tsx` — editable table UI
- API routes: `app/api/budgets/[id]/items/[itemId]/route.ts` and `app/api/invoices/[id]/items/[itemId]/route.ts`

## Goals / Non-Goals

**Goals:**
- Allow users to move any job item one step up or down relative to its neighbours while editing a budget or invoice.
- Persist the new order immediately (optimistic UI is acceptable).
- Keep the implementation inside the existing stack with no new external libraries.

**Non-Goals:**
- Drag-and-drop reordering (deferred; can be layered on top later).
- Bulk/arbitrary reorder (e.g., move item 2 directly to position 5 in one action).
- Reorder on the PDF view or read-only view.
- Reorder during invoice creation from a budget.

## Decisions

### 1. Interaction model: Up/Down arrow buttons (not drag-and-drop)

**Decision**: Add "move up ↑" and "move down ↓" icon buttons to each editable row. The top item's "up" button is disabled; the bottom item's "down" button is disabled.

**Alternatives considered**:
- *Drag-and-drop* (`@dnd-kit` or HTML5 drag API): Better UX for long lists, but adds a library dependency and significant complexity for a list that rarely exceeds 10–15 items. Deferred.
- *Numeric position input*: Allows arbitrary repositioning but is unintuitive and error-prone.

**Rationale**: Arrow buttons are accessible, require zero new dependencies, and are immediately understandable for lists of typical size.

### 2. API action: `PATCH .../items/[itemId]` with `{ direction: "up" | "down" }`

**Decision**: Extend the existing `PATCH /api/budgets/[id]/items/[itemId]` (and invoices counterpart) to accept a `direction` body field. The server resolves both the target item and its neighbour, then swaps their positions in a single transaction.

**Alternatives considered**:
- *Dedicated `/reorder` sub-route*: Cleaner semantically but adds route files for a simple action. Not justified here.
- *Send target position from client*: Race-prone if two users edit simultaneously; server-resolved swap is safer.
- *Full position array in request* (`{ positions: ["id1","id2","id3"] }`): Future-proof for drag-and-drop but over-engineered for MVP.

**Rationale**: Minimal surface change; the server owns the swap logic atomically.

### 3. Persistence: Swap positions of two adjacent items in one UPDATE pair

**Decision**: Add a `swapJobItemPositions(itemId: string, direction: "up" | "down", documentId: string): Promise<void>` method to `JobItemRepository`. The Postgres implementation fetches both items by document, finds the neighbour, and updates both `position` values in two sequential UPDATE statements inside a transaction (or two separate updates wrapped in BEGIN/COMMIT).

**Rationale**: Position values are integers. Swapping two values is safe, cheap, and leaves no gaps. No renumbering of other rows is needed.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| Concurrent edits cause position conflicts | Acceptable for single-user context; positions are corrected on next full load. Add optimistic locking later if needed. |
| `position` gaps accumulate over time (delete + reorder) | Display uses sorted order, not raw position value. Renumbering only needed for PDF display (already handled by index). |
| Disabled state not visible enough | Use `disabled` attribute + reduced opacity styling; no custom CSS needed. |

## Migration Plan

No schema changes. No data migration. The `position` column already exists. Feature is purely additive.

Rollback: remove the UI buttons and the direction-handling branch from the PATCH handler. No DB cleanup needed.

## Open Questions

None. This is a self-contained additive change with no ADR required (not hard to reverse, not surprising without context, not a contested trade-off at architectural level).
