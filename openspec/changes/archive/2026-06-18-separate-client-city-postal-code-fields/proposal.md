## Why

Client addresses are currently stored as a single free-text field, and the UI derives city by splitting the address string. This is brittle, limits validation quality, and makes search/filter/reporting by location unreliable.

## What Changes

- Split the current client address structure into explicit fields for `street`, `city`, and `postalCode`.
- Split billing address into explicit fields for `billingStreet`, `billingCity`, and `billingPostalCode`.
- Model client addresses in the domain as two `Address` value objects (`workAddress` and `billingAddress`) while keeping persistence flattened.
- Keep billing fallback behavior conceptually unchanged: if billing fields are omitted, they default to work address fields.
- Update API contracts, persistence model, validation rules, and frontend forms/detail/list views to use explicit work and billing fields without parsing or inference.
- Use a forward-only rollout for new writes without requiring data backfill of legacy rows.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `client-management`: Client creation, update, retrieval, listing, and frontend presentation now require first-class work and billing address fields (`street`, `city`, `postalCode`, `billingStreet`, `billingCity`, `billingPostalCode`) instead of parsing location from free-text addresses.
- `client-management`: Client creation, update, retrieval, and listing represent two address relations in code (`workAddress`, `billingAddress`) mapped to flattened storage columns (`street`, `city`, `postalCode`, `billingStreet`, `billingCity`, `billingPostalCode`).

## Impact

- Affected API surface: client DTOs, request/response schemas, OpenAPI docs.
- Affected backend persistence: `clients` table schema, entity mapping, and migration scripts.
- Affected frontend: client form fields, list table city rendering, and detail page address sections.
- Affected tests/contracts: API validation tests, service tests, and any checks asserting address payload shape.
