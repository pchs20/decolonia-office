CREATE TABLE IF NOT EXISTS document_export_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type VARCHAR(30) NOT NULL,
  document_id UUID NOT NULL,
  provider VARCHAR(60) NOT NULL,
  external_reference TEXT,
  source_updated_at TIMESTAMPTZ,
  synced_at TIMESTAMPTZ,
  last_attempted_at TIMESTAMPTZ,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_document_export_states_document_type
    CHECK (document_type IN ('budget', 'invoice')),
  CONSTRAINT uq_document_export_states_document_provider
    UNIQUE (document_type, document_id, provider)
);

CREATE INDEX IF NOT EXISTS idx_document_export_states_provider
  ON document_export_states (provider);
