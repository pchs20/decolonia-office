# Worker Profiles

## Purpose

Define worker profile requirements for invoice-issuer identity management and keep contracts compatible with future authentication work.

## Requirements

### Requirement: Worker profile data model with structured addresses
The system SHALL store worker profile records with shared profile fields and structured work/billing address fields suitable for invoice issuer data.

#### Scenario: Worker profile created with required identity and work address fields
- **WHEN** a user creates a worker profile with name, tax identifier, street, city, and postal code
- **THEN** the system stores the worker as an active profile with timestamps and optional contact fields

#### Scenario: Billing address defaults to work address when omitted
- **WHEN** a user creates or updates a worker profile without explicit billing street, billing city, and billing postal code fields
- **THEN** the system persists billing fields equal to the worker work address fields

#### Scenario: Billing address requires complete triplet when provided
- **WHEN** a user provides at least one billing field for a worker profile
- **THEN** the system requires billing street, billing city, and billing postal code to be provided together

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

### Requirement: Frontend provides worker management section reusing client patterns
The web app SHALL provide a workers management section for list/create/edit/archive operations and SHALL reuse client-management UI components and interaction patterns where semantics are shared.

#### Scenario: Workers section supports CRUD flows
- **WHEN** a user navigates to the workers section
- **THEN** they can list active workers, create worker records, edit worker records, and archive worker records

#### Scenario: Shared form/address components are reused
- **WHEN** worker forms are implemented
- **THEN** shared address and common profile field UI components are reused from existing client-management patterns where behavior is equivalent

#### Scenario: Worker-specific differences remain explicit
- **WHEN** worker and client forms diverge in domain-specific fields
- **THEN** those differences are implemented explicitly without breaking shared component behavior
