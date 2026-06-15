## Why

The platform needs a production-ready architecture that stays free-tier friendly while preserving REST behavior, iPad PWA usage, and data persistence. Standardizing on a single serverless runtime reduces operational overhead and avoids parallel maintenance paths.

## What Changes

- Standardize the API runtime on serverless REST endpoints in the web application deployable on free tiers.
- Adopt a free managed persistent database strategy suitable for low-traffic production use without paid infrastructure.
- Preserve the existing client-management REST contract so current web flows continue to work with minimal functional changes.
- Define how API documentation (Swagger/OpenAPI) remains available after runtime migration.
- Update local development and verification workflows so frontend and REST API can still be tested reliably in local environments.
- Defer document export destination work (including Google Drive integration) to a future dedicated change once document workflows are implemented.

## Capabilities

### New Capabilities
- `serverless-rest-runtime`: Define requirements for hosting, routing, and running the REST API on a serverless runtime while maintaining production usability on free tiers.

### Modified Capabilities
- `platform-bootstrap-and-local-connectivity`: Update environment/bootstrap requirements to support local testing and connectivity checks in the new serverless-oriented architecture.
- `swagger-ui`: Update API documentation requirements so OpenAPI/Swagger remains accessible after moving away from NestJS runtime-coupled docs.

## Impact

- Affected code: apps/web API/runtime modules, environment/config handling, deployment scripts and docs.
- APIs: REST resources remain, but implementation and hosting model change; documentation exposure path may change.
- Dependencies/systems: reduced dependency on self-hosted infra components for production; document export integrations remain deferred.
- Operations: free-tier deployment constraints (cold starts, quotas, limits) become explicit non-functional constraints to manage in design and tasks.
