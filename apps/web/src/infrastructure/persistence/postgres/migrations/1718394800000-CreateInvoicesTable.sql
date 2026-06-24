-- CreateInvoicesTable migration
-- Create invoices table with document metadata and snapshot fields

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number VARCHAR(255) NOT NULL UNIQUE,
  client_id UUID NOT NULL,
  worker_id UUID NOT NULL,
  notes TEXT,
  issued_at TIMESTAMP,
  source_budget_id UUID,
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
  CONSTRAINT fk_invoices_client_id FOREIGN KEY (client_id) REFERENCES clients (id),
  CONSTRAINT fk_invoices_worker_id FOREIGN KEY (worker_id) REFERENCES workers (id),
  CONSTRAINT fk_invoices_source_budget_id FOREIGN KEY (source_budget_id) REFERENCES budgets (id)
);

CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices (client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_worker_id ON invoices (worker_id);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices (created_at);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices (number);
CREATE INDEX IF NOT EXISTS idx_invoices_source_budget_id ON invoices (source_budget_id);
