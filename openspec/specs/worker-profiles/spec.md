# Worker Profiles

## Purpose

Define worker profile requirements for invoice-issuer identity management and keep contracts compatible with future authentication work.

## Requirements

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

### Requirement: Worker profiles follow shared domain inheritance semantics
The domain model SHALL define an abstract `Profile` parent with shared fields, and worker profiles SHALL inherit shared attributes and behavior from that parent.

#### Scenario: Worker domain entity inherits shared profile fields
- **WHEN** worker profile domain entities are defined in code
- **THEN** shared fields (identity, contact, active status, timestamps, work address, billing address) are inherited from `Profile` instead of duplicated in worker-specific declarations

#### Scenario: Worker-specific fields remain in worker entity
- **WHEN** worker profile behavior requires fields not part of shared profile semantics
- **THEN** those fields are defined on the worker entity while inherited shared fields remain in `Profile`

### Requirement: Worker profile management API
The system SHALL provide REST endpoints to create, retrieve, update, archive, and list active worker profiles.

#### Scenario: Create worker profile
- **WHEN** a valid `POST /api/workers` request is submitted
- **THEN** the system creates a worker profile and returns HTTP 201 with the created profile payload

#### Scenario: Retrieve active worker profile by id
- **WHEN** a valid `GET /api/workers/:id` request targets an active worker profile
- **THEN** the system returns HTTP 200 with the worker profile payload

#### Scenario: Update active worker profile
- **WHEN** a valid `PATCH /api/workers/:id` request is submitted for an active worker profile
- **THEN** the system applies requested changes and returns HTTP 200 with the updated profile payload

#### Scenario: Archive worker profile
- **WHEN** a valid `DELETE /api/workers/:id` request is submitted for an active worker profile
- **THEN** the system marks the profile inactive and returns HTTP 204

#### Scenario: Set worker as primary via API
- **WHEN** a valid `PATCH /api/workers/:id` request includes `isPrimary: true` for an active worker profile
- **THEN** the system atomically unsets the current primary worker (if any), sets the target worker as primary, and returns HTTP 200 with the updated profile payload

#### Scenario: Retrieve primary worker
- **WHEN** a valid `GET /api/workers` request is made with a `primary=true` query parameter
- **THEN** the system returns HTTP 200 with the single primary worker profile, or an empty result if none is configured

#### Scenario: List active worker profiles with pagination and search
- **WHEN** a `GET /api/workers?page=1&limit=10&search=<name>` request is submitted
- **THEN** the system returns HTTP 200 with paginated active worker profiles filtered by case-insensitive name match when search is provided

### Requirement: Worker profiles remain auth-ready without implementing authentication
The worker profile capability SHALL preserve fields and contracts suitable for future authentication linkage, while this iteration MUST NOT require authentication features for worker management.

#### Scenario: Worker API is usable without auth flow dependencies
- **WHEN** worker profile operations are executed in this iteration
- **THEN** they do not depend on login, credential, token, or session features

#### Scenario: Future auth linkage can be added without breaking worker identity fields
- **WHEN** a later change introduces authentication
- **THEN** existing worker identity/contact fields remain compatible and do not require breaking field renames

### Requirement: Worker profile management UI
The system SHALL provide a management interface for worker profiles accessible from the Settings page under a dedicated Workers tab. The Workers tab SHALL be the fifth tab in the Settings catalog screen.

#### Scenario: Navigate to workers via Settings
- **WHEN** a user navigates to Settings and selects the Workers tab
- **THEN** the system displays the list of active worker profiles with an option to add, edit, delete, and set primary

#### Scenario: Workers tab absent from main navigation
- **WHEN** a user views the main application navigation bar
- **THEN** no Workers link is visible; Workers is only accessible via Settings

#### Scenario: Create worker from settings
- **WHEN** a user clicks the add worker action from the Workers settings tab
- **THEN** the system navigates to `/settings/workers/new` where the worker creation form is displayed

#### Scenario: Edit worker from settings
- **WHEN** a user clicks the edit action on a worker in the Workers settings tab
- **THEN** the system navigates to `/settings/workers/:id/edit` where the worker edit form is displayed

#### Scenario: Delete worker from settings
- **WHEN** a user clicks the delete action on a non-primary worker
- **THEN** the system soft-deletes the worker profile and removes it from the list

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
