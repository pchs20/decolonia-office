## Context

The application uses Next.js 15 (App Router), Tailwind CSS v4, and `@react-pdf/renderer` for PDF generation. Currently there is no centralized color system — colors are hardcoded as Tailwind class strings scattered across components. The navigation bar (`AppShell`) is a single horizontal flex row with no responsive breakpoints, overflowing on phone-sized viewports. The language toggle is three inline pill buttons taking ~80px of nav width. No icon library is installed.

Key files:
- `apps/web/src/presentation/components/AppShell.tsx` — main shell, needs full redesign
- `apps/web/src/presentation/components/LanguageToggle.tsx` — 3-button row → Globe dropdown
- `apps/web/src/presentation/components/SignOutButton.tsx` — text → icon
- `apps/web/src/presentation/components/pdf/BudgetDocument.tsx` — accent bar wrong color
- `apps/web/src/presentation/components/pdf/InvoiceDocument.tsx` — accent bar to align
- `apps/web/src/presentation/components/clients/ClientListPage.tsx` — wrong "New" button color
- `apps/web/src/presentation/components/settings/CommercialDocumentCatalogAndSettings.tsx` — wrong active tab color
- `apps/web/app/globals.css` — Tailwind v4 CSS entry point

## Goals / Non-Goals

**Goals:**
- Single source of truth for section colors (consumed by both Tailwind classes and `react-pdf` StyleSheet)
- Fully responsive nav: desktop top bar (icon + label), mobile minimal top bar + fixed bottom tab bar
- Replace language pill buttons with a compact Globe-icon dropdown
- Replace sign-out text with a LogOut red icon
- Fix all section color inconsistencies across list pages, settings tabs, and PDF accent bars

**Non-Goals:**
- Redesigning any page layout beyond the nav shell and color tokens
- Changing routing or authentication logic
- Dark mode
- Animations or transitions beyond what Tailwind provides out of the box

## Decisions

### D1: Single TypeScript color constants file as source of truth

`src/lib/brand-colors.ts` exports a `brandColors` object with hex values per section (budgets, invoices, clients, settings, danger). This is imported directly by `react-pdf` StyleSheets (which require raw hex strings) and its values are mirrored as Tailwind CSS custom properties in `globals.css`.

**Alternatives considered:**
- CSS-only custom properties: would not be importable by `react-pdf` (no DOM/CSS access in PDF rendering context)
- Tailwind config-only: Tailwind v4 CSS-first config works well for UI but again not available in the PDF renderer

### D2: Tailwind v4 `@theme` block for semantic tokens

`globals.css` declares an `@theme` block mapping semantic names (`--color-budgets`, `--color-invoices`, etc.) to the same hex values as `brand-colors.ts`. This allows components to use `bg-budgets`, `text-invoices`, etc. as utility classes without hardcoding color names that could diverge.

```css
@theme {
  --color-budgets:  #2563EB;
  --color-invoices: #16A34A;
  --color-clients:  #F59E0B;
  --color-settings: #475569;
  --color-danger:   #EF4444;
}
```

### D3: lucide-react for icons

`lucide-react` is the icon library. It is tree-shakeable, has first-class React/TypeScript support, pairs well with Tailwind, and is the de-facto standard for Tailwind-based projects (used by shadcn/ui). Icons used: `Home`, `Users`, `FilePen`, `ReceiptEuro`, `Settings`, `Globe`, `LogOut`, `ChevronDown`.

**Alternatives considered:**
- `heroicons/react`: also good but fewer icon variants; lucide is more actively maintained
- Actual Unicode emojis: not controllable in size or color, would not work in PDF context

### D4: Responsive nav — top bar on desktop, bottom tab bar on mobile

On `md` (≥768px): full top nav with icon + label per section, section color on active.
Below `md`: minimal top bar (brand name + language dropdown + sign-out icon) + fixed bottom `<nav>` with five icon-only tabs (Home, Clients, Budgets, Invoices, Settings).

The bottom tab bar uses `fixed bottom-0 left-0 right-0` with a safe-area-aware `pb-safe` or explicit padding. Main content gets `pb-20 md:pb-0` to avoid being obscured.

Active route detection uses `usePathname()` from `next/navigation` — match by prefix (e.g., `/budgets` matches `/budgets/123`).

**Alternatives considered:**
- Hamburger menu on mobile: common but requires an extra tap to access any section; bottom nav is more efficient for the 5 destinations this app has
- Collapsing top bar only (no bottom nav): icons-only top bar on mobile is feasible but bottom nav is the PWA standard and the app has a manifest

### D5: Language toggle as native `<select>` vs custom dropdown

Use a custom dropdown (`useState` + absolute-positioned list) styled with Tailwind rather than a native `<select>`. This allows consistent styling of the Globe icon trigger and the options list across browsers and the PWA install context.

The dropdown closes on outside click (via a `useEffect` with a `mousedown` listener) and on selection.

## Risks / Trade-offs

- **Safe area on iOS PWA** → The fixed bottom nav needs `padding-bottom: env(safe-area-inset-bottom)` to clear the iPhone home indicator. Mitigation: add `pb-[env(safe-area-inset-bottom)]` or equivalent to the bottom nav container. Verify on actual device or browser DevTools mobile simulation.
- **react-pdf color sync drift** → If brand colors evolve, `brand-colors.ts` must be updated and PDF stylesheets re-verified. The constants file mitigates divergence but requires discipline. Mitigation: the constants file is the explicit contract; any color change flows through there.
- **`ReceiptEuro` icon availability** → Verify the exact Lucide icon name is `ReceiptEuro` and is present in the installed version of `lucide-react`. If not available, fall back to `Receipt`.

## Migration Plan

1. Install `lucide-react`
2. Create `brand-colors.ts` and update `globals.css` `@theme` block
3. Update PDF components (`BudgetDocument`, `InvoiceDocument`) to use brand-colors constants
4. Fix color inconsistencies in `ClientListPage` and `CommercialDocumentCatalogAndSettings`
5. Rewrite `LanguageToggle` as Globe-icon dropdown
6. Rewrite `SignOutButton` as LogOut icon
7. Rewrite `AppShell` with responsive top nav + mobile bottom tab bar
8. Test on mobile viewport (DevTools 375px) and desktop

No database, API, or routing changes — rollback is a revert of the component files.
