## Context

Budget and invoice PDFs are rendered server-side with `@react-pdf/renderer`. The invoice template already renders `PaymentBlock` after `TotalsBlock` when `invoice.worker.bankAccount` is present. Budget data follows the same materialized worker snapshot path and `BudgetResponse.worker.bankAccount` is already available to the PDF template, but `BudgetDocument` currently stops after rendering totals.

The change must preserve the existing document layout, payment labels, conditional behavior, and data snapshot semantics. The budget form must also preserve `bankAccount` when serializing the worker snapshot; otherwise the PDF template cannot receive the value configured on the worker. It does not require a schema migration or a new API path.

## Architecture Diagrams

```text
BudgetRepository
      |
      | Budget.workerSnapshot.bankAccount
      v
mapBudgetToResponse
      |
      | BudgetResponse.worker.bankAccount
      v
BudgetDocument
      |
      +--> TotalsBlock
      |
      +--> PaymentBlock (only when bankAccount is present)
```

The budget and invoice templates will continue to share the same leaf component:

```text
BudgetDocument ------------------+
                                 |
InvoiceDocument -----------------+--> PaymentBlock
```

## Goals / Non-Goals

**Goals:**

- Render the existing invoice-style `PaymentBlock` at the end of budget PDFs.
- Use the budget's materialized `WorkerSnapshot.bankAccount` as the condition and value.
- Preserve `bankAccount` when the budget form serializes the worker snapshot on create or update.
- Preserve the existing payment labels and formatting used by invoice PDFs.
- Verify both the rendered payment case and the omitted-payment case.
- Keep the change limited to the PDF template, focused tests, and OpenSpec documentation.

**Non-Goals:**

- Changing payment terminology, labels, or visual styling.
- Adding payment methods beyond the existing bank transfer block.
- Changing worker profiles, snapshots, persistence, API schemas, or database migrations.
- Adding payment information to the interactive budget form or non-PDF budget views.
- Changing invoice PDF behavior.

## Decisions

### Reuse `PaymentBlock` rather than creating a budget-specific component

`PaymentBlock` already owns the exact invoice presentation required by the budget: payment method label, bank transfer label, and bank account number. `BudgetDocument` will import and render it after `TotalsBlock`, guarded by `budget.worker.bankAccount`, matching `InvoiceDocument`.

**Alternative considered:** Create a separate `BudgetPaymentBlock`. Rejected because it would duplicate presentation logic and could cause budget and invoice payment information to diverge.

### Use the materialized budget snapshot

The budget PDF will use `budget.worker.bankAccount`, which is sourced from the budget's existing `WorkerSnapshot`. This keeps the PDF historically consistent with the rest of the document and avoids looking up the worker profile at export time.

**Alternative considered:** Fetch the current worker profile while exporting. Rejected because it could show payment details that were not present when the budget was created and would introduce an unnecessary query path.

### Treat empty or missing bank accounts as absent

The conditional rendering will use the same truthiness check as the invoice template. A null or empty bank account will omit the block rather than produce an incomplete payment section.

**Alternative considered:** Render the block whenever the field is non-null, including an empty string. Rejected because the existing invoice behavior already treats empty values as absent and consistency is more important here.

### No ADR

This is a localized reuse of an existing component and established PDF behavior. It does not introduce a durable architectural decision, new dependency, or new persistence strategy.

## Risks / Trade-offs

- **Payment block may move the budget total layout or trigger a page break** -> Accept the same layout behavior already used by invoice PDFs and verify generated output through focused PDF tests.
- **Historical budgets may have no bank account snapshot** -> Omit the block for null snapshots, preserving existing document semantics and avoiding backfill.
- **Budget form serialization can discard payment data** -> Include the optional bank account in the worker snapshot payload for both create and update flows.
- **Tests may inspect only component structure rather than PDF content** -> Cover both conditional branches at the `BudgetDocument` or renderer level using the repository's existing PDF testing conventions.

## Migration Plan

1. Update the budget PDF template to conditionally render `PaymentBlock` after totals.
2. Add focused tests for a budget with a bank account and a budget without one.
3. Update the budget-and-invoices-export delta spec and mark implementation tasks complete as work lands.
4. Deploy as a backward-compatible application change; no database migration is required.

Rollback consists of reverting the template and test changes. Existing budget data remains valid in either version.

## Open Questions

None. The payment content and behavior are explicitly the same as the existing invoice PDF.
