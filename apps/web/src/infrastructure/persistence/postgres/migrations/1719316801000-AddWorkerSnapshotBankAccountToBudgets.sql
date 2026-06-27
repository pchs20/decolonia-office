-- AddWorkerSnapshotBankAccountToBudgets migration
-- Adds bank account snapshot column to budgets for PDF payment information

ALTER TABLE budgets ADD COLUMN IF NOT EXISTS worker_snapshot_bank_account VARCHAR(50);
