# 0002. Enforce layer boundaries and transport contracts

- Status: accepted
- Date: 2026-06-21
- Supersedes: none

## Context

After the migration from the legacy runtime and folder layout, the codebase adopted a layered design with explicit boundaries:

- `app/api/*` as HTTP adapters
- `src/application/*` for use cases and orchestration
- `src/domain/*` for business entities/value objects/exceptions
- `src/infrastructure/*` for concrete persistence and external integrations
- `src/api/*` for transport schemas, validators, mappers, and OpenAPI artifacts

During refactor iterations, multiple forms of drift appeared:

- application services importing concrete PostgreSQL repositories directly
- transport schema ambiguity (`workAddress`/`billingAddress` vs flat API payload fields)
- stale documentation/spec text describing obsolete NestJS/decorator paths and old folders

## Decision

1. **Dependency direction is strict and one-way**:
   - `domain` depends on nothing from application/api/infrastructure
   - `application` may depend on `domain` and outbound ports only
   - `infrastructure` implements application outbound ports
   - `app/api` composes use cases with concrete infrastructure adapters

2. **Repository access in use-cases must be via outbound interfaces**:
   - Use-case modules receive repository abstractions (`application/outbound/*`)
   - Concrete adapters (for example PostgreSQL) are injected at composition boundaries

3. **Transport contracts are flat and independent from domain value-object shape**:
   - Domain profile entities keep `workAddress` and `billingAddress` value objects
   - REST responses and OpenAPI schemas use flat address fields:
     `street`, `city`, `postalCode`, `billingStreet`, `billingCity`, `billingPostalCode`

4. **OpenAPI is source-controlled as code artifact**:
   - The OpenAPI builder module in `src/api/openapi/openapi.ts` is the contract source of truth
   - Swagger UI reflects that artifact at `/api/docs` and `/api/docs/openapi`

5. **Local migration safety and deploy discipline**:
   - Local development can auto-run pending SQL migrations on localhost-backed DB URLs
   - Hosted/staging/production migrations remain explicit manual operations

## Consequences

Positive:

- Use-cases are testable in isolation with repository mocks.
- Runtime swaps (Postgres adapter changes or future persistence adapters) do not force application-level rewrites.
- API consumers get a stable, implementation-agnostic flat contract.
- Documentation and OpenAPI remain aligned with runtime behavior.

Negative:

- More composition plumbing is required in API routes.
- There is deliberate duplication between domain and transport shape (value objects vs flat payload fields).

Neutral:

- Future changes (auth integration, multi-tenant persistence, additional adapters) should extend these boundaries rather than bypass them.
