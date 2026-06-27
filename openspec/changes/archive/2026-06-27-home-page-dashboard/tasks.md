## 1. Routing Refactor

- [x] 1.1 Delete `apps/web/app/page.tsx` (the current connectivity health-check page)
- [x] 1.2 Create `apps/web/app/(web-routes)/app-status/page.tsx` with the connectivity health-check content moved from the deleted file

## 2. i18n Keys

- [x] 2.1 Add dashboard translation keys to `apps/web/src/presentation/i18n/locales/ca.json` (`dashboard.recentBudgets`, `dashboard.recentInvoices`, `dashboard.newBudget`, `dashboard.newInvoice`, `dashboard.seeAll`, `dashboard.emptyBudgets`, `dashboard.emptyInvoices`)
- [x] 2.2 Add the same keys to `apps/web/src/presentation/i18n/locales/es.json`
- [x] 2.3 Add the same keys to `apps/web/src/presentation/i18n/locales/en.json`

## 3. Dashboard Page

- [x] 3.1 Create `apps/web/app/(web-routes)/page.tsx` as a `"use client"` component that fetches the 5 most recent budgets and 5 most recent invoices using the existing `useBudgets` and `useInvoices` hooks
- [x] 3.2 Implement the two quick-action card buttons (New Budget → `/budgets/new`, New Invoice → `/invoices/new`) using `<Link>` with large tap-target styling
- [x] 3.3 Implement the Recent Budgets section: list of up to 5 tappable cards (number, client name, total amount, date) each linking to `/budgets/<id>`, with a "See all" link to `/budgets` and an empty-state message
- [x] 3.4 Implement the Recent Invoices section: list of up to 5 tappable cards (number, client name, total amount, date) each linking to `/invoices/<id>`, with a "See all" link to `/invoices` and an empty-state message
- [x] 3.5 Verify the page renders inside the AppShell with the top nav bar visible at `/`
