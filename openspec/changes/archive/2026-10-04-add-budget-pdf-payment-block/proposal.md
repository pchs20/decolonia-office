## Why

Budget PDFs currently provide the commercial document details and totals but omit the payment information already shown on invoice PDFs. Adding the same payment block to budgets gives clients consistent payment instructions regardless of whether they receive an estimate or an invoice.

## What Changes

- Extend budget PDF output with the existing invoice-style payment block.
- Show the payment block when the budget's materialized `WorkerSnapshot.bankAccount` is present.
- Omit the payment block when no bank account is present.
- Add focused coverage for both configured and missing bank-account cases.
- Preserve the worker snapshot bank account when budgets are created or updated through the budget form.
- Update the budget and invoices export specification to document the new budget PDF behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `budget-and-invoices-export`: Require budget PDFs to include the optional payment block using the same behavior as invoice PDFs.

## Impact

- Affected PDF presentation: `BudgetDocument` will reuse the existing `PaymentBlock` component.
- Affected specifications and PDF rendering tests.
- No database schema, domain model, API contract, dependency, or worker form changes are expected because budget responses already carry the materialized bank account.
