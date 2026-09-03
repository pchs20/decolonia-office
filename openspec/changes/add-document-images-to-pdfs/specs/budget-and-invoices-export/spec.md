## ADDED Requirements

### Requirement: PDFs include document-specific issuer images
The system SHALL include a fixed static image in the issuer area of every generated budget and invoice PDF, positioned to the left of the worker's name and information. Budget PDFs SHALL use the budget image asset, and invoice PDFs SHALL use the invoice image asset. The two assets SHALL remain independently selectable even when they initially contain the same image.

#### Scenario: Budget PDF includes the budget image
- **WHEN** a budget PDF is generated
- **THEN** the PDF includes the fixed budget image to the left of the issuer's worker information

#### Scenario: Invoice PDF includes the invoice image
- **WHEN** an invoice PDF is generated
- **THEN** the PDF includes the fixed invoice image to the left of the issuer's worker information

#### Scenario: Budget and invoice assets are independently selected
- **WHEN** the budget and invoice PDF templates resolve their issuer images
- **THEN** each template uses its own document-type asset selection rather than a shared single selection

#### Scenario: Images are available to server-side PDF rendering
- **WHEN** a budget or invoice PDF is generated through the server-side PDF renderer
- **THEN** the selected image is resolved from the application's static PDF assets into a source readable by `@react-pdf/renderer`

#### Scenario: Image does not replace worker information
- **WHEN** a budget or invoice PDF is generated
- **THEN** the issuer area includes both the image and the existing worker name and information from the materialized `WorkerSnapshot`
