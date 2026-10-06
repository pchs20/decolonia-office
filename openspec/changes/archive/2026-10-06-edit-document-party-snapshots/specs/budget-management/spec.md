## MODIFIED Requirements

### Requirement: Edit budget header
The system SHALL allow users to edit the budget's notes and document-owned client and worker snapshot values after creation. The linked client and worker identifiers SHALL NOT be editable on the budget form.

#### Scenario: Update budget metadata
- **WHEN** user modifies the budget's notes fields in edit mode
- **THEN** system persists changes and updates the updatedAt timestamp

#### Scenario: Edit budget client snapshot
- **WHEN** user expands the client snapshot section, modifies one or more client fields, and saves
- **THEN** system persists the complete modified client snapshot on the budget without changing the linked client identifier

#### Scenario: Edit budget worker snapshot
- **WHEN** user expands the worker snapshot section, modifies one or more worker fields, and saves
- **THEN** system persists the complete modified worker snapshot on the budget without changing the linked worker identifier

#### Scenario: Set delivered date
- **WHEN** user enters or updates the delivered date field
- **THEN** system stores the date (optional)

### Requirement: Preserve client and worker snapshot data
The system SHALL store a point-in-time copy of client and worker (issuer) data on each budget for historical accuracy. Later changes to source records SHALL NOT automatically modify the budget snapshot.

#### Scenario: Client snapshot materialization
- **WHEN** a budget is created
- **THEN** system captures the client's name, taxId, phone, email, and address fields into clientSnapshot; changes to the client definition later do not affect this budget

#### Scenario: Worker snapshot materialization
- **WHEN** a budget is created
- **THEN** system captures the worker's (issuer's) name, taxId, phone, email, bank account, and address fields into workerSnapshot; changes to the worker definition later do not affect this budget

#### Scenario: Explicitly apply latest client information
- **WHEN** a user activates the budget form's apply-latest client action and confirms the read-only changed-field summary
- **THEN** system immediately replaces the local budget client snapshot with the current linked client information, and persists it only when the user saves the budget

#### Scenario: Explicitly apply latest worker information
- **WHEN** a user activates the budget form's apply-latest worker action and confirms the read-only changed-field summary
- **THEN** system immediately replaces the local budget worker snapshot with the current linked worker information, and persists it only when the user saves the budget
