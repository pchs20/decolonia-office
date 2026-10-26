## Why

Invoice creation currently fails at the database layer because the `invoices` INSERT statement has a different number of target columns and values. This blocks `POST /api/invoices` for every creation attempt and must be corrected before invoice creation can be used reliably.

## What Changes

- Correct the invoice repository INSERT column/value alignment.
- Bind `identifier_source` to the invoice identifier-source parameter.
- Add regression coverage for invoice persistence SQL and parameter binding.
- Do not change the database schema or public API contract.

## Capabilities

### New Capabilities

- `invoice-create-persistence`: Persist newly created invoices through the PostgreSQL repository without malformed INSERT statements.

### Modified Capabilities

## Impact

- Affected code: `apps/web/src/infrastructure/persistence/postgres/repositories/invoice-repository.ts`.
- Affected tests: PostgreSQL repository tests for commercial documents.
- The `POST /api/invoices` endpoint becomes functional; no endpoint shape, migration, dependency, or data-model change is required.
