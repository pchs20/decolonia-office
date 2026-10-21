## Why

Budget and invoice PDFs currently spend unnecessary vertical space by rendering client details below the worker and document header, and by rendering payment information below the totals. This pushes line items and other useful content lower on the page; a compact shared layout will make the documents easier to scan and fit more content without changing their data.

## What Changes

- Place worker, client, and budget/invoice identity information in one horizontal header.
- Show client name, tax ID, address, phone, and email when those values exist.
- Omit optional client phone and email fields entirely when they are missing.
- Place payment information to the left of the totals computation in the lower summary area.
- Keep totals aligned to the right and preserve existing subtotal, tax, and total calculations.
- Apply the shared layout consistently to budget and invoice PDFs.
- Preserve existing localized labels, document image placement, disclaimers, and payment omission behavior when no bank account is configured.

## Capabilities

### New Capabilities

- `pdf-document-layout`: Defines the compact header and bottom summary layout for generated budget and invoice PDFs.

### Modified Capabilities

- None.

## Impact

- Affected presentation components: shared PDF header, client block, totals block, payment block, budget document, and invoice document.
- Affected automated coverage: PDF component/layout tests.
- No API, persistence, database, dependency, or exported document data contract changes.
