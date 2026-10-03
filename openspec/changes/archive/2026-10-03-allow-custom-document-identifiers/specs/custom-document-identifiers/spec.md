## ADDED Requirements

### Requirement: Automatic identifiers remain the default
The system SHALL preserve the current automatic allocation flow when a document is created. The creation form SHALL start in automatic mode, with the next suggested identifier displayed. Budgets SHALL continue using the budget sequence, and invoices SHALL continue using the current-year invoice sequence.

#### Scenario: Create budget without custom identifier
- **WHEN** a user creates a budget and leaves the identifier unchanged
- **THEN** the system allocates the next budget sequence value and stores it as the budget identifier

#### Scenario: Create invoice without custom identifier
- **WHEN** a user creates an invoice and leaves the identifier unchanged
- **THEN** the system allocates the next invoice sequence value for the current year and stores the existing invoice identifier format

#### Scenario: Reset a custom identifier to automatic mode
- **WHEN** a user edits the suggested identifier during creation and then selects "Reset to automatic"
- **THEN** the form restores the original automatic suggestion and submits the document in automatic mode

### Requirement: Users can provide a custom identifier
The system SHALL allow a user to switch a budget or invoice creation form from automatic mode to custom mode and enter an identifier. The system SHALL provide an edit control for entering a custom identifier and a reset control for returning to automatic mode. Identifiers SHALL be stored as trimmed, non-empty text with a maximum length of 255 characters and SHALL reject control characters.

#### Scenario: Create budget with custom identifier
- **WHEN** a user enters `CLIENT-A/2026/04` as the budget identifier and submits the form
- **THEN** the system stores exactly that trimmed identifier instead of allocating it from the automatic sequence

#### Scenario: Edit an existing invoice identifier
- **WHEN** a user changes an invoice identifier to `INV-2026-0042` and saves the invoice
- **THEN** the system updates the invoice identifier while preserving the invoice's internal UUID

#### Scenario: Custom mode is explicit
- **WHEN** a user enters a custom identifier during creation
- **THEN** the system records the document's identifier source as `custom` rather than inferring it from the identifier value

#### Scenario: Reject invalid identifier
- **WHEN** a user submits an empty identifier, an identifier longer than 255 characters, or one containing a control character
- **THEN** the system rejects the request with a validation error and does not modify or create the document

### Requirement: Duplicate identifiers produce warnings but are confirmable
The system SHALL detect an existing identifier within the same document type and SHALL communicate a duplicate warning before completing an unconfirmed create or update. The system SHALL allow the user to explicitly confirm the duplicate and proceed.

#### Scenario: Warn before creating a duplicate budget
- **WHEN** a user submits a budget identifier already used by another budget without duplicate confirmation
- **THEN** the system returns a duplicate warning identifying the conflicting budget and does not create the budget

#### Scenario: Confirm duplicate invoice identifier
- **WHEN** a user confirms creation after receiving a duplicate invoice warning
- **THEN** the system creates the invoice with the requested identifier

#### Scenario: Duplicate across document types
- **WHEN** a user creates a budget with an identifier used by an invoice but not by another budget
- **THEN** the system does not report a same-type duplicate and allows the budget creation

#### Scenario: Update to an existing identifier
- **WHEN** a user changes a budget identifier to one used by another budget and confirms the duplicate warning
- **THEN** the system updates the budget while keeping its internal UUID unchanged

### Requirement: Internal document identity remains unique
The system SHALL continue to use the document UUID as the immutable unique identity for budgets and invoices. User-facing identifiers SHALL NOT be required to be unique by the database.

#### Scenario: Two budgets share an identifier
- **WHEN** two budgets are explicitly created with identifier `42`
- **THEN** both budgets are persisted with different UUIDs and the same user-facing identifier

### Requirement: Manual identifiers do not silently change automatic sequences
The system SHALL NOT advance or rewind an automatic sequence solely because a user supplies or edits a custom identifier. Editing an existing document identifier SHALL never modify sequence settings. Future automatic allocation SHALL continue from the configured sequence value.

#### Scenario: Custom identifier does not advance budget sequence
- **WHEN** the next automatic budget number is `42` and a user creates a custom budget numbered `100`
- **THEN** the next budget created without a custom identifier uses `42`

#### Scenario: Editing an identifier does not change the sequence
- **WHEN** a user changes an existing budget identifier from `42` to `CLIENT-A-01`
- **THEN** the budget identifier changes but the automatic budget sequence remains unchanged

### Requirement: Exported document names remain collision-safe
The system SHALL preserve the user-facing identifier in exported spreadsheet data and rendered document content. Exported PDF filenames SHALL include a stable internal-document suffix or equivalent collision-safe strategy so duplicate or sanitized identifiers cannot overwrite another exported document.

#### Scenario: Duplicate identifiers export separately
- **WHEN** two budgets with identifier `42` are exported
- **THEN** both PDFs are present as distinct files and both display identifier `42` in their content

#### Scenario: Sanitized identifiers collide
- **WHEN** identifiers `A/1` and `A-1` would produce the same sanitized filename
- **THEN** the export assigns distinct stable filenames to both PDFs

#### Scenario: Existing cloud export is renamed safely
- **WHEN** an already exported document's identifier changes
- **THEN** the export updates the file associated with that document UUID rather than creating an ambiguous replacement for another document
