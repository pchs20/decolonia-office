## Why

Phone numbers in budget and invoice PDFs currently appear without a descriptive label, making them less immediately recognizable in the document header. Adding a localized `Tel.` prefix improves clarity while preserving the existing phone values and the current behavior for missing phone numbers.

## What Changes

- Add a translatable PDF phone label to the Spanish, Catalan, and English message catalogs, initially using `Tel.` in all three languages.
- Prefix every rendered issuer and client phone number in budget and invoice PDFs with the localized label.
- Keep phone numbers unchanged in storage and API responses, and continue omitting the phone line when no phone number is available.
- Add focused coverage for the shared PDF header rendering in all supported document types/locales.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `budget-and-invoices-export`: require issuer and client phone numbers in budget and invoice PDF headers to be rendered with the localized PDF phone label when present.

## Impact

- Affected PDF presentation components and PDF translation catalogs under `apps/web/src/presentation/`.
- Affected PDF rendering tests for the shared document header.
- No API, persistence, database, dependency, or stored-data changes.
- No architecture decision record is expected because this is a localized presentation change within the existing PDF export design.
