-- AddWorkerSnapshotBankAccountToInvoices migration
-- Adds bank account snapshot column to invoices for PDF payment information

ALTER TABLE invoices ADD COLUMN IF NOT EXISTS worker_snapshot_bank_account VARCHAR(50);
