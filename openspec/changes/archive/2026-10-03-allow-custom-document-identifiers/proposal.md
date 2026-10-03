## Why

Budgets and invoices currently allocate identifiers automatically, but users cannot enter or correct an identifier during creation or editing. The database also rejects duplicate identifiers, even though the internal document UUID already provides unique identity and users may need to reuse an external reference.

## What Changes

- Add optional manual identifier entry during budget and invoice creation.
- Allow editing a budget or invoice identifier after creation.
- Treat identifiers as validated user-facing text rather than strictly generated numbers.
- Warn when another document of the same type already uses the identifier, while allowing explicit confirmation to continue.
- **BREAKING** Remove the per-table database uniqueness constraints on budget and invoice identifiers.
- Keep automatic sequence allocation as the default flow and preserve existing settings behavior.
- Make exported PDF filenames collision-safe without changing the identifier displayed in PDFs or spreadsheets.

## Capabilities

### New Capabilities

- `custom-document-identifiers`: User-controlled budget and invoice identifiers, duplicate warnings, validation, and editing behavior.
- `collision-safe-document-exports`: Stable export filenames that remain unique when identifiers are duplicated or sanitize to the same filename.

### Modified Capabilities

- None.

## Impact

- Budget and invoice domain, application use cases, API schemas/routes, forms, and repository persistence.
- PostgreSQL migrations removing `UNIQUE` constraints from `budgets.number` and `invoices.number`.
- Duplicate lookup and warning responses for create/update operations.
- Local ZIP and Google Drive PDF export filename generation and related synchronization tests.
- Existing automatic numbering remains the default and should not change for users who do not edit the identifier.
