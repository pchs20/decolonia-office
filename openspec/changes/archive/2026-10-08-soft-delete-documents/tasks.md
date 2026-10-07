## 1. Database And Domain Contracts

- [x] 1.1 Add idempotent `is_active` columns with `NOT NULL DEFAULT true` to the budgets and invoices tables.
- [x] 1.2 Update Budget and Invoice domain types, row models, mappers, schemas, and repository contracts to carry active state where required.
- [ ] 1.3 Add persistence tests proving existing rows are active, inactive rows are omitted from active reads, and document deletion does not remove job items or export-state rows.

## 2. Soft-Delete Application And API Behavior

- [x] 2.1 Change budget and invoice delete repositories/use cases to mark records inactive instead of issuing hard deletes.
- [x] 2.2 Clear `source_budget_id` for invoices when a budget is soft-deleted, preserving the invoices and their snapshots.
- [x] 2.3 Add active-state filtering to budget and invoice get, list, search, duplicate, source-budget, item, and PDF retrieval paths, while keeping active documents visible for inactive clients.
- [x] 2.4 Verify client soft deletion remains unchanged and add or update API tests for client, budget, and invoice delete behavior and not-found responses for inactive records.

## 3. Backup And Google Drive Reconciliation

- [x] 3.1 Filter inactive clients, budgets, and invoices from local backup data-source queries and generated backup tables/PDF files.
- [x] 3.2 Extend the export-state repository to find tracked exports for inactive budgets and invoices, preserving failed deletion state for retries.
- [x] 3.3 Extend the cloud file port and Google Drive adapter to move a tracked file to Google Drive trash, handling already-missing files as completed where safe.
- [x] 3.4 Update cloud synchronization to remove inactive rows from the spreadsheet, trash their tracked PDFs, avoid regenerating them, and retry/report failed deletions.
- [ ] 3.5 Add focused tests for local export omission, spreadsheet reconciliation, successful Drive trashing, missing files, and retryable failures.

## 4. User Interface

- [x] 4.1 Add confirmed delete actions to budget and invoice list views using the established client-list interaction and refresh behavior.
- [x] 4.2 Add confirmed delete actions to client, budget, and invoice detail views, redirecting to the corresponding list after success.
- [x] 4.3 Add or update Catalan, Spanish, and English translations for delete labels, confirmations, loading states, and errors.
- [ ] 4.4 Add or update UI/component tests for canceling and confirming deletion from lists and detail pages.

## 5. Validation And Documentation

- [x] 5.1 Run focused tests for persistence, API/use cases, exports, Drive integration, and affected UI components.
- [x] 5.2 Run `pnpm test`, `pnpm check`, and `pnpm build`.
- [x] 5.3 Run OpenSpec verification and resolve any gaps between implementation, proposal, specifications, design, and tasks.
