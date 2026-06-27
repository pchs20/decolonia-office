## 1. Database Migrations

- [x] 1.1 Add `bank_account` nullable varchar column to `profiles` table
- [x] 1.2 Add `worker_snapshot_bank_account` nullable varchar column to `budgets` table
- [x] 1.3 Add `worker_snapshot_bank_account` nullable varchar column to `invoices` table

## 2. Domain Layer

- [x] 2.1 Add `bankAccount: string | null` to `WorkerSnapshot` interface
- [x] 2.2 Add `bankAccount: string | null` to `Profile` entity (and `Worker` entity if it has its own field)

## 3. Infrastructure Layer

- [x] 3.1 Update `WorkerRepository` to read and write `bankAccount` from/to `profiles.bank_account`
- [x] 3.2 Update `WorkerSnapshot` materialization in `BudgetRepository` to include `bankAccount` from worker profile
- [x] 3.3 Update `WorkerSnapshot` materialization in `InvoiceRepository` to include `bankAccount` from worker profile
- [x] 3.4 Update `BudgetRepository` INSERT/SELECT to persist and hydrate `worker_snapshot_bank_account`
- [x] 3.5 Update `InvoiceRepository` INSERT/SELECT to persist and hydrate `worker_snapshot_bank_account`

## 4. API Transport Layer

- [x] 4.1 Add `bankAccount: string | null` to `WorkerSnapshotSchema` (Zod schema)
- [x] 4.2 Add `bankAccount?: string` to `CreateWorkerRequest` / `UpdateWorkerRequest` schemas
- [x] 4.3 Update `WorkerResponse` schema to include `bankAccount`
- [x] 4.4 Update `budget-mapper` to map `workerSnapshot.bankAccount` into the response
- [x] 4.5 Update `invoice-mapper` to map `workerSnapshot.bankAccount` into the response
- [x] 4.6 Update worker API handler (`POST /api/workers`, `PATCH /api/workers/[id]`) to accept and pass through `bankAccount`

## 5. PDF Templates

- [x] 5.1 Add `@react-pdf/renderer` dependency to `apps/web/package.json`
- [x] 5.2 Create `IssuerBlock` shared component (name, taxId, phone, email, address)
- [x] 5.3 Create `ClientBlock` shared component (name, taxId, address)
- [x] 5.4 Create `JobItemsTable` shared component (title, description, quantity?, unitPrice?, totalPrice columns)
- [x] 5.5 Create `TotalsBlock` shared component (subtotal, tax line, total)
- [x] 5.6 Create `PaymentBlock` invoice-only component (bank account number)
- [x] 5.7 Create `BudgetDocument` template combining `IssuerBlock`, document header (number, date), `ClientBlock`, `JobItemsTable`, `TotalsBlock`
- [x] 5.8 Create `InvoiceDocument` template combining `IssuerBlock`, two-column header (issuer + client with document metadata), `JobItemsTable`, `TotalsBlock`, `PaymentBlock`

## 6. PDF API Endpoints

- [x] 6.1 Create `GET /api/budgets/[id]/pdf` route that fetches budget + items, renders `BudgetDocument`, returns binary PDF with correct headers
- [x] 6.2 Create `GET /api/invoices/[id]/pdf` route that fetches invoice + items, renders `InvoiceDocument`, returns binary PDF with correct headers
- [x] 6.3 Return 404 when document id does not exist in both PDF endpoints

## 7. Settings — Worker Profile Form

- [x] 7.1 Add bank account text input field to the worker create form
- [x] 7.2 Add bank account text input field to the worker edit form
- [x] 7.3 Ensure bank account value is included in the form submission payload

## 8. Budget Detail UI

- [x] 8.1 Add "Export PDF" button to the budget detail page header (view mode only)
- [x] 8.2 Implement click handler: fetch `GET /api/budgets/[id]/pdf` and trigger browser download with correct filename

## 9. Invoice Detail UI

- [x] 9.1 Add "Export PDF" button to the invoice detail page header (view mode only)
- [x] 9.2 Implement click handler: fetch `GET /api/invoices/[id]/pdf` and trigger browser download with correct filename

## 10. Verification

- [x] 10.1 Generate a budget PDF and verify: issuer block, client block, job items table, totals, no notes field
- [x] 10.2 Generate an invoice PDF with bank account set and verify: all blocks including payment block
- [x] 10.3 Generate an invoice PDF with no bank account and verify: payment block is absent
- [x] 10.4 Verify Spanish characters (accented letters) render correctly in the PDF
- [x] 10.5 Verify bank account field saves, loads, and materializes into snapshot correctly
