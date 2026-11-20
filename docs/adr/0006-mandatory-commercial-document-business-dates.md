# 0006. Make commercial document business dates mandatory

- Status: accepted
- Date: 2026-11-20
- Supersedes: none

## Context

Budgets have a delivered date and invoices have an issued date, but the fields were historically nullable. Existing documents therefore cannot distinguish an intentionally chosen business date from an unset value. The product now requires every document to have a business date, while existing null values need a deterministic migration.

## Decision

1. Backfill null budget `delivered_at` and invoice `issued_at` values from the corresponding row's `created_at` timestamp.
2. Enforce `NOT NULL` on both business-date columns after backfill.
3. Do not add a database default. Application creation paths must explicitly provide the business date; the UI defaults it to today's local calendar date.
4. Duplicates receive today's business date rather than inheriting the source document's date.
5. Import and restore flows normalize missing business dates from the imported record's creation date before persistence.
6. Domain entities, API contracts, and read-only/PDF consumers treat business dates as non-nullable.

## Rationale

The creation-date backfill is an explicit product decision for historical records, not a technical fallback. Enforcing the invariant at the database and application boundaries prevents null states and permanent compatibility branches from accumulating.

## Consequences

- Existing historical records will represent their creation timestamp as their business date; this is not semantically reversible without an external source of truth.
- All future application, duplication, import, and restore paths must provide a business date.
- Read-only views and PDFs no longer need a missing-date state or fallback branch.
- Database migrations must run before deploying code that relies on the non-null invariant.
