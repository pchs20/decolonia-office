## Purpose

Define invoice lifecycle behavior for creation, editing, line items, totals, listing, snapshots, and source budget linkage.

## Requirements

### Requirement: Create a new invoice
The system SHALL allow users to create a new invoice with a client, issuer (worker), optional notes, optional source budget linkage, and an empty job items list.

#### Scenario: Successful invoice creation
- **WHEN** user fills out the new invoice form with required fields (client, worker/issuer)
- **THEN** system creates an invoice with auto-assigned year-scoped sequential number, empty job items, and current timestamp

#### Scenario: Invoice assigned with year-scoped sequential number
- **WHEN** a new invoice is created
- **THEN** system assigns a year-scoped sequential number (e.g., Invoice #1/2026, #2/2026 in 2026; #1/2027, #2/2027 in 2027)

#### Scenario: Link invoice to existing budget
- **WHEN** user selects a source budget during invoice creation
- **THEN** system sets sourceBudgetId reference and optionally pre-populates job items from the budget (optional behavior, not required)

### Requirement: Edit invoice header
The system SHALL allow users to edit the invoice's client, worker (issuer), notes, and issued date after creation.

#### Scenario: Update invoice metadata
- **WHEN** user modifies the invoice's client, worker, or notes fields in edit mode
- **THEN** system persists changes and updates the updatedAt timestamp

#### Scenario: Set issued date
- **WHEN** user enters or updates the issued date field
- **THEN** system stores the date (optional)

### Requirement: Add job items to invoice
The system SHALL allow users to add, edit, remove, and reorder job items (work line items) from an invoice.

#### Scenario: Add a job item
- **WHEN** user clicks "Add Item" and enters title, description, optional quantity, optional unitPrice
- **THEN** system appends the job item to the invoice's items list with auto-assigned position number

#### Scenario: Edit job item pricing
- **WHEN** user updates quantity, unitPrice, or totalPrice fields on an existing item
- **THEN** system stores the changes; subtotal, tax, and total recalculate

#### Scenario: Remove job item
- **WHEN** user clicks "Remove" on a job item
- **THEN** system deletes the item and renumbers remaining positions

#### Scenario: Move job item up within invoice
- **WHEN** user clicks "move up" on a job item that is not first in the list
- **THEN** system swaps that item's position with the one above it and the table reflects the updated order

#### Scenario: Move job item down within invoice
- **WHEN** user clicks "move down" on a job item that is not last in the list
- **THEN** system swaps that item's position with the one below it and the table reflects the updated order

### Requirement: Apply optional tax to invoice
The system SHALL allow users to select a tax definition (e.g., IVA 21%) when creating or editing an invoice.

#### Scenario: Apply tax during creation
- **WHEN** user selects a tax definition from the catalog during invoice creation
- **THEN** system materializes the tax name/rate/behavior on the invoice and calculates tax amount based on subtotal

#### Scenario: Change applied tax
- **WHEN** user updates the selected tax definition on an existing invoice
- **THEN** system re-materializes the tax snapshot and recalculates tax and total amounts

#### Scenario: Remove tax from invoice
- **WHEN** user clears the tax selection
- **THEN** system nulls the taxSnapshot and sets taxAmount to 0

### Requirement: Calculate invoice totals
The system SHALL automatically calculate subtotal, tax amount, and total based on job items and applied tax.

#### Scenario: Subtotal calculation
- **WHEN** an invoice contains job items with prices
- **THEN** system calculates subtotal as sum of all item totalPrice values (or unitPrice × quantity if totalPrice not set)

#### Scenario: Tax calculation
- **WHEN** a tax definition is applied to an invoice
- **THEN** system calculates taxAmount as subtotal × (tax rate / 100) using materialized tax snapshot

#### Scenario: Total calculation
- **WHEN** subtotal and tax are available
- **THEN** system calculates total as subtotal + taxAmount

### Requirement: List invoices
The system SHALL display a paginated list of invoices with client name, number, total amount, and issued date.

#### Scenario: View invoice list
- **WHEN** user navigates to the invoices list page
- **THEN** system displays all invoices sorted by creation date descending, paginated by 20

#### Scenario: Filter by client
- **WHEN** user filters the invoice list by a specific client
- **THEN** system displays only invoices linked to that client

#### Scenario: Filter by year
- **WHEN** user filters the invoice list by year (e.g., 2026)
- **THEN** system displays only invoices issued in that year

#### Scenario: Search by invoice number
- **WHEN** user searches for an invoice number (e.g., "Invoice #42/2026")
- **THEN** system returns matching invoices

### Requirement: View invoice snapshot
The system SHALL display a read-only view of an invoice with all materialized snapshots and totals.

#### Scenario: Display invoice snapshot
- **WHEN** user opens an invoice
- **THEN** system displays all fields, job items, and materialized client/worker/tax snapshots

### Requirement: Preserve client and worker snapshot data
The system SHALL store a point-in-time copy of client and worker (issuer) data on each invoice for historical accuracy.

#### Scenario: Client snapshot materialization
- **WHEN** an invoice is created
- **THEN** system captures the client's name, taxId, phone, email, and address fields into clientSnapshot; changes to the client definition later do not affect this invoice

#### Scenario: Worker snapshot materialization
- **WHEN** an invoice is created
- **THEN** system captures the worker's (issuer's) name, taxId, phone, email, and address fields into workerSnapshot; changes to the worker definition later do not affect this invoice

### Requirement: Support source budget reference
The system SHALL allow an invoice to optionally reference a source budget for traceability.

#### Scenario: View invoice with budget linkage
- **WHEN** user opens an invoice with a sourceBudgetId reference
- **THEN** system displays a link/badge showing the source budget number and allows navigation to it

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
