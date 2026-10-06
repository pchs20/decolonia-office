## MODIFIED Requirements

### Requirement: Add job items to budget
The system SHALL allow users to add, edit, remove, and reorder job items (work line items) from a budget. Job-item titles SHALL support intentional plain-text line breaks and SHALL not be limited to 255 characters.

#### Scenario: Add a job item
- **WHEN** user clicks "Add Item" and enters a title, including optional intentional line breaks, description, optional quantity, and optional unitPrice
- **THEN** system appends the job item to the budget's items list with auto-assigned position number

#### Scenario: Edit job item pricing
- **WHEN** user updates quantity, unitPrice, or totalPrice fields on an existing item
- **THEN** system stores the changes; subtotal, tax, and total recalculate

#### Scenario: Preserve multiline budget title
- **WHEN** a user saves a budget job item with an intentional multiline title
- **THEN** the budget item retains the complete title and line breaks in its detail view and PDF export

#### Scenario: Remove job item
- **WHEN** user clicks "Remove" on a job item
- **THEN** system deletes the item and renumbers remaining positions

#### Scenario: Move job item up within budget
- **WHEN** user clicks "move up" on a job item that is not first in the list
- **THEN** system swaps that item's position with the one above it and the table reflects the updated order

#### Scenario: Move job item down within budget
- **WHEN** user clicks "move down" on a job item that is not last in the list
- **THEN** system swaps that item's position with the one below it and the table reflects the updated order
