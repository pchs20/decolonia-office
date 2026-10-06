## MODIFIED Requirements

### Requirement: Edit invoice header
The system SHALL allow users to edit the invoice's notes and document-owned client and worker snapshot values after creation. The linked client and worker identifiers SHALL NOT be editable on the invoice form.

#### Scenario: Update invoice metadata
- **WHEN** user modifies the invoice's notes fields in edit mode
- **THEN** system persists changes and updates the updatedAt timestamp

#### Scenario: Edit invoice client snapshot
- **WHEN** user expands the client snapshot section, modifies one or more client fields, and saves
- **THEN** system persists the complete modified client snapshot on the invoice without changing the linked client identifier

#### Scenario: Edit invoice worker snapshot
- **WHEN** user expands the worker snapshot section, modifies one or more worker fields, and saves
- **THEN** system persists the complete modified worker snapshot on the invoice without changing the linked worker identifier

#### Scenario: Set issued date
- **WHEN** user enters or updates the issued date field
- **THEN** system stores the date (optional)

### Requirement: Preserve client and worker snapshot data
The system SHALL store a point-in-time copy of client and worker (issuer) data on each invoice for historical accuracy. Later changes to source records SHALL NOT automatically modify the invoice snapshot.

#### Scenario: Client snapshot materialization
- **WHEN** an invoice is created
- **THEN** system captures the client's name, taxId, phone, email, and address fields into clientSnapshot; changes to the client definition later do not affect this invoice

#### Scenario: Worker snapshot materialization
- **WHEN** an invoice is created
- **THEN** system captures the worker's (issuer's) name, taxId, phone, email, bank account, and address fields into workerSnapshot; changes to the worker definition later do not affect this invoice

#### Scenario: Explicitly apply latest client information
- **WHEN** a user activates the invoice form's apply-latest client action and confirms the read-only changed-field summary
- **THEN** system immediately replaces the local invoice client snapshot with the current linked client information, and persists it only when the user saves the invoice

#### Scenario: Explicitly apply latest worker information
- **WHEN** a user activates the invoice form's apply-latest worker action and confirms the read-only changed-field summary
- **THEN** system immediately replaces the local invoice worker snapshot with the current linked worker information, and persists it only when the user saves the invoice
