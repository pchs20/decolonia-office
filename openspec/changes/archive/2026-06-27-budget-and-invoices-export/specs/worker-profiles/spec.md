## MODIFIED Requirements

### Requirement: Worker profile data model with structured addresses
The system SHALL store worker profile records with shared profile fields, structured work/billing address fields, and an optional bank account number suitable for invoice payment information.

#### Scenario: Worker profile created with required identity and work address fields
- **WHEN** a user creates a worker profile with name, tax identifier, street, city, and postal code
- **THEN** the system stores the worker as an active profile with timestamps and optional contact fields

#### Scenario: Billing address defaults to work address when omitted
- **WHEN** a user creates or updates a worker profile without explicit billing street, billing city, and billing postal code fields
- **THEN** the system persists billing fields equal to the worker work address fields

#### Scenario: Billing address requires complete triplet when provided
- **WHEN** a user provides at least one billing field for a worker profile
- **THEN** the system requires billing street, billing city, and billing postal code to be provided together

#### Scenario: Bank account can be set on worker profile
- **WHEN** a user provides a bank account number (e.g., IBAN) when creating or updating a worker profile
- **THEN** the system stores the bank account number on the worker profile

#### Scenario: Bank account is optional
- **WHEN** a user creates or updates a worker profile without providing a bank account number
- **THEN** the system accepts the profile without a bank account number (stored as null)

## ADDED Requirements

### Requirement: Worker bank account materializes into worker snapshot
The system SHALL include `bankAccount` from the worker profile when materializing a `WorkerSnapshot` at document creation time.

#### Scenario: Bank account present in snapshot when worker has one
- **WHEN** a budget or invoice is created and the selected worker has a bank account set
- **THEN** the materialized `WorkerSnapshot` includes the bank account value

#### Scenario: Bank account null in snapshot when worker has none
- **WHEN** a budget or invoice is created and the selected worker has no bank account
- **THEN** the materialized `WorkerSnapshot` has `bankAccount` as null

### Requirement: Frontend exposes bank account field in worker settings form
The web app SHALL include a bank account input field in the worker profile create and edit forms.

#### Scenario: Bank account field visible in worker form
- **WHEN** a user opens the worker create or edit form
- **THEN** a bank account input field is present and accepts free text (IBAN format not validated by the system)

#### Scenario: Bank account field saves and restores correctly
- **WHEN** a user enters a bank account and saves the worker profile
- **THEN** the value is persisted and pre-populated when the user reopens the edit form
