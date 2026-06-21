## 1. Database and domain foundation

- [x] 1.1 Add additive SQL migration(s) for `workers` table with shared profile fields (`name`, `tax_id`, `phone`, `email`, `is_active`, timestamps) and structured work/billing address fields (`street`, `city`, `postal_code`, `billing_street`, `billing_city`, `billing_postal_code`).
- [x] 1.2 Add API-side worker entity and repository mapping aligned with existing PostgreSQL naming conventions and active-record filtering patterns.
- [x] 1.3 Introduce abstract domain `Profile` parent and refactor worker/client domain entities to inherit shared fields/behavior without introducing a physical shared base table.
- [x] 1.4 Keep client-specific fields (`type`) isolated to client domain model while preserving existing client persistence and endpoint behavior.

## 2. Worker API contracts and behavior

- [x] 2.1 Create worker DTOs/types for create/update/response with validation rules for required identity/work-address fields and optional contact fields.
- [x] 2.2 Implement `POST /api/workers` with billing default-to-work behavior when billing fields are omitted.
- [x] 2.3 Implement `GET /api/workers` and `GET /api/workers/:id` with active-only retrieval, pagination, and optional case-insensitive name search.
- [x] 2.4 Implement `PATCH /api/workers/:id` with billing completeness validation (all-or-none triplet) and structured address update semantics.
- [x] 2.5 Implement `DELETE /api/workers/:id` as archive/soft-delete (`is_active=false`) returning HTTP 204 for successful archive.
- [x] 2.6 Ensure worker endpoints are usable without auth/session dependencies and avoid introducing credential/token fields in this iteration.

## 3. Web and shared service integration

- [x] 3.1 Add worker shared web types mirroring API payload/response contracts, including structured work and billing address fields.
- [x] 3.2 Add web server handlers/services for worker CRUD/list operations following current client-service patterns.
- [x] 3.3 Extract or define reusable profile UI building blocks from current client-management screens (shared form sections, structured address inputs, list interactions, validation presentation).
- [x] 3.4 Add worker management UI flows (list/create/edit/archive) by reusing shared profile UI building blocks while keeping worker-specific fields explicit.
- [x] 3.5 Ensure worker UI does not include auth flows and does not assume invoice snapshot behavior.

## 4. Client-management alignment

- [x] 4.1 Refactor client domain model to align with abstract `Profile` inheritance semantics while preserving current API behavior and response shape.
- [x] 4.2 Confirm client and worker naming/validation parity for shared fields (name, tax/contact fields, active status, structured addresses).
- [x] 4.3 Verify billing default/completeness semantics remain equivalent between clients and workers.

## 5. Verification and documentation

- [x] 5.1 Add/adjust automated tests for worker create/read/update/archive/list API behavior, including search and pagination.
- [x] 5.2 Add tests for billing rules: default-to-work and all-or-none billing triplet validation for workers (and parity checks where applicable).
- [x] 5.3 Add regression tests confirming client endpoints and client-specific `type` behavior remain unchanged after profile refactor.
- [x] 5.4 Update API documentation/OpenAPI examples to include worker endpoints and payloads.
- [x] 5.5 Run project checks (typecheck/tests/contract checks) and validate local smoke flows for worker and client management.
