# Budget and Invoices Export

## MODIFIED Requirements

### Requirement: Export budget as PDF
The system SHALL generate a PDF representation of a budget using a server-side template that includes issuer data, client data, job items, totals, the required localized construction liability insurance disclaimer, and optionally a payment block. The disclaimer is informational, is rendered after the totals block and before payment details, and does not affect document amounts.

#### Scenario: Budget PDF contains issuer block
- **WHEN** a budget PDF is generated
- **THEN** the PDF includes the issuer's name, tax identifier, phone, email, and billing address from the materialized `WorkerSnapshot`

#### Scenario: Budget PDF contains the budget issuer image
- **WHEN** a budget PDF is generated
- **THEN** the PDF includes the fixed budget image in the issuer header, with the worker information in the left column and the image in the right document column

#### Scenario: Budget PDF contains client block
- **WHEN** a budget PDF is generated
- **THEN** the PDF includes the client's name, tax identifier, and billing address from the materialized `ClientSnapshot`

#### Scenario: Budget PDF contains job items table
- **WHEN** a budget with job items is exported to PDF
- **THEN** the PDF renders all job items as a structured table with title, description, quantity?, unitPrice?, and total price columns

#### Scenario: Budget PDF contains totals block
- **WHEN** a budget PDF is generated
- **THEN** the PDF includes subtotal, tax amount (with tax name and rate when applicable), and total amount

#### Scenario: Budget PDF contains the required coverage disclaimer
- **WHEN** a budget PDF is generated
- **THEN** the PDF includes the localized construction liability insurance disclaimer after the totals block and before any payment block, without adding a priced line item or changing subtotal, tax, or total amounts

#### Scenario: Budget PDF contains payment block when bank account is present
- **WHEN** the `WorkerSnapshot.bankAccount` is non-null
- **THEN** the PDF includes the same payment block as an invoice PDF, showing the payment method, bank transfer label, and bank account number after the disclaimer

#### Scenario: Budget PDF omits payment block when bank account is absent
- **WHEN** the `WorkerSnapshot.bankAccount` is null
- **THEN** the PDF omits the payment block entirely while retaining the disclaimer

#### Scenario: Budget PDF omits notes
- **WHEN** a budget PDF is generated
- **THEN** the PDF does NOT include the `notes` field; notes are internal to the worker and not shown to clients

#### Scenario: Budget PDF filename uses document number
- **WHEN** the PDF response is returned
- **THEN** the `Content-Disposition` header sets the filename to `presupuesto-{number}.pdf`
