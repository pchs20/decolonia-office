# Budget and Invoices Export

## MODIFIED Requirements

### Requirement: PDF generation API endpoints

The system SHALL expose read-only API endpoints that generate and return PDF binaries for a given budget or invoice. Client actions that invoke these endpoints SHALL communicate pending, success, and failure states without changing the PDF response contract.

#### Scenario: GET /api/budgets/[id]/pdf returns PDF binary

- **WHEN** an authenticated request is made to `GET /api/budgets/[id]/pdf` for an existing budget
- **THEN** the system returns HTTP 200 with `Content-Type: application/pdf` and the PDF binary

#### Scenario: GET /api/invoices/[id]/pdf returns PDF binary

- **WHEN** an authenticated request is made to `GET /api/invoices/[id]/pdf` for an existing invoice
- **THEN** the system returns HTTP 200 with `Content-Type: application/pdf` and the PDF binary

#### Scenario: PDF endpoint returns 404 for unknown document

- **WHEN** a request is made to the PDF endpoint for a non-existent document id
- **THEN** the system returns HTTP 404

#### Scenario: Budget PDF export communicates pending work

- **WHEN** a user starts exporting a budget PDF from the budget detail page
- **THEN** the export control becomes disabled, presents localized pending feedback, and remains so until the binary response is downloaded or the request fails

#### Scenario: Invoice PDF export communicates pending work

- **WHEN** a user starts exporting an invoice PDF from the invoice detail page
- **THEN** the export control becomes disabled, presents localized pending feedback, and remains so until the binary response is downloaded or the request fails

#### Scenario: PDF export failure is retryable

- **WHEN** a budget or invoice PDF request returns a failure response or cannot be completed
- **THEN** the detail page displays a localized error near the export control, restores the export control, and does not trigger a download
