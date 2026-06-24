-- Split commercial document default pricing mode by document type

ALTER TABLE commercial_document_settings
  ADD COLUMN IF NOT EXISTS default_budget_pricing_mode VARCHAR(30),
  ADD COLUMN IF NOT EXISTS default_invoice_pricing_mode VARCHAR(30);

UPDATE commercial_document_settings
SET
  default_budget_pricing_mode = COALESCE(default_budget_pricing_mode, default_pricing_mode, 'computed'),
  default_invoice_pricing_mode = COALESCE(default_invoice_pricing_mode, default_pricing_mode, 'computed');

ALTER TABLE commercial_document_settings
  ALTER COLUMN default_budget_pricing_mode SET NOT NULL,
  ALTER COLUMN default_invoice_pricing_mode SET NOT NULL;

ALTER TABLE commercial_document_settings
  DROP CONSTRAINT IF EXISTS chk_commercial_document_settings_default_pricing_mode;

ALTER TABLE commercial_document_settings
  ADD CONSTRAINT chk_commercial_document_settings_default_budget_pricing_mode
    CHECK (default_budget_pricing_mode IN ('computed', 'manual-subtotal')),
  ADD CONSTRAINT chk_commercial_document_settings_default_invoice_pricing_mode
    CHECK (default_invoice_pricing_mode IN ('computed', 'manual-subtotal'));

ALTER TABLE commercial_document_settings
  DROP COLUMN IF EXISTS default_pricing_mode;
