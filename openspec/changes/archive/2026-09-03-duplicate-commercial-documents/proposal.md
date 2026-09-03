## Why

Creating a new budget or invoice often involves repeating the same client, worker, tax, pricing, notes, and line-item information from a previous document. Users currently have to recreate that information manually, which is slow and increases the risk of transcription errors. This change adds a safe way to create a new independent commercial document from an existing one while preserving the existing numbering rules.

## What Changes

- Add a user-facing **Duplicate** action for budgets and invoices.
- Expose the action in budget and invoice list-row actions.
- Expose the action on budget and invoice detail pages.
- Ask for confirmation before creating a new numbered document.
- Create a new independent document with a new database identifier and newly allocated document number.
- Copy the source document's client and worker references, historical snapshots, tax snapshot, pricing configuration, notes, and all line items.
- Create independent line-item records with new identifiers rather than reusing the source items.
- Preserve an invoice's source-budget relationship when the source invoice has one.
- Clear `deliveredAt` on duplicated budgets and `issuedAt` on duplicated invoices so both begin as new drafts.
- Allocate budget numbers through the existing budget sequence and invoice numbers through the current year's invoice sequence.
- Open the newly created document in edit mode after successful duplication.
- Perform parent-document and line-item duplication as one server-side operation to avoid incomplete copies.

## Capabilities

### New Capabilities

- `duplicate-commercial-documents`: Create independent budgets and invoices from existing documents, including copied content, fresh identifiers and numbers, draft lifecycle state, confirmation, and post-creation navigation.

### Modified Capabilities

<!-- No existing OpenSpec capabilities are currently defined. -->

## Impact

- Budget and invoice application use cases and aggregate orchestration.
- Budget and invoice API routes, request/response contracts, and presentation API clients.
- PostgreSQL persistence for transactional creation of a document and its copied job items.
- Budget and invoice list and detail-page actions.
- Translations and user-facing confirmation, success, and error messages.
- Automated tests for number allocation, copied fields, reset lifecycle dates, independent line items, source-budget preservation, transaction failure behavior, and UI/API flows.
- No external dependencies are expected.
