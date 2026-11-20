## ADDED Requirements

### Requirement: New budgets have an editable delivered date
The budget creation form SHALL initialize the delivered date to the user's current calendar date, SHALL allow the user to change it through a localized calendar date picker, and SHALL require a valid date before submission. The picker SHALL display dates as `DD/MM/YYYY` and start weeks on Monday.

#### Scenario: New budget defaults delivered date to today
- **WHEN** a user opens the new budget form
- **THEN** the delivered date field is populated with today's local calendar date

#### Scenario: User changes the delivered date
- **WHEN** a user selects a different valid date in the budget form
- **THEN** the selected date is used when the budget is created

#### Scenario: User resets delivered date to today
- **WHEN** a user activates the budget form's "Set today" action
- **THEN** the delivered date field is reset to today's local calendar date

#### Scenario: Budget cannot be submitted without a delivered date
- **WHEN** the delivered date is empty or invalid at submission time
- **THEN** the form prevents submission and displays a validation message

### Requirement: New invoices have an editable issued date
The invoice creation form SHALL initialize the issued date to the user's current calendar date, SHALL allow the user to change it through a localized calendar date picker, and SHALL require a valid date before submission. The picker SHALL display dates as `DD/MM/YYYY` and start weeks on Monday.

#### Scenario: New invoice defaults issued date to today
- **WHEN** a user opens the new invoice form
- **THEN** the issued date field is populated with today's local calendar date

#### Scenario: User changes the issued date
- **WHEN** a user selects a different valid date in the invoice form
- **THEN** the selected date is used when the invoice is created

#### Scenario: User resets issued date to today
- **WHEN** a user activates the invoice form's "Set today" action
- **THEN** the issued date field is reset to today's local calendar date

#### Scenario: Invoice cannot be submitted without an issued date
- **WHEN** the issued date is empty or invalid at submission time
- **THEN** the form prevents submission and displays a validation message

### Requirement: Business dates remain editable
The budget and invoice edit forms SHALL load the stored delivered or issued date, SHALL allow it to be changed, and SHALL require a valid date before saving. The UI SHALL provide a "Set today" action and SHALL not provide a clear-date action.

#### Scenario: Existing business date is loaded
- **WHEN** a user opens an existing budget or invoice for editing
- **THEN** the form displays its stored delivered or issued date

#### Scenario: Existing business date is updated
- **WHEN** a user changes the date and saves the document
- **THEN** the new date is persisted without changing the document's creation date

#### Scenario: Date picker uses the agreed calendar presentation
- **WHEN** a user opens the delivered or issued date picker
- **THEN** the control displays `DD/MM/YYYY`, shows localized calendar labels, and lays out weeks from Monday through Sunday

### Requirement: Commercial document form layout separates client selection
Budget and invoice forms SHALL place the document number and delivered/issued date controls in the same row and SHALL place the client field in a separate row below them.

#### Scenario: Budget form date and client layout
- **WHEN** a user opens a budget form
- **THEN** the number and delivered date share a row and the client field appears on the following row

#### Scenario: Invoice form date and client layout
- **WHEN** a user opens an invoice form
- **THEN** the number and issued date share a row and the client field appears on the following row

### Requirement: Business dates are persisted during document creation and update
The document creation and update flows SHALL transmit selected business dates to the budget and invoice APIs and SHALL preserve them as calendar dates. Domain entities, API responses, and persisted records SHALL always contain a business date.

#### Scenario: Budget creation persists delivered date
- **WHEN** a budget is created through the UI with a selected delivered date
- **THEN** the budget response and persisted record contain that delivered date

#### Scenario: Invoice creation persists issued date
- **WHEN** an invoice is created through the UI with a selected issued date
- **THEN** the invoice response and persisted record contain that issued date

#### Scenario: Creation rejects a missing business date
- **WHEN** a document creation request omits or supplies an invalid business date
- **THEN** the application rejects the request before persistence

#### Scenario: Duplication assigns a new business date
- **WHEN** a budget or invoice is duplicated
- **THEN** the new document receives today's business date rather than inheriting the source document's date

#### Scenario: Import normalizes a missing business date
- **WHEN** an imported record has no delivered or issued date
- **THEN** the import assigns the record's creation date before persistence

### Requirement: Read-only document views show creation and business dates
The read-only budget and invoice views SHALL display both the document creation date and its relevant non-null business date.

#### Scenario: Budget view shows both dates
- **WHEN** a user views a budget with a delivered date
- **THEN** the view shows its created date and delivered date as separate labeled values

#### Scenario: Invoice view shows both dates
- **WHEN** a user views an invoice with an issued date
- **THEN** the view shows its created date and issued date as separate labeled values

### Requirement: Existing home page and PDF date semantics remain stable
The home page SHALL continue to use document creation dates for its document activity timestamps. Budget and invoice PDFs SHALL use their mandatory delivered or issued date.

#### Scenario: Home page uses creation date
- **WHEN** a document's business date differs from its creation date
- **THEN** the home page displays the creation date

#### Scenario: PDF uses the stored business date
- **WHEN** a budget or invoice is exported
- **THEN** the corresponding PDF displays its stored delivered or issued date

### Requirement: Existing business dates are backfilled and made mandatory
The database migration SHALL populate every null budget delivered date and invoice issued date from its row's creation timestamp, SHALL fail rather than invent a value when a required creation timestamp is missing, and SHALL enforce `NOT NULL` on both business-date columns. The migration SHALL not add a database default.

#### Scenario: Existing null values are backfilled
- **WHEN** the migration runs against documents with null business dates
- **THEN** budget delivered dates and invoice issued dates are populated from their respective creation timestamps

#### Scenario: Database enforces the invariant
- **WHEN** the migration completes successfully
- **THEN** both business-date columns reject null values

#### Scenario: Migration does not hide incomplete source data
- **WHEN** a document has a null creation timestamp needed for backfill
- **THEN** the migration fails before enforcing the constraint instead of inventing a business date
