-- CreateTaxesTable migration
-- Create taxes catalog table

CREATE TABLE IF NOT EXISTS taxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  rate NUMERIC(5, 2) NOT NULL,
  behavior VARCHAR(20) NOT NULL DEFAULT 'added',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_taxes_behavior CHECK (behavior IN ('added')),
  CONSTRAINT chk_taxes_rate CHECK (rate >= 0 AND rate <= 100)
);

CREATE INDEX IF NOT EXISTS idx_taxes_is_active ON taxes (is_active);
CREATE INDEX IF NOT EXISTS idx_taxes_created_at ON taxes (created_at);
