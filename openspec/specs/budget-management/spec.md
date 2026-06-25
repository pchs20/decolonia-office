## Purpose

Define budget lifecycle behavior for creation, editing, line items, totals, listing, and snapshot preservation.

## Requirements

### Requirement: Create a new budget
The system SHALL allow users to create a new budget with a client, issuer (worker), optional notes, and an empty job items list.

#### Scenario: Successful budget creation
- **WHEN** user fills out the new budget form with required fields (client, worker/issuer)
- **THEN** system creates a budget with auto-assigned sequential number, empty job items, and current timestamp

#### Scenario: Budget assigned with global sequential number
- **WHEN** a new budget is created
- **THEN** system assigns a global-scope sequential number (e.g., Budget #1, #2, #3 across all time)

### Requirement: Edit budget header
The system SHALL allow users to edit the budget's client, worker (issuer), notes, and delivered date after creation.

#### Scenario: Update budget metadata
- **WHEN** user modifies the budget's client, worker, or notes fields in edit mode
- **THEN** system persists changes and updates the updatedAt timestamp

#### Scenario: Set delivered date
- **WHEN** user enters or updates the delivered date field
- **THEN** system stores the date (optional)

### Requirement: Add job items to budget
The system SHALL allow users to add, edit, and remove job items (work line items) from a budget.

#### Scenario: Add a job item
- **WHEN** user clicks "Add Item" and enters title, description, optional quantity, optional unitPrice
- **THEN** system appends the job item to the budget's items list with auto-assigned position number

#### Scenario: Edit job item pricing
- **WHEN** user updates quantity, unitPrice, or totalPrice fields on an existing item
- **THEN** system stores the changes; subtotal, tax, and total recalculate

#### Scenario: Remove job item
- **WHEN** user clicks "Remove" on a job item
- **THEN** system deletes the item and renumbers remaining positions

### Requirement: Apply optional tax to budget
The system SHALL allow users to select a tax definition (e.g., IVA 21%) when creating or editing a budget.

#### Scenario: Apply tax during creation
- **WHEN** user selects a tax definition from the catalog during budget creation
- **THEN** system materializes the tax name/rate/behavior on the budget and calculates tax amount based on subtotal

#### Scenario: Change applied tax
- **WHEN** user updates the selected tax definition on an existing budget
- **THEN** system re-materializes the tax snapshot and recalculates tax and total amounts

#### Scenario: Remove tax from budget
- **WHEN** user clears the tax selection
- **THEN** system nulls the taxSnapshot and sets taxAmount to 0

### Requirement: Calculate budget totals
The system SHALL automatically calculate subtotal, tax amount, and total based on job items and applied tax.

#### Scenario: Subtotal calculation
- **WHEN** a budget contains job items with prices
- **THEN** system calculates subtotal as sum of all item totalPrice values (or unitPrice × quantity if totalPrice not set)

#### Scenario: Tax calculation
- **WHEN** a tax definition is applied to a budget
- **THEN** system calculates taxAmount as subtotal × (tax rate / 100) using materialized tax snapshot

#### Scenario: Total calculation
- **WHEN** subtotal and tax are available
- **THEN** system calculates total as subtotal + taxAmount

### Requirement: List budgets
The system SHALL display a paginated list of budgets with client name, number, total amount, and delivered date.

#### Scenario: View budget list
- **WHEN** user navigates to the budgets list page
- **THEN** system displays all budgets sorted by creation date descending, paginated by 20

#### Scenario: Filter by client
- **WHEN** user filters the budget list by a specific client
- **THEN** system displays only budgets linked to that client

#### Scenario: Search by budget number
- **WHEN** user searches for a budget number (e.g., "Budget #42")
- **THEN** system returns matching budgets

### Requirement: View budget snapshot
The system SHALL display a read-only view of a budget with all materialized snapshots and totals.

#### Scenario: Display budget snapshot
- **WHEN** user opens a budget
- **THEN** system displays all fields, job items, and materialized client/worker/tax snapshots

### Requirement: Preserve client and worker snapshot data
The system SHALL store a point-in-time copy of client and worker (issuer) data on each budget for historical accuracy.

#### Scenario: Client snapshot materialization
- **WHEN** a budget is created
- **THEN** system captures the client's name, taxId, phone, email, and address fields into clientSnapshot; changes to the client definition later do not affect this budget

#### Scenario: Worker snapshot materialization
- **WHEN** a budget is created
- **THEN** system captures the worker's (issuer's) name, taxId, phone, email, and address fields into workerSnapshot; changes to the worker definition later do not affect this budget
