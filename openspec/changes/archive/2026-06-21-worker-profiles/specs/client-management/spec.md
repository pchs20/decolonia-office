## ADDED Requirements

### Requirement: Client profile semantics align with shared Profile model
Client-management requirements SHALL remain compatible with the shared abstract `Profile` model used by both clients and workers.

#### Scenario: Shared field conventions remain consistent
- **WHEN** client and worker profile capabilities are used together
- **THEN** shared fields (name, tax identifier, contact fields, active status, timestamps, work address, billing address) use consistent semantics and naming conventions

#### Scenario: Client-specific behavior remains preserved
- **WHEN** client-management operations are executed after introducing worker profiles
- **THEN** existing client-specific behavior, including client `type` and client endpoint contracts, remains unchanged

### Requirement: Client and worker address semantics stay aligned
Client-management address behavior SHALL remain aligned with worker-profile address behavior for structured work and billing fields.

#### Scenario: Billing default behavior is equivalent across profiles
- **WHEN** billing address fields are omitted for client or worker profiles
- **THEN** billing street, billing city, and billing postal code default to the corresponding work address fields for both profile types

#### Scenario: Billing completeness validation is equivalent across profiles
- **WHEN** any billing field is provided in client or worker profile payloads
- **THEN** all billing address fields are required together for both profile types
