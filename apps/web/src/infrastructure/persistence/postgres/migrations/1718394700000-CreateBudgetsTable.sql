-- CreateBudgetsTable migration
-- Create budgets table with document metadata and snapshot fields

CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number VARCHAR(255) NOT NULL UNIQUE,
  client_id UUID NOT NULL,
  worker_id UUID NOT NULL,
  notes TEXT,
  delivered_at TIMESTAMP,
  client_snapshot_name VARCHAR(255) NOT NULL,
  client_snapshot_tax_id VARCHAR(20) NOT NULL,
  client_snapshot_phone VARCHAR(20),
  client_snapshot_email VARCHAR(255),
  client_snapshot_work_street VARCHAR(255) NOT NULL,
  client_snapshot_work_city VARCHAR(255) NOT NULL,
  client_snapshot_work_postal_code VARCHAR(20) NOT NULL,
  client_snapshot_billing_street VARCHAR(255) NOT NULL,
  client_snapshot_billing_city VARCHAR(255) NOT NULL,
  client_snapshot_billing_postal_code VARCHAR(20) NOT NULL,
  worker_snapshot_name VARCHAR(255) NOT NULL,
  worker_snapshot_tax_id VARCHAR(20) NOT NULL,
  worker_snapshot_phone VARCHAR(20),
  worker_snapshot_email VARCHAR(255),
  worker_snapshot_work_street VARCHAR(255) NOT NULL,
  worker_snapshot_work_city VARCHAR(255) NOT NULL,
  worker_snapshot_work_postal_code VARCHAR(20) NOT NULL,
  worker_snapshot_billing_street VARCHAR(255) NOT NULL,
  worker_snapshot_billing_city VARCHAR(255) NOT NULL,
  worker_snapshot_billing_postal_code VARCHAR(20) NOT NULL,
  tax_snapshot_name VARCHAR(255),
  tax_snapshot_rate NUMERIC(5, 2),
  tax_snapshot_behavior VARCHAR(20),
  subtotal_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_budgets_client_id FOREIGN KEY (client_id) REFERENCES clients (id),
  CONSTRAINT fk_budgets_worker_id FOREIGN KEY (worker_id) REFERENCES workers (id)
);

CREATE INDEX IF NOT EXISTS idx_budgets_client_id ON budgets (client_id);
CREATE INDEX IF NOT EXISTS idx_budgets_worker_id ON budgets (worker_id);
CREATE INDEX IF NOT EXISTS idx_budgets_created_at ON budgets (created_at);
CREATE INDEX IF NOT EXISTS idx_budgets_number ON budgets (number);
