-- CreateWorkersTable migration
-- Mirrors client structured address conventions for worker profiles

CREATE TABLE IF NOT EXISTS workers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  street TEXT NOT NULL,
  city VARCHAR(120) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  billing_street TEXT,
  billing_city VARCHAR(120),
  billing_postal_code VARCHAR(20),
  tax_id VARCHAR(20) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_workers_name ON workers (name);
CREATE INDEX IF NOT EXISTS idx_workers_is_active ON workers (is_active);
