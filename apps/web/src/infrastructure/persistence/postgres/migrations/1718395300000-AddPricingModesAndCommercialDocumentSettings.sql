-- Add pricing mode/manual subtotal to commercial documents and global default settings

ALTER TABLE budgets
  ADD COLUMN IF NOT EXISTS pricing_mode VARCHAR(30) NOT NULL DEFAULT 'computed',
  ADD COLUMN IF NOT EXISTS manual_subtotal_amount NUMERIC(12, 2);

ALTER TABLE budgets
  DROP CONSTRAINT IF EXISTS chk_budgets_pricing_mode;

ALTER TABLE budgets
  ADD CONSTRAINT chk_budgets_pricing_mode
  CHECK (pricing_mode IN ('computed', 'manual-subtotal'));

ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS pricing_mode VARCHAR(30) NOT NULL DEFAULT 'computed',
  ADD COLUMN IF NOT EXISTS manual_subtotal_amount NUMERIC(12, 2);

ALTER TABLE invoices
  DROP CONSTRAINT IF EXISTS chk_invoices_pricing_mode;

ALTER TABLE invoices
  ADD CONSTRAINT chk_invoices_pricing_mode
  CHECK (pricing_mode IN ('computed', 'manual-subtotal'));

CREATE TABLE IF NOT EXISTS commercial_document_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  default_pricing_mode VARCHAR(30) NOT NULL DEFAULT 'computed',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_commercial_document_settings_default_pricing_mode
    CHECK (default_pricing_mode IN ('computed', 'manual-subtotal'))
);

INSERT INTO commercial_document_settings (default_pricing_mode)
SELECT 'computed'
WHERE NOT EXISTS (SELECT 1 FROM commercial_document_settings);
