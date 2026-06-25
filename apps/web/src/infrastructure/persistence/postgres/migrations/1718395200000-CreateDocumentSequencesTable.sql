-- CreateDocumentSequencesTable migration
-- Create document sequences for numbering allocation

CREATE TABLE IF NOT EXISTS document_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type VARCHAR(20) NOT NULL,
  scope_year INTEGER,
  next_number INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_document_sequences_document_type CHECK (document_type IN ('budget', 'invoice')),
  CONSTRAINT uq_document_sequences_type_year UNIQUE (document_type, scope_year)
);

CREATE INDEX IF NOT EXISTS idx_document_sequences_document_type ON document_sequences (document_type);
