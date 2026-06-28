## MODIFIED Requirements

### Requirement: Create a new invoice
The system SHALL allow users to create a new invoice with a client, optional notes, optional source budget linkage, and an empty job items list. The issuer (worker) SHALL be automatically resolved from the configured primary worker without user selection.

#### Scenario: Successful invoice creation
- **WHEN** user fills out the new invoice form with required fields (client) and a primary worker is configured
- **THEN** system creates an invoice with auto-assigned year-scoped sequential number, the primary worker snapshot captured automatically, empty job items, and current timestamp

#### Scenario: Invoice creation blocked with no primary worker
- **WHEN** a user opens the new invoice form and no primary worker is configured in Settings
- **THEN** the system displays a blocking message indicating a primary worker must be configured, and the submit action is disabled

### Requirement: Edit invoice header
The system SHALL allow users to edit the invoice's client and notes after creation. The worker (issuer) field SHALL NOT be editable on the invoice form.

#### Scenario: Update invoice metadata
- **WHEN** user modifies the invoice's client or notes fields in edit mode
- **THEN** system persists changes and updates the updatedAt timestamp
