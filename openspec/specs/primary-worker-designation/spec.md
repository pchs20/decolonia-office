# Primary Worker Designation

## Purpose

Define the rules for designating exactly one active worker profile as the primary worker — the issuer identity automatically captured on all new commercial documents.

## Requirements

### Requirement: Designate a primary worker
The system SHALL allow users to mark exactly one active worker profile as the primary worker. The primary worker is the issuer identity automatically captured on new commercial documents.

#### Scenario: Set a worker as primary
- **WHEN** a user designates a worker profile as primary from the Workers settings tab
- **THEN** the system marks that worker as primary and unmarks any previously primary worker, ensuring at most one primary worker exists at any time

#### Scenario: Database enforces single primary worker
- **WHEN** the system attempts to set a second worker as primary concurrently
- **THEN** the database partial unique index rejects the operation, preventing two workers from being primary simultaneously

#### Scenario: Primary worker designation is visible in the worker list
- **WHEN** a user views the Workers settings tab
- **THEN** the primary worker is visually distinguished (e.g., a star or badge) in the list

#### Scenario: Primary worker snapshot auto-captured on new budget
- **WHEN** a user creates a new budget and a primary worker is configured
- **THEN** the system automatically captures the primary worker's current profile data as the worker snapshot on the budget without user interaction

#### Scenario: Primary worker snapshot auto-captured on new invoice
- **WHEN** a user creates a new invoice and a primary worker is configured
- **THEN** the system automatically captures the primary worker's current profile data as the worker snapshot on the invoice without user interaction

#### Scenario: Budget creation blocked when no primary worker is configured
- **WHEN** a user opens the new budget form and no primary worker is configured
- **THEN** the system renders a blocking informational message instructing the user to configure a primary worker in Settings, and the submit action is disabled

#### Scenario: Invoice creation blocked when no primary worker is configured
- **WHEN** a user opens the new invoice form and no primary worker is configured
- **THEN** the system renders a blocking informational message instructing the user to configure a primary worker in Settings, and the submit action is disabled
