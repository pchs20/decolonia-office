ALTER TABLE document_export_states
  ADD COLUMN IF NOT EXISTS destination_reference TEXT NOT NULL DEFAULT 'legacy-default';

ALTER TABLE document_export_states
  DROP CONSTRAINT IF EXISTS uq_document_export_states_document_provider;

ALTER TABLE document_export_states
  ADD CONSTRAINT uq_document_export_states_document_provider_destination
  UNIQUE (document_type, document_id, provider, destination_reference);

CREATE INDEX IF NOT EXISTS idx_document_export_states_provider_destination
  ON document_export_states (provider, destination_reference);
