## Why

The system currently models client records but has no first-class worker/user profile to represent your father (and future workers) as invoice issuers with stable billing data. Defining worker profiles now enables invoice workflows to use consistent issuer information while preparing a clean path for future authentication without implementing auth in this iteration.

## What Changes

- Introduce worker profiles as a new managed domain capability for invoice-related identity data.
- Define worker profile data fields that overlap with clients where appropriate: legal/display name, tax identifier, contact fields, active status, and timestamps.
- Require worker billing address support, aligned with the existing structured address model (`street`, `city`, `postalCode`, `billingStreet`, `billingCity`, `billingPostalCode`).
- Establish contract-level support for future auth integration by reserving worker/user identity semantics, while explicitly excluding authentication implementation from this change.
- Define behavior and validation expectations for worker create/read/update/archive flows similar to existing client management patterns.
- Keep refactoring concerns explicit: shared field concepts are in scope at the specification level, while concrete inheritance strategy and table/class refactor details are deferred to design and implementation tasks.

## Capabilities

### New Capabilities
- `worker-profiles`: Manage workers/users that provide issuer identity and billing information for invoices, with future auth-readiness but no auth implementation in this iteration.

### Modified Capabilities
- `client-management`: Clarify shared person/organization profile concepts and address-field alignment between clients and workers without changing existing client endpoint behavior in this iteration.

## Impact

- Affected API surface: new worker profile endpoints and request/response contracts; alignment of shared field naming with existing client contracts.
- Affected backend persistence: new worker-related storage and potential shared-profile modeling decisions to be finalized in design.
- Affected domain model: shared profile/address concepts reused across client and worker entities.
- Affected web app: future worker profile management screens/forms and invoice issuer selection/autofill integration points.
- Affected docs/spec artifacts: new worker capability spec plus client-management delta spec for shared requirement language.
