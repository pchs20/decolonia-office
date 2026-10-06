## Why

Budget duplication currently fails at the database parser because the duplication query adds `identifier_source` to the `INSERT` target list without adding the corresponding `SELECT` expression. Invoice duplication contains the same regression and will fail for the same reason. This blocks a user-facing document action and leaves the intended custom-identifier behavior untested.

## What Changes

- Correct the budget duplication `INSERT ... SELECT` column alignment.
- Correct the equivalent invoice duplication query.
- Preserve each source document's `identifier_source` when duplicating it.
- Add repository regression coverage for both duplication paths.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `custom-document-identifiers`: Add the requirement that duplicated budgets and invoices preserve identifier-source metadata while receiving a new UUID and allocated identifier.

## Impact

- `apps/web/src/infrastructure/persistence/postgres/repositories/budget-repository.ts`
- `apps/web/src/infrastructure/persistence/postgres/repositories/invoice-repository.ts`
- Commercial-document duplication repository tests
- No schema, API contract, dependency, or migration changes
