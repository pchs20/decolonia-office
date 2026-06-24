-- CreateWorkTemplatesTable migration
-- Create work templates catalog table

CREATE TABLE IF NOT EXISTS work_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  default_unit_price NUMERIC(12, 2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_work_templates_is_active ON work_templates (is_active);
CREATE INDEX IF NOT EXISTS idx_work_templates_created_at ON work_templates (created_at);
