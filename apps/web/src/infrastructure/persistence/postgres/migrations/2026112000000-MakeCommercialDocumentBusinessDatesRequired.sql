-- Backfill historical commercial document business dates and enforce the invariant.

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM budgets WHERE delivered_at IS NULL AND created_at IS NULL) THEN
    RAISE EXCEPTION 'Cannot backfill budgets.delivered_at because created_at is NULL';
  END IF;

  IF EXISTS (SELECT 1 FROM invoices WHERE issued_at IS NULL AND created_at IS NULL) THEN
    RAISE EXCEPTION 'Cannot backfill invoices.issued_at because created_at is NULL';
  END IF;
END $$;

UPDATE budgets
SET delivered_at = created_at
WHERE delivered_at IS NULL;

UPDATE invoices
SET issued_at = created_at
WHERE issued_at IS NULL;

ALTER TABLE budgets ALTER COLUMN delivered_at SET NOT NULL;
ALTER TABLE invoices ALTER COLUMN issued_at SET NOT NULL;
