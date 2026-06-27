## ADDED Requirements

### Requirement: Export invoice to PDF from detail view
The system SHALL provide an export action on the invoice detail page that triggers a PDF download for the displayed invoice.

#### Scenario: Export PDF button visible in view mode
- **WHEN** a user views an invoice detail page (not in edit mode)
- **THEN** an "Export PDF" button is visible in the page header actions

#### Scenario: Clicking Export PDF downloads the invoice PDF
- **WHEN** a user clicks "Export PDF" on an invoice detail page
- **THEN** the browser downloads a PDF file named `factura-{number}.pdf` containing the invoice data

#### Scenario: Export PDF button not visible in edit mode
- **WHEN** a user is in invoice edit mode
- **THEN** the "Export PDF" button is not shown
