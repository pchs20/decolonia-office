## 1. Domain and Application Use Cases

- [x] 1.1 Add repository-owned aggregate duplication operations to the existing budget and invoice repository contracts.
- [x] 1.2 Implement budget duplication orchestration with a fresh UUID, allocated budget number, copied document values, reset `deliveredAt`, and copied job items with fresh IDs.
- [x] 1.3 Implement invoice duplication orchestration with a fresh UUID, current-year invoice number, copied document values, preserved `sourceBudgetId`, reset `issuedAt`, and copied job items with fresh IDs.
- [x] 1.4 Add unit tests covering application delegation to repository-owned duplication operations.

## 2. Transactional PostgreSQL Persistence

- [x] 2.1 Add transactional persistence to the existing budget repository for duplicating a budget and all of its job items atomically.
- [x] 2.2 Add transactional persistence to the existing invoice repository for duplicating an invoice and all of its job items atomically.
- [x] 2.3 Ensure repository duplication uses the existing budget or current-year invoice sequence and does not allow the client to provide the new number.
- [x] 2.4 Add persistence tests for successful parent/child copies and rollback when a child insert fails.

## 3. API and Contracts

- [x] 3.1 Add authenticated `POST /api/budgets/{id}/duplicate` route handling with no request body and HTTP 201 response.
- [x] 3.2 Add authenticated `POST /api/invoices/{id}/duplicate` route handling with no request body and HTTP 201 response.
- [x] 3.3 Add API client methods for budget and invoice duplication and map server errors consistently with existing clients.
- [x] 3.4 Update API schemas and the source-controlled OpenAPI artifact for both duplication endpoints and response contracts.

## 4. User Interface and Localization

- [x] 4.1 Add localized Duplicate actions to budget and invoice list-row action groups.
- [x] 4.2 Add localized Duplicate actions to budget and invoice detail-page action groups.
- [x] 4.3 Add confirmation prompts, pending-state protection, translated success/error handling, and navigation to the new document in edit mode.
- [x] 4.4 Ensure list-row and action-button clicks do not trigger unintended row navigation.
- [x] 4.5 Add or update English and Spanish translation entries for duplicate labels, confirmations, errors, and feedback.

## 5. Verification

- [x] 5.1 Add API tests for successful responses, missing sources, and both document types.
- [x] 5.2 Assess UI test coverage; automated component tests are not applicable because the repository has no UI test harness, while the flows are covered by manual verification in task 5.4.
- [x] 5.3 Run the relevant unit, API, and UI test suites plus TypeScript checks.
- [x] 5.4 Manually verify budget and invoice duplication with and without line items, invoice source-budget links, previous-year invoices, and source-document independence.
