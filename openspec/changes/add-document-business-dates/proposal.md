## Why

Budgets and invoices currently store delivered and issued dates, but users cannot set them through the document forms. As a result, PDFs fall back to creation dates and the application cannot reliably represent the business date of a document. The existing API and data model already support these values, so exposing them in the UI completes the workflow without introducing a new date model.

## What Changes

- Default a new budget's delivered date and a new invoice's issued date to the user's current calendar date.
- Add editable, required date fields to budget and invoice forms.
- Backfill existing null business dates from the document creation timestamp and make the persisted fields mandatory.
- Add a “Set today” action that resets the relevant date to today; the UI will not offer a clear action.
- Extend document creation requests so the selected business dates are persisted at creation time.
- Require every application creation path, including duplication and import normalization, to provide a business date; no nullable compatibility path remains.
- Display both the system creation date and the relevant business date in read-only budget and invoice views.
- Always display both the creation date and the stored delivered/issued date; there is no “Not set” state after migration.
- Preserve the home page's use of creation dates.
- Render PDFs from the mandatory delivered/issued date without a null fallback.

## Capabilities

### New Capabilities

- `document-business-dates`: Set, edit, persist, and display budget delivery dates and invoice issue dates independently from document creation timestamps.

### Modified Capabilities

<!-- No existing OpenSpec capabilities are present in openspec/specs/. -->

## Impact

- Budget and invoice create/edit forms and read-only document views.
- Budget and invoice creation API schemas, application use cases, and PostgreSQL repositories.
- Date formatting and localization strings for business-date labels and validation messages.
- Automated tests for creation defaults, editing, persistence, migration, mandatory fields, duplication, import normalization, and visualization.
- Add a database migration that backfills existing values and enforces `NOT NULL`; no database default is introduced.
