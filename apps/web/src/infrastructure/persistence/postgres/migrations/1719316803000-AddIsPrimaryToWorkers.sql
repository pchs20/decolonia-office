-- AddIsPrimaryToWorkers migration
-- Adds is_primary boolean to support designating one active worker

ALTER TABLE workers ADD COLUMN is_primary BOOLEAN NOT NULL DEFAULT false;

CREATE UNIQUE INDEX idx_workers_one_primary ON workers (is_primary) WHERE is_primary = true;
