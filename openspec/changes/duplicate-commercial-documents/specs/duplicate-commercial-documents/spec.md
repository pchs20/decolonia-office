## ADDED Requirements

### Requirement: Duplicate a budget as a new draft

The system SHALL allow an authenticated user to duplicate an existing budget into a new independent budget. The new budget MUST receive a new database identifier and a number allocated by the existing budget sequence.

#### Scenario: Duplicate a budget with line items

- **WHEN** the user confirms duplication of an existing budget
- **THEN** the system creates a new budget with a fresh identifier and newly allocated budget number
- **AND** copies the source budget's client reference, worker reference, client snapshot, worker snapshot, tax snapshot, notes, pricing mode, manual subtotal, and all line-item values and positions
- **AND** creates each copied line item with a fresh identifier associated with the new budget
- **AND** sets `deliveredAt` to null
- **AND** sets `createdAt` and `updatedAt` to the creation time of the new budget

#### Scenario: Duplicate a budget without line items

- **WHEN** the user confirms duplication of a budget that has no line items
- **THEN** the system creates a new budget with the copied document values and no line items
- **AND** assigns a fresh identifier and budget number
- **AND** sets `deliveredAt` to null

#### Scenario: Budget source cannot be found

- **WHEN** the user requests duplication for a budget identifier that does not exist
- **THEN** the system returns a not-found error
- **AND** does not create a budget or consume a document number

### Requirement: Duplicate an invoice as a new draft

The system SHALL allow an authenticated user to duplicate an existing invoice into a new independent invoice. The new invoice MUST receive a new database identifier and a number allocated by the current year's invoice sequence.

#### Scenario: Duplicate an invoice with a source budget

- **WHEN** the user confirms duplication of an invoice linked to a budget
- **THEN** the system creates a new invoice with a fresh identifier and a new number using the current year format
- **AND** copies the source invoice's client reference, worker reference, client snapshot, worker snapshot, tax snapshot, notes, pricing mode, manual subtotal, and all line-item values and positions
- **AND** creates each copied line item with a fresh identifier associated with the new invoice
- **AND** preserves the source invoice's `sourceBudgetId`
- **AND** sets `issuedAt` to null
- **AND** sets `createdAt` and `updatedAt` to the creation time of the new invoice

#### Scenario: Duplicate an invoice without a source budget

- **WHEN** the user confirms duplication of an invoice without a source budget
- **THEN** the system creates a new invoice with `sourceBudgetId` set to null
- **AND** assigns a fresh identifier and a number from the current year's invoice sequence
- **AND** sets `issuedAt` to null

#### Scenario: Duplicate an invoice from a previous year

- **WHEN** the user confirms duplication of an invoice whose original number belongs to a previous year
- **THEN** the system allocates the new invoice number from the current year's sequence
- **AND** formats the new number using the current year

#### Scenario: Invoice source cannot be found

- **WHEN** the user requests duplication for an invoice identifier that does not exist
- **THEN** the system returns a not-found error
- **AND** does not create an invoice or consume a document number

### Requirement: Preserve source independence and atomicity

The duplication operation MUST produce an independent aggregate and MUST be atomic: either the new parent document and all copied line items are persisted, or none of them are persisted.

#### Scenario: Editing the duplicate does not alter the source

- **WHEN** a user edits a duplicated document or one of its line items
- **THEN** the original document and its line items remain unchanged

#### Scenario: Child persistence fails

- **WHEN** persistence of any copied line item fails during duplication
- **THEN** the system rolls back the new parent document and every copied line item
- **AND** returns an error to the caller

### Requirement: Expose duplication actions in the user interface

The system SHALL expose a localized `Duplicate` action for budgets and invoices in list-row actions and detail-page actions. The action MUST require confirmation before sending the duplication request and MUST prevent repeated submission while the request is pending.

#### Scenario: User confirms duplication from a list

- **WHEN** the user selects Duplicate for a budget or invoice in its list and confirms the prompt
- **THEN** the client sends the corresponding duplication request to the server
- **AND** navigates to the newly created document in edit mode after success

#### Scenario: User cancels duplication

- **WHEN** the user selects Duplicate and cancels the confirmation prompt
- **THEN** the client does not send a duplication request
- **AND** remains on the current page

#### Scenario: User duplicates from a detail page

- **WHEN** the user selects Duplicate for a budget or invoice on its detail page and confirms
- **THEN** the client sends the corresponding duplication request
- **AND** navigates to the new document in edit mode after success

#### Scenario: Duplication fails

- **WHEN** the duplication request fails
- **THEN** the client remains on the source document page or list
- **AND** displays a localized error
- **AND** re-enables the Duplicate action

### Requirement: Keep API and documentation contracts aligned

The system SHALL expose duplication through authenticated type-specific endpoints with no request body and a response containing the newly created document. The source-controlled API schema and OpenAPI documentation MUST describe both endpoints.

#### Scenario: Budget duplication API request

- **WHEN** an authenticated client sends `POST /api/budgets/{id}/duplicate` without a request body
- **THEN** the API returns HTTP 201 with the newly created budget

#### Scenario: Invoice duplication API request

- **WHEN** an authenticated client sends `POST /api/invoices/{id}/duplicate` without a request body
- **THEN** the API returns HTTP 201 with the newly created invoice

#### Scenario: Unauthenticated duplication request

- **WHEN** an unauthenticated client sends either duplication request
- **THEN** middleware rejects the request according to the existing API authentication contract
