## MODIFIED Requirements

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
