-- AddBankAccountToWorkers migration
-- Adds optional bank account field to worker profiles for invoice payment information

ALTER TABLE workers ADD COLUMN IF NOT EXISTS bank_account VARCHAR(50);
