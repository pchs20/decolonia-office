## Why

Developers need a centralized, interactive way to explore API endpoints, understand request/response contracts, and test the backend in isolation during development. Currently, API documentation is implicit in code, making it difficult to verify contracts visually or perform ad-hoc testing without external tools.

## What Changes

- Add OpenAPI documentation generation to the NestJS backend
- Serve interactive Swagger UI at `/api/docs` for visual endpoint exploration and manual testing
- Enable developers to make test requests directly from the Swagger UI interface during development
- Provide comprehensive documentation of all endpoints, schemas, error responses, and authentication flows

## Capabilities

### New Capabilities
- `swagger-ui`: Interactive API documentation and testing interface for the backend, served at `/api/docs` (public access during development).

### Modified Capabilities
<!-- No existing spec requirements are changing; this is purely additive -->

## Impact

- **Backend (NestJS API)**: Add @nestjs/swagger integration with decorators on controllers and DTOs for comprehensive OpenAPI schema generation
- **Dependencies**: Install `@nestjs/swagger` and `swagger-ui-express` packages
- **Developer workflow**: Developers can now visually inspect all API endpoints, request/response schemas, and test endpoints without external HTTP clients
- **No breaking changes**: Feature is purely additive and does not modify existing API behavior
