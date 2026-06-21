-- AddStructuredAddressFieldsToClients migration
-- Converted from TypeORM migration 1718394500000-AddStructuredAddressFieldsToClients.ts

ALTER TABLE clients ADD COLUMN IF NOT EXISTS street TEXT DEFAULT '';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS city VARCHAR(120) DEFAULT '';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20) DEFAULT '';

ALTER TABLE clients ADD COLUMN IF NOT EXISTS billing_street TEXT DEFAULT '';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS billing_city VARCHAR(120) DEFAULT '';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS billing_postal_code VARCHAR(20) DEFAULT '';

ALTER TABLE clients ALTER COLUMN address DROP NOT NULL;
