## Why

The application is missing the recurring clients that your father served before invoices were managed in this system. The historical invoice workbooks in `invoice-client-input` contain enough labeled client information to seed those common clients, but the data must be extracted, normalized, deduplicated, and reviewed before it can be created safely.

## What Changes

- Add a one-time command-line extraction utility that reads the historical `.xlsx` invoice files from a selected input directory.
- Extract client name, street, city, postal code, and tax ID from the labeled invoice fields.
- Normalize formatting differences in addresses and tax IDs, and infer the required individual/company type with an explicit review path for uncertain cases.
- Deduplicate repeated invoices so recurring clients produce one candidate record rather than one record per invoice.
- Produce a CSV whose columns match the client data needed by the backup/export `Clients` table and the client creation contract.
- Produce a companion review report identifying missing tax IDs, ambiguous classifications, unparsed addresses, and source invoice files.
- Add a second one-time command that validates the reviewed `clients.csv` and imports eligible clients into PostgreSQL.
- Keep the workflow safe with dry-run by default, explicit `--write`, normalized tax-ID duplicate skipping, and transactional inserts.
- Keep `clients-review.csv` out of database import until its missing tax IDs and ambiguous classification are resolved.

## Capabilities

### New Capabilities

- `historical-invoice-client-extraction`: Extract, normalize, deduplicate, and review client candidates from legacy invoice workbooks into import-ready CSV data.
- `historical-client-database-import`: Validate, preview, deduplicate, and safely import reviewed historical client CSV rows into PostgreSQL.

### Modified Capabilities

<!-- No existing runtime capability requirements change. -->

## Impact

- Adds a small offline script under the web application tooling or migration scripts area.
- Uses the repository's existing `xlsx` dependency to parse workbooks.
- Produces migration artifacts outside the application database: client CSV output and a human-review report, followed by a controlled database import command.
- Aligns output with the client fields defined by the existing client creation validator and the `Clients` table produced by backup/export.
- No production API, database schema, or existing backup/export behavior changes in this phase; the database write is an explicit one-time operation.