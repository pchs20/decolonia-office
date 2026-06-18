## 1. Database and backend model updates

- [x] 1.1 Create and run a migration that adds `street`, `city`, `postal_code`, `billing_street`, `billing_city`, and `billing_postal_code` columns to `clients` with safe defaults/nullability for rollout.
- [x] 1.2 Keep migration forward-only (no backfill), and define defaults/nullable behavior for pre-existing rows.
- [x] 1.3 Update API-side client entity, DTOs, and validation rules to replace free-text address fields with structured work and billing fields.
- [x] 1.4 Update API service logic for create/update paths, including same-as-work fallback mapped to structured billing fields.
- [x] 1.5 Introduce an `Address` value object in the domain layer and map client `workAddress` / `billingAddress` relations to flattened columns.

## 2. Web app and contract alignment

- [x] 2.1 Update shared client types and web server adapters to consume/return structured work and billing address fields.
- [x] 2.6 Expose client `workAddress` and `billingAddress` object relations in shared app types while keeping payload and persistence flattening.
- [x] 2.2 Update client form UI and validation messages to collect and validate separate work and billing street, city, and postal code fields.
- [x] 2.3 Update client list/detail rendering to use explicit city and postal code fields from structured data and remove city-from-address parsing.
- [x] 2.4 Update OpenAPI definitions and API documentation examples to reflect the new request/response shape.
- [x] 2.5 Keep same-as-work behavior by copying work values into billing fields at write time, without inferring values from free-text address parsing.

## 3. Verification and rollout safety

- [x] 3.1 Update and run tests for API validation, create/update behavior, and frontend integration expectations.
- [x] 3.2 Add migration verification checks for forward-only rollout behavior (existing rows tolerated, new writes validated).
- [x] 3.3 Execute contract checks and local smoke tests for create, update, list, and detail flows with new address fields.
- [x] 3.4 Remove leftover legacy `address` parsing assumptions in code paths once all checks pass.
