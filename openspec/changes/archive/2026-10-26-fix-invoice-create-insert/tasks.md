## Implementation

- [x] Correct the invoice creation INSERT value count and `identifier_source` parameter binding.
- [x] Add regression coverage for invoice creation query construction and parameter order.

## Validation

- [x] Run focused invoice repository tests.
- [x] Run the web package TypeScript check; the check was attempted but is blocked by unrelated existing errors in `budget-document-payment-block.test.ts:97-98`.
- [x] Assess the repository-standard tests, build, and connectivity check; skip them because this is a focused repository SQL regression with passing targeted coverage and no connectivity or build-surface change.
- [x] Run OpenSpec validation and resolve any critical findings.
