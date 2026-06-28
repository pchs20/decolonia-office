## MODIFIED Requirements

### Requirement: Create a new budget
The system SHALL allow users to create a new budget with a client, optional notes, and an empty job items list. The issuer (worker) SHALL be automatically resolved from the configured primary worker without user selection.

#### Scenario: Successful budget creation
- **WHEN** user fills out the new budget form with required fields (client) and a primary worker is configured
- **THEN** system creates a budget with auto-assigned sequential number, the primary worker snapshot captured automatically, empty job items, and current timestamp

#### Scenario: Budget creation blocked with no primary worker
- **WHEN** a user opens the new budget form and no primary worker is configured in Settings
- **THEN** the system displays a blocking message indicating a primary worker must be configured, and the submit action is disabled

### Requirement: Edit budget header
The system SHALL allow users to edit the budget's client and notes after creation. The worker (issuer) field SHALL NOT be editable on the budget form.

#### Scenario: Update budget metadata
- **WHEN** user modifies the budget's client or notes fields in edit mode
- **THEN** system persists changes and updates the updatedAt timestamp
