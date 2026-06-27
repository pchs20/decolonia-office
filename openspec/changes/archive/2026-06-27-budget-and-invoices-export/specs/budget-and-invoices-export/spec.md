## ADDED Requirements

### Requirement: Export budget as PDF
The system SHALL generate a PDF representation of a budget using a server-side template that includes issuer data, client data, job items, and totals.

#### Scenario: Budget PDF contains issuer block
- **WHEN** a budget PDF is generated
- **THEN** the PDF includes the issuer's name, tax identifier, phone, email, and billing address from the materialized `WorkerSnapshot`

#### Scenario: Budget PDF contains client block
- **WHEN** a budget PDF is generated
- **THEN** the PDF includes the client's name, tax identifier, and billing address from the materialized `ClientSnapshot`

#### Scenario: Budget PDF contains job items table
- **WHEN** a budget with job items is exported to PDF
- **THEN** the PDF renders all job items as a structured table with title, description, quantity?, unitPrice?, and total price columns

#### Scenario: Budget PDF contains totals block
- **WHEN** a budget PDF is generated
- **THEN** the PDF includes subtotal, tax amount (with tax name and rate when applicable), and total amount

#### Scenario: Budget PDF omits notes
- **WHEN** a budget PDF is generated
- **THEN** the PDF does NOT include the `notes` field; notes are internal to the worker and not shown to clients

#### Scenario: Budget PDF filename uses document number
- **WHEN** the PDF response is returned
- **THEN** the `Content-Disposition` header sets the filename to `presupuesto-{number}.pdf`

### Requirement: Export invoice as PDF
The system SHALL generate a PDF representation of an invoice using a server-side template that includes issuer data, client data, job items, totals, and optionally a payment block.

#### Scenario: Invoice PDF contains issuer block
- **WHEN** an invoice PDF is generated
- **THEN** the PDF includes the issuer's name, tax identifier, phone, email, and billing address from the materialized `WorkerSnapshot`

#### Scenario: Invoice PDF contains client block with document metadata
- **WHEN** an invoice PDF is generated
- **THEN** the PDF includes the client's name, tax identifier, billing address, invoice number, and issued date

#### Scenario: Invoice PDF contains job items table with unit price column
- **WHEN** an invoice with job items is exported to PDF
- **THEN** the PDF renders all job items as a structured table with title, description, quantity?, unit price, and total price columns

#### Scenario: Invoice PDF contains totals block
- **WHEN** an invoice PDF is generated
- **THEN** the PDF includes subtotal, tax amount (with tax name and rate when applicable), and total amount

#### Scenario: Invoice PDF contains payment block when bank account is present
- **WHEN** the `WorkerSnapshot.bankAccount` is non-null
- **THEN** the PDF includes a payment block showing the bank account number

#### Scenario: Invoice PDF omits payment block when bank account is absent
- **WHEN** the `WorkerSnapshot.bankAccount` is null
- **THEN** the PDF omits the payment block entirely

#### Scenario: Invoice PDF omits notes
- **WHEN** an invoice PDF is generated
- **THEN** the PDF does NOT include the `notes` field

#### Scenario: Invoice PDF filename uses document number
- **WHEN** the PDF response is returned
- **THEN** the `Content-Disposition` header sets the filename to `factura-{number}.pdf`

### Requirement: PDF generation API endpoints
The system SHALL expose read-only API endpoints that generate and return PDF binaries for a given budget or invoice.

#### Scenario: GET /api/budgets/[id]/pdf returns PDF binary
- **WHEN** an authenticated request is made to `GET /api/budgets/[id]/pdf` for an existing budget
- **THEN** the system returns HTTP 200 with `Content-Type: application/pdf` and the PDF binary

#### Scenario: GET /api/invoices/[id]/pdf returns PDF binary
- **WHEN** an authenticated request is made to `GET /api/invoices/[id]/pdf` for an existing invoice
- **THEN** the system returns HTTP 200 with `Content-Type: application/pdf` and the PDF binary

#### Scenario: PDF endpoint returns 404 for unknown document
- **WHEN** a request is made to the PDF endpoint for a non-existent document id
- **THEN** the system returns HTTP 404
