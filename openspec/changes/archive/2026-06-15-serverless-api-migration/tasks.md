## 1. Runtime Foundation and API Compatibility

- [x] 1.1 Define serverless route structure for `POST/GET /api/clients` and `GET/PATCH/DELETE /api/clients/:id` in the web runtime.
- [x] 1.2 Implement shared request validation and error response mapping to preserve current REST contract behavior.
- [x] 1.3 Implement client-management service logic in serverless-compatible modules without changing endpoint semantics.
- [x] 1.4 Add contract verification tests that assert status codes and response shapes match current client-management expectations.

## 2. Managed Postgres Connectivity

- [x] 2.1 Select and document the managed free-tier Postgres provider and required environment variables.
- [x] 2.2 Implement production and local database connection configuration for serverless handlers.
- [x] 2.3 Validate data persistence by creating records, restarting local runtime, and confirming data remains accessible.
- [x] 2.4 Add connectivity failure handling and actionable diagnostics for misconfigured or unavailable database connections.

## 3. Swagger/OpenAPI Continuity

- [x] 3.1 Define OpenAPI source-of-truth approach compatible with serverless runtime (generated or static artifact).
- [x] 3.2 Implement Swagger UI exposure at `/api/docs` in local and deployed environments.
- [x] 3.3 Add verification checks to ensure documentation reflects current REST endpoints and payload contracts.

## 4. Local Workflow and Infrastructure Updates

- [x] 4.1 Update local startup commands to require only services necessary for serverless-oriented development and database connectivity.
- [x] 4.2 Update connectivity check scripts to validate web-to-API and API-to-database paths under the migrated runtime.
- [x] 4.3 Ensure default local development instructions only require database infrastructure.
- [x] 4.4 Update environment templates and onboarding steps for first-time local setup after migration.

## 5. Operational Safety Documentation

- [x] 5.1 Document free-tier limits, cold-start expectations, and usage monitoring points for ongoing operations.
- [x] 5.2 Document rollback procedure to previous stable deployment URL in case of critical regressions.
