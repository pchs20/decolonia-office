## 1. Database Migration

- [x] 1.1 Create migration: `ALTER TABLE workers ADD COLUMN is_primary BOOLEAN NOT NULL DEFAULT false`
- [x] 1.2 Create migration: `CREATE UNIQUE INDEX idx_workers_one_primary ON workers (is_primary) WHERE is_primary = true`

## 2. Domain & Application Layer

- [x] 2.1 Add `isPrimary: boolean` field to the `Worker` domain entity
- [x] 2.2 Update `WorkerRowMapper` to map `is_primary` column to/from the domain entity
- [x] 2.3 Add `setPrimary(id: string): Promise<Worker>` method to `WorkerRepository` interface (outbound port)
- [x] 2.4 Implement `setPrimary` in `PostgresWorkerRepository`: transactional unset-all then set-one
- [x] 2.5 Add `getByPrimary(): Promise<Worker | null>` method to `WorkerRepository` interface and implement in Postgres repository (query `WHERE is_primary = true AND is_active = true`)
- [x] 2.6 Add `setPrimary` and `getPrimary` use-cases to `WorkersService`

## 3. API Layer

- [x] 3.1 Update `WorkerSchema` and `WorkerResponse` types to include `isPrimary: boolean`
- [x] 3.2 Update `WorkerMapper` to include `isPrimary` in API responses
- [x] 3.3 Extend `PATCH /api/workers/:id` handler to accept and process `isPrimary: true`
- [x] 3.4 Add `GET /api/workers` support for `?primary=true` query param — returns the single primary worker or empty

## 4. Settings — Workers Tab

- [x] 4.1 Add `"workers"` as a 5th tab type in `CommercialDocumentCatalogAndSettings` state and tab bar
- [x] 4.2 Create `WorkerCatalogManager` component: renders the worker list with name, primary badge (★), and Edit / Delete / Set as primary actions
- [x] 4.3 Render `<WorkerCatalogManager />` when `activeTab === "workers"` in the settings panel
- [x] 4.4 Add `setPrimary` action in `useWorkers` hook (calls `PATCH /api/workers/:id` with `{ isPrimary: true }`)
- [x] 4.5 Add i18n keys for the new Workers tab label and "Set as primary" / "Primary" badge strings

## 5. Worker Routes — Move to Settings

- [x] 5.1 Create `app/(web-routes)/settings/workers/new/page.tsx` — reuses `WorkerForm` component
- [x] 5.2 Create `app/(web-routes)/settings/workers/[id]/edit/page.tsx` — reuses `WorkerForm` component
- [x] 5.3 Create `app/(web-routes)/settings/workers/[id]/page.tsx` — reuses `WorkerDetailPage` component
- [x] 5.4 Update back-links in `WorkerForm` and `WorkerDetailPage` to point to `/settings/catalog` (workers tab)
- [x] 5.5 Delete old route pages under `app/(web-routes)/workers/`

## 6. Navigation

- [x] 6.1 Remove the Workers `<Link>` from `AppShell.tsx` navigation bar

## 7. BudgetForm — Remove Worker Picker

- [x] 7.1 Remove `useWorkers` import and worker state from `BudgetForm`
- [x] 7.2 Add `useEffect` in `BudgetForm` to fetch the primary worker via `GET /api/workers?primary=true` on mount
- [x] 7.3 Store `primaryWorker` in local state; if `null`, render a blocking callout with a link to Settings and disable the submit button
- [x] 7.4 On successful primary worker fetch, auto-populate `workerSnapshot` state from the primary worker data (reuse existing `mapWorkerToSnapshot`)
- [x] 7.5 Remove the worker dropdown/selector JSX from `BudgetForm` render output

## 8. InvoiceForm — Remove Worker Picker

- [x] 8.1 Remove `useWorkers` import and worker state from `InvoiceForm`
- [x] 8.2 Add `useEffect` in `InvoiceForm` to fetch the primary worker via `GET /api/workers?primary=true` on mount
- [x] 8.3 Store `primaryWorker` in local state; if `null`, render a blocking callout with a link to Settings and disable the submit button
- [x] 8.4 On successful primary worker fetch, auto-populate `workerSnapshot` state from the primary worker data (reuse existing `mapWorkerToSnapshot`)
- [x] 8.5 Remove the worker dropdown/selector JSX from `InvoiceForm` render output

## 9. Tests & Validation

- [x] 9.1 Update `workers-service.crud.test.ts` to cover `setPrimary` and `getPrimary` use-cases
- [x] 9.2 Update `worker-validator.test.ts` to include `isPrimary` field validation
- [x] 9.3 Smoke-test: create a budget end-to-end with no worker picker — verify correct worker snapshot captured
- [x] 9.4 Smoke-test: verify blocking message shown when no primary worker is set
