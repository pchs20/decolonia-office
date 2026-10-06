## Why

Budget PDFs need to carry a required civil-liability insurance coverage statement for construction-related work. The statement is informational and must be visible to recipients without being treated as a priced service, changing totals, or becoming part of the editable budget data.

## What Changes

- Add a budget-only disclaimer to generated budget PDFs after the totals block and before payment details.
- Localize the disclaimer for the supported PDF locales: Spanish, Catalan, and English.
- Keep the disclaimer outside the budget aggregate, API contracts, persistence model, and pricing calculations.
- Add focused rendering coverage proving that the disclaimer appears in budget PDFs and does not appear in invoice PDFs.

## Capabilities

### New Capabilities

- `budget-pdf-disclaimer`: Defines the required localized disclaimer shown in generated budget PDFs.

### Modified Capabilities

- `budget-and-invoices-export`: Extend the budget PDF export requirement with the required disclaimer while preserving existing invoice behavior.

## Impact

- Affected presentation code: the budget PDF template and PDF translation message files.
- Affected tests: server-side PDF rendering tests for budget and invoice documents.
- No API, database, domain entity, editable budget form, pricing, or external dependency changes are expected.
