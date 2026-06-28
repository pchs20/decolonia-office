## Context

The application is used by a single self-employed contractor who issues budgets and invoices. There is exactly one worker (the contractor), managed via a CRUD UI currently living in the main navigation bar alongside Clients, Budgets, and Invoices.

The worker picker in BudgetForm/InvoiceForm is a friction point: the user must manually select the only worker on every new document. The Workers tab in the nav is prominent real-estate for a concept that rarely changes.

In-force ADRs:
- **ADR-0001**: Monorepo stack (Next.js, Supabase/Postgres, Vercel)
- **ADR-0002**: Layer boundaries — domain entities, application use-cases, infrastructure repositories, presentation components stay separate; all transport contracts via validated API schemas
- **ADR-0003**: Commercial document design — snapshot semantics for party data; JobItem as child value object

This change is coherent with all three in-force ADRs. Snapshot semantics already govern how worker data is captured into documents; this change makes capture automatic.

## Goals / Non-Goals

**Goals:**
- One worker can be designated as "primary"; all new commercial documents auto-capture that worker's snapshot
- Workers CRUD moves to Settings (5th tab)
- Main nav drops the Workers link
- Budget/Invoice forms drop the worker picker
- DB enforces at most one primary worker at the database level
- Form creation is blocked (not silently broken) when no primary worker is configured

**Non-Goals:**
- Supporting multiple simultaneous active workers
- Role-based worker permissions
- Changing the snapshot data model (WorkerSnapshot shape is unchanged)
- Migrating historical documents' worker snapshots

## Decisions

### 1. `is_primary` boolean column on `workers` table (not an `app_settings` table)

The "primary worker" concept is a property of the Worker entity, not of application configuration. Storing it as `is_primary` on the `workers` row keeps the concept co-located with the data it describes.

**Enforcement**: A PostgreSQL partial unique index `WHERE is_primary = true` ensures at most one row can be primary at the DB level — no application-level uniqueness check needed.

**Atomic promotion**: The repository's `setPrimary(id)` operation runs in a transaction: `UPDATE workers SET is_primary = false` (all), then `UPDATE workers SET is_primary = true WHERE id = $1`.

**Alternative rejected**: `app_settings` key-value table. More flexible, but adds a new table and indirection for a concept that belongs on the entity. Overkill for this use case.

### 2. Workers CRUD routes move to `/settings/workers/*`

The existing WorkerListPage, WorkerForm, and WorkerDetailPage components are reused with minimal changes (back-links updated). New pages live at:
- `/settings/workers/new`
- `/settings/workers/:id/edit`
- `/settings/workers/:id`

The Settings page `/settings/catalog` gains a Workers tab. Clicking the tab renders an inline worker list (reusing `WorkerListPage` refactored as a component); create/edit navigate to dedicated sub-pages.

**Old routes** `/workers/*` are removed; no redirect needed (internal nav only).

### 3. Primary worker resolved at API layer, not in the form

`BudgetForm` and `InvoiceForm` call `GET /api/workers?primary=true` on mount. If the response is empty, the form renders a blocking callout and disables submit. If found, the snapshot fields are populated from the response and the worker section is hidden from the user entirely.

This keeps the form components thin — they don't need to know the "primary" concept beyond the API call result.

**Alternative rejected**: Resolving the primary worker server-side during `POST /api/budgets` (invisible to the form). Rejected because it removes the ability to give early feedback to the user before they fill in the whole form.

## Risks / Trade-offs

- **[Risk] Two workers simultaneously marked primary**: Mitigated by the DB partial unique index — the DB will reject the second `UPDATE` attempting to set `is_primary = true` if the transaction logic has a bug. → The partial unique index is the final safety net.
- **[Risk] No primary worker when opening a form**: Expected to never happen in practice, but the blocking callout handles it gracefully without a crash or silent failure.
- **[Trade-off] `is_primary` conflates "soft-delete active" with "primary designation"**: `is_active` handles soft-delete; `is_primary` handles designation. They are separate boolean columns with different semantics. A worker can be `is_active = true, is_primary = false` (exists but not primary). A soft-deleted worker (`is_active = false`) cannot be primary (the `setPrimary` operation respects `WHERE is_active = true`).

## Migration Plan

1. Add migration: `ALTER TABLE workers ADD COLUMN is_primary BOOLEAN NOT NULL DEFAULT false`
2. Add partial unique index: `CREATE UNIQUE INDEX idx_workers_one_primary ON workers (is_primary) WHERE is_primary = true`
3. Deploy API and UI changes (backward-compatible — existing documents are unaffected)
4. User sets their father's worker profile as primary in Settings

Rollback: drop the column and index; restore old nav link and form worker picker.

## Open Questions

None — design is fully resolved from the explore session.
