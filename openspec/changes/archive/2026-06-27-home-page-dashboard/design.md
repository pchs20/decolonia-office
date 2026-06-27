## Context

The current root route (`/`) is served by `app/page.tsx`, a standalone client component that renders connectivity health checks. It lives **outside** the `(web-routes)` route group and therefore has no AppShell, no nav bar, and no i18n. This is a developer artifact, not a user-facing page.

The existing `BudgetService.getAll` and `InvoiceService.getAll` already accept `page` and `limit` parameters and return typed list responses. No new API endpoints are needed.

## Goals / Non-Goals

**Goals:**
- Replace the root route with a real user-facing dashboard inside the AppShell
- Reuse existing service clients and hooks patterns for data fetching
- Make the page approachable and fast on iPad (touch) and desktop (mouse)
- Relocate connectivity health check to `/app-status` without deleting it

**Non-Goals:**
- Summary statistics / counts (deferred — the recent list is the summary)
- Status filtering or "pending" indicators on documents
- Any new API endpoints
- Offline-first dashboard data (out of scope for this change)

## Decisions

### Decision 1: Dashboard lives at `(web-routes)/page.tsx`, not `app/page.tsx`

Route groups in Next.js App Router don't affect URLs. `app/(web-routes)/page.tsx` serves at `/` and inherits the `(web-routes)/layout.tsx` (AppShell + i18n). The current `app/page.tsx` must be removed to avoid conflicting route resolution.

**Alternatives considered:**
- Keep `app/page.tsx` and duplicate the AppShell wrapper — rejected, creates layout duplication and breaks the single-layout contract established for `(web-routes)`.
- Use a middleware redirect — rejected, unnecessary indirection for a static route.

### Decision 2: Data fetching via direct service calls in a `"use client"` component

Follow the same pattern as `BudgetListPage` and `InvoiceListPage`: a `"use client"` component that calls `BudgetService.getAll(1, 5)` and `InvoiceService.getAll(1, 5)` in a `useEffect`. No new hooks are needed; the existing `useBudgets` and `useInvoices` hooks encapsulate the service calls.

**Alternatives considered:**
- Server Component with `fetch` — would require exposing the internal API URL server-side and complicates the architecture already established. Rejected.
- SWR/React Query — not in the project yet; adding a data-fetching library for this alone is over-engineering.

### Decision 3: Quick-action cards as `<Link>` wrappers (not buttons)

`/budgets/new` and `/invoices/new` are navigations, not form submissions. Using `<Link>` gives correct semantics, prefetching, and accessibility without JS event handlers.

### Decision 4: Connectivity check relocated to `(web-routes)/app-status/page.tsx`

Moving it inside `(web-routes)` gives it the AppShell, making it a real app route. It won't appear in the nav bar — it's a developer/ops page accessed by direct URL.

## Risks / Trade-offs

- **Two parallel fetches on load** — Budgets and invoices are fetched simultaneously via `Promise.all` or two independent `useEffect` calls. Minor extra load, but consistent with the rest of the app's pattern. → No mitigation needed.
- **Next.js route conflict if `app/page.tsx` is not deleted** — Build will fail with a conflicting page error. → The migration plan explicitly deletes it.

## Migration Plan

1. Delete `apps/web/app/page.tsx`
2. Create `apps/web/app/(web-routes)/page.tsx` — the new dashboard
3. Create `apps/web/app/(web-routes)/app-status/page.tsx` — relocated connectivity check (content from old `app/page.tsx`)
4. Add i18n keys for dashboard strings to all three locale files
5. No database migrations, no API changes
6. Rollback: restore `app/page.tsx` from git, delete the new files

## Open Questions

None outstanding.
