ALTER TABLE budgets
  DROP CONSTRAINT IF EXISTS budgets_number_key,
  ADD COLUMN IF NOT EXISTS identifier_source VARCHAR(20) NOT NULL DEFAULT 'automatic';

ALTER TABLE budgets
  DROP CONSTRAINT IF EXISTS chk_budgets_identifier_source;

ALTER TABLE budgets
  ADD CONSTRAINT chk_budgets_identifier_source CHECK (identifier_source IN ('automatic', 'custom'));

ALTER TABLE invoices
  DROP CONSTRAINT IF EXISTS invoices_number_key,
  ADD COLUMN IF NOT EXISTS identifier_source VARCHAR(20) NOT NULL DEFAULT 'automatic';

ALTER TABLE invoices
  DROP CONSTRAINT IF EXISTS chk_invoices_identifier_source;

ALTER TABLE invoices
  ADD CONSTRAINT chk_invoices_identifier_source CHECK (identifier_source IN ('automatic', 'custom'));
