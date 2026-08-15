## Context

This is a one-time migration of the most common clients served by the user's father before this application was introduced. The source is a directory of legacy invoice workbooks. The inspected workbooks use a repeated visual invoice template, but they are not database exports: values are positioned beside Spanish labels, postal codes are embedded in city text, tax IDs have inconsistent spacing and prefixes, and some invoices omit tax IDs.

The application already has a flat client transport contract (`name`, `type`, `street`, `city`, `postalCode`, optional billing fields, `taxId`, `phone`, and `email`) and a backup/export `Clients` table generated from database rows. This change prepares import data and provides a controlled importer for the reviewed CSV.

## Architecture Diagrams

```text
Historical .xlsx files
        |
        v
Offline extraction command
  - locate labeled cells
  - normalize fields
  - infer type
  - retain source provenance
        |
        +------------------> clients.csv
        |
        +------------------> clients-review.csv
                                  |
                                  v
                         Human review and correction
                                  |
                                  v
                         PostgreSQL importer
```

Assumptions: the source workbooks remain available locally during extraction; the first pass targets the current invoice template; CSV files are treated as reviewable migration artifacts and are not automatically submitted to the application.

## Goals / Non-Goals

**Goals:**

- Read all `.xlsx` files in a supplied directory using the existing `xlsx` package.
- Extract labeled client values independently of their exact column positions.
- Normalize city/postal-code, street, and tax-ID formatting without losing the original source values.
- Deduplicate repeated invoices into one client candidate using tax ID when available and a normalized identity fallback otherwise.
- Emit an import-shaped CSV plus a review report with source filenames and reasons for review.
- Make reruns deterministic and safe because the utility does not write to the database.
- Validate the reviewed CSV and import eligible clients into PostgreSQL through a separate dry-run/write command.
- Skip existing normalized tax IDs and insert new clients in one transaction.

**Non-Goals:**

- Updating or deleting existing clients in PostgreSQL.
- Modifying the backup/export feature or its runtime CSV/XLSX behavior.
- Extracting invoices, line items, dates, totals, phone numbers, emails, or billing addresses for this migration.
- Silently guessing missing tax IDs or resolving uncertain client classifications without review.

## Decisions

1. **Use a one-time TypeScript command rather than an AI prompt.** The invoice template is structured and the output must be repeatable, testable, and auditable. An AI prompt may assist with exceptional review cases later, but it is not the extraction mechanism.

2. **Use the existing `xlsx` dependency.** Adding another spreadsheet parser would increase migration surface without solving a demonstrated limitation. The repository already parses workbook sheets through `xlsx`.

3. **Extract by label, not hard-coded coordinates.** The parser will recognize labels such as `Nombre`, `Dirección`, `Ciudad`, `CIF.` and `V.A.T.` and read the adjacent value. This tolerates small layout shifts while keeping the supported template explicit.

4. **Separate normalized output from review data.** `clients.csv` contains one row per deduplicated candidate with flat client fields. `clients-review.csv` contains records needing attention, including missing tax IDs, ambiguous type inference, incomplete address parsing, and all contributing source filenames.

5. **Preserve provenance.** Each candidate includes source invoice filenames, allowing a reviewer to trace a value back to the old invoice and allowing duplicate grouping to be explained.

6. **Treat inferred type as reviewable.** Company-like legal forms such as `S.L.`, `S.L.U.`, `C.B.`, `Fundació`, `Comunitat`, and `Construccions` can produce a `company` candidate; personal names produce `individual`. Any uncertain result is marked for review rather than hidden.

7. **Use the work address as the billing address.** The historical invoices do not provide a separate billing address, so the CSV populates billing street, city, and postal code with the normalized work address. Phone and email remain empty because they are not present. Missing required values prevent a candidate from being marked import-ready.

8. **Import directly through a controlled database command.** The clients API is protected by Auth.js and has no duplicate protection, so the one-time importer reuses the PostgreSQL pool and client table directly. It defaults to dry-run, requires `--write`, skips normalized existing tax IDs, and wraps inserts in one transaction.

9. **Import only reviewed candidates.** The importer consumes `clients.csv` and ignores `clients-review.csv` until missing tax IDs and ambiguous types are resolved. `sourceFiles` remains audit metadata and is not persisted.

## Risks / Trade-offs

- [Risk] A future invoice template changes its labels or value placement. → Mitigation: centralize label aliases, report files with no recognized client block, and test against representative legacy workbooks.
- [Risk] Similar clients without tax IDs could be incorrectly merged. → Mitigation: use a conservative normalized name/address fallback and place uncertain groups in the review report.
- [Risk] Tax-ID formatting can affect deduplication. → Mitigation: normalize whitespace and case for matching while retaining the display value and source values.
- [Risk] Inferred company/individual type may be wrong. → Mitigation: include the inference reason and review status in the report; do not import unreviewed candidates in the later phase.
- [Risk] CSV consumers may interpret accented characters or delimiters incorrectly. → Mitigation: emit UTF-8 CSV with escaped fields and document the column contract.
- [Risk] Direct import could partially write data on failure. → Mitigation: validate before writing and wrap all inserts in one transaction with rollback on error.
- [Risk] Re-running the importer could create duplicates. → Mitigation: compare normalized tax IDs before insertion and report skipped rows.

## Migration Plan

1. Add the extraction command and focused parser tests using representative workbooks or fixtures.
2. Run it against `invoice-client-input` into a disposable output directory.
3. Review and correct `clients-review.csv`, especially the three source files without tax IDs and any uncertain type classifications.
4. Verify `clients.csv` against the client creation contract and backup `Clients` columns.
5. Run the database importer in dry-run mode against the reviewed `clients.csv`.
6. Review the report, then run with `--write` against the intended database.
7. Re-run to confirm previously imported tax IDs are skipped.

Rollback is deletion of the generated CSV/report files. No application or database state changes occur in this phase.

## Open Questions

- Should the final reviewed CSV use only import fields, or also include `source_files`, `review_status`, and `review_reason` columns for auditability?
- The extraction CSV defaults billing address fields to the normalized work address because the source invoices have no separate billing address, and the importer preserves that rule.
- Should tax IDs with a country prefix such as `ESB58294349` be stored exactly as normalized from the invoice or split into country and local identifier? The current client contract has one `taxId` field, so the initial design retains the normalized full value.