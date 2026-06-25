-- RenameTaxDefinitionsToTaxes migration
-- Hard cutover from tax_definitions naming to taxes naming.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'tax_definitions'
  ) THEN
    ALTER TABLE tax_definitions RENAME TO taxes;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema = 'public' AND table_name = 'taxes' AND constraint_name = 'chk_tax_definitions_behavior'
  ) THEN
    ALTER TABLE taxes RENAME CONSTRAINT chk_tax_definitions_behavior TO chk_taxes_behavior;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema = 'public' AND table_name = 'taxes' AND constraint_name = 'chk_tax_definitions_rate'
  ) THEN
    ALTER TABLE taxes RENAME CONSTRAINT chk_tax_definitions_rate TO chk_taxes_rate;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_class WHERE relname = 'idx_tax_definitions_is_active'
  ) THEN
    ALTER INDEX idx_tax_definitions_is_active RENAME TO idx_taxes_is_active;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_class WHERE relname = 'idx_tax_definitions_created_at'
  ) THEN
    ALTER INDEX idx_tax_definitions_created_at RENAME TO idx_taxes_created_at;
  END IF;
END $$;
