## 1. Add Localized Disclaimer

- [x] 1.1 Add the budget coverage disclaimer label to the `pdf` namespace in the Spanish, Catalan, and English translation files, using the supplied Spanish wording and equivalent translations.
- [x] 1.2 Confirm the existing `PdfLabels` type exposes the new label consistently for all supported locales.

## 2. Render Budget Disclaimer

- [x] 2.1 Add a standalone informational disclaimer block to `BudgetDocument` after `TotalsBlock` and before the optional `PaymentBlock`.
- [x] 2.2 Style the disclaimer as non-priced document information and keep it in normal PDF document flow so it does not alter job-item or totals rendering.
- [x] 2.3 Keep `InvoiceDocument` unchanged so the disclaimer is budget-only.

## 3. Verify Rendering Behavior

- [x] 3.1 Extend focused budget PDF rendering tests to assert the Spanish disclaimer is present after totals and before payment details when a bank account exists.
- [x] 3.2 Add coverage that the disclaimer remains present when no bank account exists and the payment block remains omitted.
- [x] 3.3 Add coverage for Catalan and English disclaimer labels and verify invoice PDF rendering omits the disclaimer.
- [x] 3.4 Run the affected PDF tests and the repository checks required by `CONTRIBUTING.md` (`pnpm test`, `pnpm check`, and `pnpm build`).
