## Context

Commercial-document duplication is implemented independently in the budget and invoice PostgreSQL repositories. Each repository allocates a new user-facing identifier, copies the source snapshot and line items, and returns the inserted row. The custom-identifier migration added `identifier_source` to both tables and to the duplication `INSERT` target lists, but the matching `SELECT` expressions were not updated.

The current failure is a SQL parse-time error, so no document is inserted and the transaction rolls back. The repositories already use the same ordered `INSERT ... SELECT` pattern for budgets and invoices, which makes a narrowly symmetrical correction preferable to introducing a shared abstraction.

## Architecture Diagrams

```text
Duplicate API request
        |
        v
Budget/Invoice repository
        |
        +--> allocate identifier
        +--> INSERT target columns
        |       ^ one-to-one correspondence
        +--> SELECT source values
        +--> copy JobItems
        +--> COMMIT
```

Assumption: duplication preserves `identifier_source` as document metadata while the duplicated document receives a new allocated identifier, consistent with the existing identifier-source model.

## Goals / Non-Goals

**Goals:**

- Make budget duplication succeed after the custom identifier migration.
- Make invoice duplication use the same correct column alignment.
- Preserve identifier-source metadata and existing transaction behavior.
- Add focused regression coverage for both repositories.

**Non-Goals:**

- No database schema or migration changes.
- No changes to identifier allocation rules.
- No changes to API routes, response shapes, or line-item duplication semantics.
- No shared repository abstraction or broader refactor.

## Decisions

- Add `identifier_source` to each duplication `SELECT` immediately after the new number expression, matching the target column order.
- Select the source row's `identifier_source` rather than hard-coding a value, so both automatic and custom source documents retain their metadata.
- Keep the budget and invoice statements separate because the tables have different document-specific columns and the existing repositories intentionally use concrete table implementations.
- Extend the existing duplication repository test suite with SQL assertions or mocked result coverage sufficient to detect omission or misordering of `identifier_source`.

Alternatives considered:

- Rewriting duplication as `INSERT ... SELECT` with an explicit source-column list generated from a shared helper: rejected as unnecessary scope for a two-expression regression.
- Omitting `identifier_source` from the target list and relying on the database default: rejected because it would silently lose custom-source metadata.

## Risks / Trade-offs

- [Risk] Future schema changes can again desynchronize long ordered column lists. -> Mitigation: keep the target and select lists adjacent, use focused duplication tests, and verify both document types together.
- [Risk] Existing mocked repository tests do not execute PostgreSQL parsing. -> Mitigation: assert the generated SQL contains the corrected expression ordering; run the focused test suite and, where available, connectivity-backed validation.

## Migration Plan

1. Update both repository duplication queries.
2. Add or update focused repository regression tests.
3. Run focused tests, type checks, build, and OpenSpec verification.
4. Deploy the application code; no database migration is required.

Rollback is a code revert. The database schema and persisted data are unchanged by this fix.

## Open Questions

None. Existing ADR-0005 establishes the identifier-source model and no architectural decision is being revisited.
