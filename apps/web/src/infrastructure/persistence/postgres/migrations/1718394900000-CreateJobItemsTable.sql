-- CreateJobItemsTable migration
-- Create job items table for budget and invoice line items

CREATE TABLE IF NOT EXISTS job_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commercial_document_id UUID NOT NULL,
  position INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  quantity NUMERIC(12, 2),
  unit_price NUMERIC(12, 2),
  total_price NUMERIC(12, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_job_items_commercial_document_id ON job_items (commercial_document_id);
CREATE INDEX IF NOT EXISTS idx_job_items_position ON job_items (commercial_document_id, position);
