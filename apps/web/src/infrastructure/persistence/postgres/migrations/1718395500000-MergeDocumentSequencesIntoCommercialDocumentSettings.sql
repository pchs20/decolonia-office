-- Merge document sequence state into commercial_document_settings single table.

ALTER TABLE commercial_document_settings
  ADD COLUMN IF NOT EXISTS default_budget_next_number INTEGER,
  ADD COLUMN IF NOT EXISTS invoice_next_numbers JSONB;

UPDATE commercial_document_settings
SET
  default_budget_next_number = COALESCE(default_budget_next_number, 1),
  invoice_next_numbers = COALESCE(invoice_next_numbers, '{}'::jsonb);

ALTER TABLE commercial_document_settings
  ALTER COLUMN default_budget_next_number SET NOT NULL,
  ALTER COLUMN invoice_next_numbers SET NOT NULL;

ALTER TABLE commercial_document_settings
  ALTER COLUMN default_budget_next_number SET DEFAULT 1,
  ALTER COLUMN invoice_next_numbers SET DEFAULT '{}'::jsonb;

ALTER TABLE commercial_document_settings
  DROP CONSTRAINT IF EXISTS chk_commercial_document_settings_default_budget_next_number;

ALTER TABLE commercial_document_settings
  ADD CONSTRAINT chk_commercial_document_settings_default_budget_next_number
  CHECK (default_budget_next_number >= 1);

DO $$
DECLARE
  settings_id UUID;
  budget_next INTEGER;
  invoice_json JSONB;
BEGIN
  SELECT id INTO settings_id
  FROM commercial_document_settings
  ORDER BY created_at ASC
  LIMIT 1;

  IF settings_id IS NULL THEN
    INSERT INTO commercial_document_settings (
      default_budget_pricing_mode,
      default_invoice_pricing_mode,
      default_budget_next_number,
      invoice_next_numbers
    )
    VALUES ('computed', 'computed', 1, '{}'::jsonb)
    RETURNING id INTO settings_id;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'document_sequences'
  ) THEN
    SELECT next_number
    INTO budget_next
    FROM document_sequences
    WHERE document_type = 'budget' AND scope_year IS NULL
    LIMIT 1;

    SELECT COALESCE(
      jsonb_object_agg(scope_year::text, to_jsonb(next_number)),
      '{}'::jsonb
    )
    INTO invoice_json
    FROM document_sequences
    WHERE document_type = 'invoice' AND scope_year IS NOT NULL;

    UPDATE commercial_document_settings
    SET
      default_budget_next_number = COALESCE(budget_next, default_budget_next_number, 1),
      invoice_next_numbers = COALESCE(invoice_json, invoice_next_numbers, '{}'::jsonb),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = settings_id;

    DROP TABLE IF EXISTS document_sequences;
  END IF;
END $$;
