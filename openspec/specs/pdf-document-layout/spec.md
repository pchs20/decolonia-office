# PDF Document Layout

## Requirements

### Requirement: Compact commercial document header
Generated budget and invoice PDFs SHALL render worker information, client information, and document identity information in a shared horizontal header, with the client block positioned between the worker block and the document block.

#### Scenario: Header contains all three information areas
- **WHEN** a budget or invoice PDF is rendered with worker and client data
- **THEN** the worker block appears on the left, the client block appears in the middle, and the title/image/number/date block appears on the right

#### Scenario: Header saves vertical space
- **WHEN** a budget or invoice PDF is rendered
- **THEN** client information is not rendered as a separate full-width section below the header

### Requirement: Optional client contact details
The client block SHALL render the client's name, tax ID, billing address, phone, and email when available, and SHALL omit missing optional phone or email values without displaying empty labels or placeholder text.

#### Scenario: Client phone and email are present
- **WHEN** the client has a phone number and email address
- **THEN** both values appear in the middle client block

#### Scenario: Client phone and email are absent
- **WHEN** the client phone and email values are null or absent
- **THEN** neither value nor an empty contact label appears in the PDF

### Requirement: Compact totals and payment summary
Budget and invoice PDFs SHALL render payment information in a left-hand summary column and subtotal, tax, and total information in a right-hand totals column within the same lower summary area.

#### Scenario: Bank account is configured
- **WHEN** the worker has a bank account
- **THEN** the payment method and bank account appear to the left of the totals computation

#### Scenario: Bank account is not configured
- **WHEN** the worker has no bank account
- **THEN** the payment block is omitted and the totals remain visible in the right-hand totals area

#### Scenario: Totals remain unchanged
- **WHEN** the lower summary layout is rendered
- **THEN** subtotal, tax, no-tax messaging, and total values retain their existing labels, values, and calculation order

### Requirement: Shared localized behavior
The compact layout SHALL apply consistently to both budget and invoice PDFs without changing existing localized labels, document images, dates, numbers, or budget-only disclaimer behavior.

#### Scenario: Budget PDF
- **WHEN** a budget PDF is rendered in a supported locale
- **THEN** it uses the compact header and lower summary layout and continues to render the budget disclaimer

#### Scenario: Invoice PDF
- **WHEN** an invoice PDF is rendered in a supported locale
- **THEN** it uses the compact header and lower summary layout and does not render the budget disclaimer
