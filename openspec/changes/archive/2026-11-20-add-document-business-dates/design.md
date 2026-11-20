## Context

Budgets and invoices already have `deliveredAt` and `issuedAt` fields, API PATCH support, PostgreSQL columns, and PDF rendering. The fields are currently nullable and existing records are empty. This change establishes a mandatory business-date invariant across presentation, transport, application, and persistence layers. ADR-0002's layer boundaries must be preserved.

The dates are business calendar dates, not event timestamps. The UI must default them from the user's local calendar date and avoid converting a date-only value through UTC in a way that changes the displayed day.

## Architecture Diagrams

```text
┌──────────────────────┐   date-only value   ┌──────────────────────┐
│ Budget / Invoice     │ ───────────────────▶ │ API create/update    │
│ forms                │                     │ adapters             │
│ - default today      │                     └──────────┬───────────┘
│ - edit date          │                                │
│ - Set today          │                                ▼
└──────────┬───────────┘                     ┌──────────────────────┐
           │                                 │ Application use case │
           │                                 │ - pass business date │
           │                                 └──────────┬───────────┘
           │                                            │
           │                                            ▼
           │                                 ┌──────────────────────┐
           └────────────────────────────────▶│ PostgreSQL repository│
                                             │ delivered_at /       │
                                             │ issued_at            │
                                             └──────────────────────┘
```

The read-only view reads both `createdAt` and the relevant business date. The home page continues to use `createdAt`; PDFs use the mandatory business date directly.

## Goals / Non-Goals

**Goals:**

- Make delivered and issued dates usable from both create and edit forms.
- Default new documents to today's local calendar date and provide a Set today action.
- Persist the selected date through the existing layered API and repository paths.
- Make the business date mandatory in domain, API responses, and persistence.
- Show creation and business dates separately in read-only views.
- Add localized labels, validation messages, and focused automated coverage.

**Non-Goals:**

- No database default; the migration backfills values and adds `NOT NULL` constraints.
- No nullable compatibility branch for old records, duplicates, or imports.
- No change to home-page date semantics.
- No PDF null fallback or `Not set` visualization state.
- No due-date, payment-date, timezone, or date-range feature.
- No new date/time dependency.
- The date-picker dependency is limited to the shared form control and does not alter API or database date representations.

## Decisions

### Use a local date-only form representation

The forms will hold the value in the native `YYYY-MM-DD` representation used by `input[type="date"]`. The default will be generated from local year, month, and day components rather than `toISOString().slice(0, 10)`, which can shift the date near timezone boundaries. API mapping will convert the selected value only at the transport boundary using the repository's existing date handling conventions.

**Alternative considered:** Store a JavaScript `Date` in form state. This is rejected because a business date has no time-of-day or timezone and would make off-by-one errors more likely.

### Use a shared localized date picker

Use `react-datepicker` with `date-fns` locale data for the budget and invoice forms. Configure `dateFormat` as `dd/MM/yyyy`, use the active application locale for labels, start weeks on Monday, and hide the library's clear action. The component will adapt the picker value to the existing date-only `YYYY-MM-DD` form state and retain the current UTC-midnight API serialization.

**Alternative considered:** Continue using the native `input[type="date"]`. This is rejected because its visible format is controlled by the browser and cannot reliably be forced to `DD/MM/YYYY`, even though its calendar interaction is useful.

### Reorder form controls for document workflow

The number and business-date controls will share the first metadata row. Client selection will occupy a separate row beneath it in both forms, preserving the existing client control while making the document metadata easier to scan.

### Extend create contracts instead of creating then patching

Add required business-date inputs to budget and invoice creation parameters, transport schemas, API payload handling, and repository inserts. Every caller, including duplication and import normalization, must provide a valid value. The application—not the database—owns the normal creation default of today.

**Alternative considered:** Create the document first and immediately PATCH its date. This is rejected because it creates an unnecessary intermediate state and can leave a newly created document without its business date if the second request fails.

### Enforce requiredness in the UI, not the database

Create and edit forms will validate that the relevant date is present and valid before submission. The migration removes existing nulls, and the API, domain, and database reject missing business dates thereafter. Import and duplication code must normalize or assign a value before persistence.

**Alternative considered:** Keep nullable columns and a UI-only requirement. This is rejected because it preserves divergent states and requires permanent fallback code.

### Show both dates in the read-only view

The shared commercial-document view will always render a creation-date row and the appropriate delivered/issued-date row. Since the invariant is enforced, no null rendering branch is needed.

**Alternative considered:** Show only an effective date. This is rejected because it hides the distinction between record lifecycle and business meaning.

### Reuse existing PDF and home-page semantics

No home-page semantic change is needed. The home page continues to display `createdAt`; PDFs use `deliveredAt` or `issuedAt` directly.

**Alternative considered:** Change the home page to business dates. This remains out of scope because its current role is recent system activity, not business-date reporting.

## Risks / Trade-offs

- [Risk] Date-only values could shift by one day when converted through UTC. → Keep form state date-only, construct local dates deliberately, and add tests around the serialized value and displayed date.
- [Risk] Historical creation dates may not reflect the true delivery or issue date. → Record the irreversible backfill policy in an ADR and use the explicit date fields for all future documents.
- [Risk] Budget and invoice implementations can drift because they use separate tables and repositories. → Apply the same contract, use-case, repository, and test changes to both document types, consistent with ADR-0003.
- [Risk] Direct API clients or imports may omit business dates. → Reject incomplete API creation requests and normalize legacy import records before persistence.

## Migration Plan

1. Apply a migration that backfills null business dates from `created_at` and then adds `NOT NULL` constraints, failing on missing source timestamps.
2. Make date fields required in domain, create payload types, application input parameters, repository inserts, and API responses.
3. Update budget and invoice forms to default, validate, edit, and submit date-only values.
4. Update duplication/import normalization and read-only visualization.
5. Add focused unit/component/API/repository/migration tests, then run the repository validation commands.
6. Rollback requires restoring the prior application version and reversing the migration only before any new mandatory-date data is relied upon; the backfill itself is not semantically reversible.

## Open Questions

- None for the agreed scope. ADR-0002's layer boundaries and ADR-0003's separate concrete budget/invoice tables remain applicable and do not need superseding decisions.
