## Why

The current navigation bar does not fit on mobile/tablet screens — all items render in a single horizontal row that overflows on small viewports — and there is no consistent color identity across sections. Budgets, invoices, clients, and settings each have ad-hoc colors that clash or repeat, and the PDF export accent bars are misaligned with the UI colors.

## What Changes

- Add `lucide-react` icon library (SVG icons used everywhere)
- Introduce a `brand-colors.ts` constants file as the single source of truth for all section colors, used by both UI components (via Tailwind CSS custom properties) and PDF exports (`react-pdf` StyleSheet)
- Redesign `AppShell` for responsiveness:
  - Desktop: top bar with icon + label per section, section color when active
  - Mobile: minimal top bar (brand name + language dropdown + sign-out icon) + fixed bottom tab bar with 5 icon-only tabs (Home, Clients, Budgets, Invoices, Settings)
- Rework `LanguageToggle` from 3 pill buttons to a Globe-icon dropdown
- Rework `SignOutButton` from text to `LogOut` icon (red)
- Align all section "New" buttons and interactive accents to their canonical section color:
  - Budgets → `blue-600` (already correct, no change)
  - Invoices → `green-600` (already correct, no change)
  - Clients → `amber-500` (currently incorrect `green-600`)
  - Settings tabs → `slate-600` (currently incorrect `blue-600`)
- Fix PDF accent bars: Budget PDF `#2E7D32` → budget blue `#2563EB`; Invoice PDF aligned to `#16A34A`
- Reduce excessive mobile padding across list pages

## Capabilities

### New Capabilities

- `brand-color-system`: Centralized section color tokens (`brand-colors.ts` + Tailwind CSS custom properties) providing a single source of truth for budgets (blue), invoices (green), clients (amber), settings (slate), and danger (red) colors — consumed by both UI components and PDF generation.

### Modified Capabilities

- `app-navigation-shell`: Nav shell gains responsive layout (desktop top nav with icon+label, mobile bottom tab bar with 5 icon-only tabs), language toggle becomes a Globe-icon dropdown, sign-out becomes a LogOut icon. Active-tab color identity per section is introduced.

## Impact

- **New dependency**: `lucide-react` (SVG icons, tree-shakeable)
- **New file**: `apps/web/src/lib/brand-colors.ts`
- **CSS**: `apps/web/app/globals.css` — new `@theme` block with semantic color tokens
- **Modified components**: `AppShell.tsx`, `LanguageToggle.tsx`, `SignOutButton.tsx`
- **Modified PDF**: `pdf/BudgetDocument.tsx`, `pdf/InvoiceDocument.tsx`
- **Minor color fixes**: `ClientListPage.tsx`, `CommercialDocumentCatalogAndSettings.tsx`
- No API, data schema, or routing changes
