# Budget PDF Disclaimer

## ADDED Requirements

### Requirement: Budget PDFs display the required coverage disclaimer
The system SHALL display the localized disclaimer `Seguro de responsabilidad civil ámbito de construcción` in every generated budget PDF as an informational coverage statement. The disclaimer SHALL be rendered after the totals block and before any payment block, and SHALL NOT represent a priced job item or affect document amounts.

#### Scenario: Spanish budget PDF displays disclaimer
- **WHEN** a budget PDF is generated with the Spanish locale
- **THEN** the PDF displays `Seguro de responsabilidad civil ámbito de construcción` after the totals and before payment details when payment details are present

#### Scenario: Catalan budget PDF displays translated disclaimer
- **WHEN** a budget PDF is generated with the Catalan locale
- **THEN** the PDF displays the Catalan translation of the required coverage disclaimer in the same location

#### Scenario: English budget PDF displays translated disclaimer
- **WHEN** a budget PDF is generated with the English locale
- **THEN** the PDF displays the English translation of the required coverage disclaimer in the same location

#### Scenario: Disclaimer does not alter budget amounts
- **WHEN** a budget PDF is generated with the disclaimer
- **THEN** the subtotal, tax amount, total amount, and job item rows remain unchanged and the disclaimer is not rendered as a priced line item

#### Scenario: Disclaimer is present without payment details
- **WHEN** a budget PDF is generated for a worker without a bank account
- **THEN** the disclaimer is still displayed after the totals block and the payment block remains omitted

### Requirement: Invoice PDFs do not display the budget disclaimer
The system SHALL restrict the coverage disclaimer to budget PDFs and SHALL NOT display it in invoice PDFs.

#### Scenario: Invoice PDF omits disclaimer
- **WHEN** an invoice PDF is generated in any supported locale
- **THEN** the invoice PDF does not display the budget coverage disclaimer
