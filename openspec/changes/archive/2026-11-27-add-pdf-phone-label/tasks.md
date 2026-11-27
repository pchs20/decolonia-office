## 1. PDF localization

- [x] 1.1 Add the `pdf.phone` translation key with the value `Tel.` to the Spanish, Catalan, and English message catalogs.
- [x] 1.2 Confirm the typed `PdfLabels` shape exposes the new phone label to PDF components.

## 2. Shared PDF header rendering

- [x] 2.1 Pass the localized phone label from the budget and invoice document headers into both issuer and client blocks.
- [x] 2.2 Render `Tel. <number>` for available issuer and client phone numbers while preserving omission of missing phone lines.

## 3. Verification

- [x] 3.1 Add or update focused PDF header tests covering issuer and client labels and all supported locale values.
- [x] 3.2 Run the relevant test suite and project checks, then confirm the change introduces no API or persistence changes.
