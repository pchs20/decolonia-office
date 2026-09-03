## Context

Budgets and invoices are separate concrete aggregates backed by separate PostgreSQL tables. Each aggregate owns its document metadata and a collection of `job_items`; client, worker, and tax details are stored as historical snapshots. The current creation use cases allocate a fresh document number, create a parent record, and then the UI manages line items through separate requests.

Duplication must therefore create a new aggregate, not reuse a database row or line-item records. It must also use the existing sequence allocator: budgets use the global budget sequence, while invoices use the current year's invoice sequence. New invoices currently start with `issuedAt = null`, and new budgets start with `deliveredAt = null`.

The existing architecture requires HTTP handlers to call application use cases through outbound repository interfaces. PostgreSQL transactions belong in infrastructure adapters, while the application layer coordinates the duplication operation.

## Architecture Diagrams

The duplication flow crosses the browser, API adapter, application service, sequence allocator, and two persistence concerns. A lightweight flow is sufficient:

```text
User
  │ confirms Duplicate
  ▼
List/detail page
  │ POST /api/{budgets|invoices}/{id}/duplicate
  ▼
HTTP route adapter
  │ invoke application use case
  ▼
Duplicate commercial document use case
  │ load source + child items
  │ create fresh aggregate values
  ▼
Repositories / transaction boundary
  ├── allocate current document number
  ├── insert new budget or invoice
  ├── insert copied job items with new IDs
  └── commit or roll back all writes
  │
  ▼
New document response
  │ navigate to /{documents}/{newId}?edit=1
  ▼
Edit form
```

Assumptions:

- Authentication remains enforced by the existing middleware.
- The source document and its line items are accessible through the existing repositories.
- Number allocation remains server-authoritative; the browser never calculates or submits the new number.

## Goals / Non-Goals

**Goals:**

- Provide one consistent duplication capability for budgets and invoices.
- Preserve the source document's content and historical snapshots.
- Create fresh document and line-item identifiers.
- Reset lifecycle dates so the result starts as a new draft.
- Preserve `sourceBudgetId` for duplicated invoices.
- Make parent and child creation atomic from the user's perspective.
- Reuse existing numbering and API authentication conventions.
- Make the result immediately editable.

**Non-Goals:**

- Adding a general document versioning or audit-history model.
- Refreshing client, worker, or tax snapshots from current catalog records.
- Changing the existing invoice issue-date workflow.
- Adding a new invoice status model.
- Duplicating a budget into an invoice or an invoice into a budget.
- Adding offline number reservation or offline duplication.
- Adding a permanent UI relationship such as `duplicatedFromId`.

## Decisions

### One type-specific duplicate operation exposed through dedicated endpoints

Add a duplicate operation for each document type, following the existing route and service boundaries:

```text
POST /api/budgets/:id/duplicate
POST /api/invoices/:id/duplicate
```

The endpoints take no request body. The source ID is the only input, and the server determines all copied fields and allocates the new number. Type-specific endpoints fit the existing concrete-table inheritance and avoid introducing a polymorphic transport contract for a single feature.

An alternative would be to add a generic `/api/commercial-documents/:id/duplicate` endpoint. That would require resolving the document type before routing and would cut across the repository design, so it is not justified here.

### Duplicate through the existing document repositories

The application service should expose type-specific operations that delegate to the existing aggregate repositories:

1. `BudgetRepository.duplicate(id)` handles budget duplication.
2. `InvoiceRepository.duplicate(id)` handles invoice duplication and determines the current year internally.

Each concrete repository loads the source aggregate and its job items, allocates the appropriate number, constructs the new aggregate values, resets the lifecycle date, persists the parent and children atomically, and returns the new parent.

The application layer depends only on the existing outbound repository interfaces; concrete PostgreSQL implementations own the transaction. This keeps duplication as an aggregate persistence operation without adding a separate duplication repository.

The sequence allocation must participate in the same database transaction where practical. This prevents a successful number allocation from being followed by a committed partial duplicate. If the existing settings adapter cannot share a transaction client with document repositories without a broader refactor, the implementation must at minimum ensure that parent and child inserts are atomic and document the existing sequence-gap behavior.

### Copy values, not persistence identity or lifecycle state

Copy these values from the source:

- `clientId` and `workerId`
- client and worker snapshots
- tax snapshot
- notes
- pricing mode and manual subtotal
- all job-item content and positions
- invoice `sourceBudgetId`, including a null value

Reset these values:

- parent UUID
- human-readable document number
- every job-item UUID
- `createdAt` and `updatedAt`
- budget `deliveredAt`
- invoice `issuedAt`

Snapshots are copied exactly because they represent the information recorded on the source document, not a live view of catalog data. A duplicated invoice remains independent even when it points to the same source budget.

### User interaction is confirmation followed by edit mode

The action is added beside View and Edit in both list pages and beside Export/Edit on both detail pages. The UI asks for confirmation because the action consumes a document sequence number and creates a persistent record. On success it navigates to the new document with `?edit=1`; on failure it keeps the user on the source page and displays the translated error.

The server response should contain the created document, including its new ID and number. The client should not infer the destination from a stale list or repeat the creation request.

### No provenance field in the first version

The duplicate retains no `duplicatedFromId` field. The requirement is to create an independent document, and no current workflow needs to display or query its origin. Adding provenance would create migration, API, backup, and UI obligations. If traceability becomes important, it should be introduced as a separate domain decision.

## Risks / Trade-offs

- **[Partial aggregate]** A parent could be committed without all copied line items → perform parent and child writes in one server-side transaction and test rollback behavior.
- **[Sequence gaps]** A number may be consumed if allocation cannot share the later insert transaction → reuse the existing locked allocator and, if necessary, explicitly accept gaps as sequence behavior rather than reusing numbers.
- **[Accounting confusion]** A duplicated issued invoice could look issued → always clear `issuedAt` and open the result in edit mode.
- **[Stale snapshots]** The duplicate may contain an old address or tax rate → this is intentional and should be explained by the exact-copy semantics; current catalog values remain available through later editing.
- **[Duplicate source relationship]** Several invoices may point to one budget → preserve the link because it is currently optional and no one-to-one invariant exists.
- **[Repeated clicks]** A user may submit the action twice → disable the action while the request is pending; exact duplicate prevention is not required by the current scope.
- **[Offline use]** Number allocation is server-controlled → do not offer duplication while offline unless the existing sync model gains a safe number reservation mechanism.
- **[Transport drift]** New routes and messages can fall out of OpenAPI or translation contracts → update the source-controlled OpenAPI artifact, schemas, and both supported language translations together.

## Migration Plan

No database migration is required for the first version because duplication uses existing document and job-item columns and does not add provenance or status fields.

Deployment sequence:

1. Add application, API, persistence, client, UI, translation, OpenAPI, and test changes.
2. Deploy the server and web application together so the new buttons and endpoints are available at the same time.
3. Verify duplication for a budget with and without line items, and for invoices with and without `sourceBudgetId`.
4. Verify that the source remains unchanged and the new document has a fresh number and reset lifecycle date.

Rollback consists of deploying the previous application version. Any documents already created by the feature remain valid records; rollback removes access to the action but does not delete those records.

## Open Questions

- Should duplicate actions be available on client detail pages in this iteration, or only on budget/invoice list and detail pages? The current proposal scopes them to lists and document details.
- Should the application show a success toast after redirect, or is the newly opened edit page sufficient confirmation?
- Can the current PostgreSQL composition cleanly share one transaction client between sequence allocation and both concrete repositories, or should the implementation use a dedicated infrastructure duplication adapter?
