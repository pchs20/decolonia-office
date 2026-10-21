## 1. Header Layout

- [x] 1.1 Extend the shared PDF header to render worker, client, and document information as three horizontal columns.
- [x] 1.2 Render client phone and email conditionally, omitting missing optional values without empty labels or placeholders.
- [x] 1.3 Remove the standalone full-width client section from budget and invoice PDF documents.

## 2. Lower Summary Layout

- [x] 2.1 Add a shared lower summary composition with optional payment information on the left and totals on the right.
- [x] 2.2 Preserve totals values, labels, calculation order, and right alignment.
- [x] 2.3 Remove standalone payment spacing and borders that are no longer appropriate inside the summary row.
- [x] 2.4 Preserve budget disclaimer and invoice omission behavior.

## 3. Verification

- [x] 3.1 Update PDF component tests for the compact header and optional client contacts.
- [x] 3.2 Update PDF component tests for payment-left/totals-right ordering and absent bank-account behavior.
- [x] 3.3 Run focused PDF tests and the web package type check where possible; build skipped at user request. Focused PDF tests pass; the type check was attempted but terminated by the environment.
- [x] 3.4 Complete OpenSpec verification and resolve critical completeness or coherence findings.

## 4. Layout Refinements

- [x] 4.1 Remove the redundant client label from the compact header.
- [x] 4.2 Match worker and client name font sizes in the header.
- [x] 4.3 Top-align payment information with the Subtotal row and remove its trailing empty space.
- [x] 4.4 Add regression coverage for the refined header and payment alignment.
