## MODIFIED Requirements

### Requirement: Export budget as PDF
The system SHALL generate a PDF representation of a budget using a server-side template that includes issuer data, client data, job items, totals, the required localized construction liability insurance disclaimer, and optionally a payment block. The disclaimer is informational, is rendered after the totals block and before payment details, and does not affect document amounts. When issuer or client phone data is present, the PDF SHALL render it with the localized PDF phone label before the number.

#### Scenario: Budget PDF contains issuer block
- **WHEN** a budget PDF is generated
- **THEN** the PDF includes the issuer's name, tax identifier, phone, email, and billing address from the materialized `WorkerSnapshot`

#### Scenario: Budget PDF labels available phone numbers
- **WHEN** a budget PDF is generated with an issuer or client phone number
- **THEN** each rendered phone number is prefixed by the localized PDF phone label, such as `Tel.`

#### Scenario: Budget PDF omits unavailable phone labels
- **WHEN** a budget PDF is generated without an issuer or client phone number
- **THEN** the corresponding phone line is omitted and no standalone phone label is rendered

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

### Requirement: Export invoice as PDF
The system SHALL generate a PDF representation of an invoice using a server-side template that includes issuer data, client data, job items, totals, and optionally a payment block. When issuer or client phone data is present, the PDF SHALL render it with the localized PDF phone label before the number.

#### Scenario: Invoice PDF contains issuer block
- **WHEN** an invoice PDF is generated
- **THEN** the PDF includes the issuer's name, tax identifier, phone, email, and billing address from the materialized `WorkerSnapshot`

#### Scenario: Invoice PDF labels available phone numbers
- **WHEN** an invoice PDF is generated with an issuer or client phone number
- **THEN** each rendered phone number is prefixed by the localized PDF phone label, such as `Tel.`

#### Scenario: Invoice PDF omits unavailable phone labels
- **WHEN** an invoice PDF is generated without an issuer or client phone number
- **THEN** the corresponding phone line is omitted and no standalone phone label is rendered

#### Scenario: Invoice PDF contains the invoice issuer image
- **WHEN** an invoice PDF is generated
- **THEN** the PDF includes the fixed invoice image in the issuer header, with the worker information in the left column and the image in the right document column

#### Scenario: Document header aligns metadata with issuer image
- **WHEN** a budget or invoice PDF is generated
- **THEN** the document title, image, number, and date are presented in the right document column, with the number and date labels aligned to the image's left edge and their values aligned to its right edge

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

## ADDED Requirements

### Requirement: PDF phone label is localized
The PDF translation catalog SHALL provide a phone label for every supported locale. The Spanish, Catalan, and English catalogs SHALL initially use `Tel.` as the value.

#### Scenario: Supported locales provide a phone label
- **WHEN** a budget or invoice PDF is rendered in Spanish, Catalan, or English
- **THEN** the renderer receives the corresponding locale's PDF phone label and uses it for available issuer and client phone numbers
