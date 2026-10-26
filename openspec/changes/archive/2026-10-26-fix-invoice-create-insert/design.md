## Context

`createInvoiceRecord` builds a parameterized INSERT for the invoice aggregate. The custom-document-identifier change added `identifier_source` to the target list and parameter array, but left the final value list one expression short and referenced the identifier-source parameter at the wrong index.

## Decision

Make the smallest repository-local correction:

- Keep the existing target-column order and parameter-array order.
- Bind `identifier_source` to `$39`, the final parameter.
- Add `$38` for `updated_at`, which is currently omitted from the VALUES list.
- Add a focused unit-level regression test around the repository query construction and parameter array.

No migration or API change is needed because the `identifier_source` column already exists through the existing migration and the endpoint contract is unchanged.

## Verification

- Run the focused repository test covering invoice creation.
- Run the web package TypeScript check.
- Run the relevant Jest suite, then the repository-standard checks where practical.
- Run OpenSpec verification against this change.
