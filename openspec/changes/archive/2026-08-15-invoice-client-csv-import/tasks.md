## 1. Tooling and Input Discovery

- [x] 1.1 Add an offline TypeScript command with explicit input and output directory arguments.
- [x] 1.2 Add workbook discovery and sheet-reading logic using the existing `xlsx` dependency without modifying source files.
- [x] 1.3 Define supported Spanish label aliases and a structured extraction result that retains source filenames and original field values.

## 2. Normalization and Classification

- [x] 2.1 Implement whitespace and punctuation normalization for names, streets, and tax IDs while preserving original values for review.
- [x] 2.2 Implement postal-code extraction from city values and return a review issue when city or postal code cannot be parsed.
- [x] 2.3 Implement conservative individual/company classification with an inference reason and an ambiguity review issue.
- [x] 2.4 Implement deterministic client identity keys using normalized tax ID first and normalized name/address fallback when tax ID is absent.

## 3. CSV and Review Outputs

- [x] 3.1 Implement deterministic deduplication that combines all contributing source filenames for each candidate.
- [x] 3.2 Implement UTF-8 CSV serialization with escaped fields and columns aligned to the client creation contract, including explicit empty optional fields.
- [x] 3.3 Implement the companion review CSV with stable issue reasons, original values, inferred values, and source filenames.
- [x] 3.4 Ensure files with no recognizable client block and candidates missing required data are reported rather than silently emitted as import-ready.

## 4. Verification and Documentation

- [x] 4.1 Add unit tests for label extraction, postal-code parsing, tax-ID normalization, classification, deduplication, and deterministic ordering.
- [x] 4.2 Run the command against `invoice-client-input` and verify the expected recurring-client consolidation, including the repeated Fundació client and missing-tax-ID cases.
- [x] 4.3 Document the command, CSV columns, review workflow, and the boundary that client creation is handled by a later migration script.
- [x] 4.4 Run the relevant package typecheck and test commands and confirm generated outputs are excluded from source control unless intentionally retained as migration evidence.

## 5. Importer Foundation

- [x] 5.1 Add the standalone database import command with CSV input, dry-run default, and explicit `--write` handling.
- [x] 5.2 Add a small UTF-8 CSV parser that supports quoted commas, quotes, and newlines and rejects malformed rows with context.
- [x] 5.3 Define typed import rows, validation results, duplicate results, and deterministic import reports while excluding `sourceFiles` from persisted fields.

## 6. Validation and Duplicate Preflight

- [x] 6.1 Implement client-row validation matching the existing client creation contract for required fields, type, billing completeness, phone, and email.
- [x] 6.2 Fill missing billing fields from the work address before validation and insertion.
- [x] 6.3 Normalize tax IDs for comparison and detect duplicates within the CSV deterministically.
- [x] 6.4 Query existing client tax IDs through the PostgreSQL pool and classify matching rows as skipped without modifying them.

## 7. Transactional Database Write

- [x] 7.1 Insert valid, non-duplicate clients with generated UUIDs and application-compatible timestamps/active state through the PostgreSQL pool.
- [x] 7.2 Wrap all write-mode inserts in one transaction and roll back on unexpected database failures.
- [x] 7.3 Produce deterministic console output for inserted, skipped, invalid, and failed rows.
- [x] 7.4 Ensure default dry-run performs no insert or transaction commit and only `--write` can mutate the database.

## 8. Importer Tests and Verification

- [x] 8.1 Add focused tests for CSV parsing, validation, billing fallback, tax-ID normalization, duplicate handling, and deterministic reports.
- [x] 8.2 Add database-boundary tests for dry-run no-write behavior, successful transaction commits, rollback on failure, and rerun skips where the repository test setup permits.
- [x] 8.3 Document the command, required `DATABASE_URL`, dry-run/write workflow, duplicate policy, and exclusion of `clients-review.csv`.
- [x] 8.4 Run dry-run against `../../invoice-client-output/clients.csv` from the `apps/web` package working directory, verify the expected 10 candidates are handled, then run package tests and typecheck.