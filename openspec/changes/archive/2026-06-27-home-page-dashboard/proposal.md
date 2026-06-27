## Why

The current home page (`/`) shows raw API health-check data — useful for development but meaningless to the actual user. When Decolonia's father opens the app, he needs to see his work at a glance and take the next action immediately, not stare at JSON connectivity results.

## What Changes

- Replace the current root `app/page.tsx` (connectivity-check page) with a real dashboard inside the `(web-routes)` route group, so it automatically gets the AppShell (top nav bar + i18n)
- Add a `/app-status` route to house the existing API/connectivity health-check UI (relocated, not deleted)
- Dashboard shows two large quick-action buttons: **New Budget** and **New Invoice**
- Dashboard shows the **5 most recent budgets** as tappable cards (number, client name, total amount, date)
- Dashboard shows the **5 most recent invoices** as tappable cards (number, client name, total amount, date)
- Cards are large with generous padding, designed for both iPad touch and desktop mouse use
- Each section has a "See all" link navigating to the full list
- i18n keys added for all new UI strings (ca / es / en)

## Capabilities

### New Capabilities

- `home-page-dashboard`: Landing page showing quick-action buttons and recent budgets/invoices for fast access to daily work

### Modified Capabilities

- `app-navigation-shell`: The root route (`/`) now resolves inside the `(web-routes)` group rather than as a standalone page outside the AppShell; the shell's nav bar now appears on the home page

## Impact

- `apps/web/app/page.tsx` — replaced (current content moved to `/app-status`)
- `apps/web/app/(web-routes)/page.tsx` — new file (the dashboard)
- `apps/web/app/(web-routes)/app-status/page.tsx` — new file (relocated connectivity check)
- `apps/web/src/presentation/components/AppShell.tsx` — add Home link to nav (optional, links to `/`)
- `apps/web/src/presentation/i18n/` — new translation keys for dashboard strings
- No API changes; uses existing `BudgetService.getAll` and `InvoiceService.getAll` with `limit=5`
