## 1. Budget PDF Template

- [x] 1.1 Update `BudgetDocument` to render the existing `PaymentBlock` after `TotalsBlock` when `budget.worker.bankAccount` is truthy.
- [x] 1.2 Confirm the budget template passes the existing PDF labels and bank-account value without changing invoice rendering or other budget sections.
- [x] 1.3 Preserve `bankAccount` in the budget form's worker snapshot payload for create and update flows.

## 2. Verification Coverage

- [x] 2.1 Add a focused test proving a budget PDF renders the payment block with the payment method, bank transfer label, and bank account number when configured.
- [x] 2.2 Add a focused test proving a budget PDF omits the payment block when the worker snapshot has no bank account.
- [x] 2.4 Add regression coverage for budget snapshot serialization preserving the bank account.
- [x] 2.3 Run the relevant PDF tests and standard project checks, recording any unrelated pre-existing failures accurately.

## 3. Specification Consistency

- [x] 3.1 Verify the implementation satisfies every modified `budget-and-invoices-export` scenario.
- [x] 3.2 Run OpenSpec verification for `add-budget-pdf-payment-block` and resolve any critical mismatch before completion.
