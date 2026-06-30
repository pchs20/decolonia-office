## 1. Dependencies and Foundation

- [x] 1.1 Add `lucide-react` to `apps/web/package.json` and install via pnpm
- [x] 1.2 Create `apps/web/src/lib/brand-colors.ts` exporting `brandColors` with hex values for `budgets` (`#2563EB`), `invoices` (`#16A34A`), `clients` (`#F59E0B`), `settings` (`#7C3AED`), `danger` (`#EF4444`)
- [x] 1.3 Add `@theme` block to `apps/web/app/globals.css` declaring `--color-budgets`, `--color-invoices`, `--color-clients`, `--color-settings`, `--color-danger` CSS custom properties matching `brand-colors.ts`

## 2. PDF Color Fixes

- [x] 2.1 Update `BudgetDocument.tsx` accent bar `backgroundColor` from `#2E7D32` to `brandColors.budgets.DEFAULT` (`#2563EB`)
- [x] 2.2 Update `InvoiceDocument.tsx` accent bar `backgroundColor` from `#2E7D32` to `brandColors.invoices.DEFAULT` (`#16A34A`)

## 3. Component Color Fixes

- [x] 3.1 Update `ClientListPage.tsx` "New Client" button from `bg-green-600 hover:bg-green-700` to `bg-clients hover:bg-clients/90` (amber)
- [x] 3.2 Update `CommercialDocumentCatalogAndSettings.tsx` active tab classes from `border-blue-600 text-blue-600` to `border-settings text-settings` (slate) across all tab buttons

## 4. Language Toggle Redesign

- [x] 4.1 Rewrite `LanguageToggle.tsx`: replace 3 pill buttons with a `Globe` icon + current locale code trigger and a custom dropdown listing all supported locales
- [x] 4.2 Implement dropdown close-on-outside-click via `useEffect` mousedown listener
- [x] 4.3 Verify locale switching still works (updates i18next + writes `locale` cookie)

## 5. Sign-Out Button Redesign

- [x] 5.1 Rewrite `SignOutButton.tsx`: replace text button with a `LogOut` Lucide icon styled `text-red-500 hover:text-red-600`

## 6. AppShell Responsive Redesign

- [x] 6.1 Add `usePathname()` active-route detection helper inside `AppShell` (match by path prefix per section)
- [x] 6.2 Build desktop top nav: icon + label links for Home (`Home`), Clients (`Users`), Budgets (`FilePen`), Invoices (`ReceiptEuro`), Settings (`Settings`); active item uses section brand color via Tailwind custom property class
- [x] 6.3 Build mobile minimal top bar: brand name only + `<LanguageToggle>` + `<SignOutButton>` (hidden on `md` and above)
- [x] 6.4 Build mobile fixed bottom tab bar: five icon-only tabs (Home, Clients, Budgets, Invoices, Settings), active tab in section color, inactive in `text-slate-400`; add `safe-area-inset-bottom` padding
- [x] 6.5 Add `pb-20 md:pb-0` to the `<main>` content wrapper so bottom tab bar does not obscure content on mobile
- [x] 6.6 Verify `ReceiptEuro` icon exists in installed `lucide-react` version; fall back to `Receipt` if not

## 7. Verification

- [x] 7.1 Test nav at 375px viewport (DevTools): bottom tab bar visible, top bar minimal, no overflow
- [x] 7.2 Test nav at 768px+ viewport: top bar with icon + label, no bottom tab bar
- [x] 7.3 Confirm active-tab highlight for each section (navigate to `/budgets`, `/invoices`, `/clients`, `/settings/catalog`, `/`)
- [x] 7.4 Confirm language dropdown opens, switches locale, and closes on outside click
- [x] 7.5 Confirm sign-out icon triggers logout and redirects to `/login`
- [x] 7.6 Generate a budget PDF and verify accent bar is blue
- [x] 7.7 Generate an invoice PDF and verify accent bar is green
- [x] 7.8 Run `pnpm check` (TypeScript) and confirm no type errors
