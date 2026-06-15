# Swagger UI

## Purpose

Provide interactive API documentation and testing capabilities for the backend API. Enable developers to discover endpoints, understand request/response contracts, and test the API manually without external HTTP clients.

## Requirements

### Requirement: OpenAPI schema generation from decorators
The API SHALL generate an OpenAPI 3.0 schema automatically from NestJS controller and DTO decorators.

#### Scenario: Schema includes all documented endpoints
- **WHEN** a controller has @ApiOperation, @ApiResponse, and @ApiParam decorators
- **THEN** the OpenAPI schema includes those endpoints with their methods, parameters, request/response types, and status codes

#### Scenario: Schema includes data model definitions
- **WHEN** DTOs use @ApiProperty decorators
- **THEN** the OpenAPI schema includes typed definitions for request and response bodies with property descriptions

### Requirement: Swagger UI served at /api/docs
The system SHALL serve an interactive Swagger UI interface at the `/api/docs` route independent of a dedicated NestJS runtime process.

#### Scenario: Access Swagger UI in browser
- **WHEN** a user navigates to `/api/docs` in local or deployed environments
- **THEN** the browser loads an interactive Swagger UI interface displaying the OpenAPI schema

#### Scenario: Swagger UI remains available after runtime migration
- **WHEN** the API runtime is delivered via serverless handlers
- **THEN** `/api/docs` remains accessible and documents the same REST resources

### Requirement: Public Swagger UI access (development phase)
The API SHALL serve the `/api/docs` endpoint publicly without requiring authentication during the initial development phase.

#### Scenario: Unauthenticated access succeeds
- **WHEN** an unauthenticated user navigates to `/api/docs`
- **THEN** the Swagger UI interface loads successfully

#### Scenario: All endpoints testable from Swagger UI
- **WHEN** a user accesses Swagger UI
- **THEN** they can view and test all documented endpoints without authentication

### Requirement: Interactive endpoint testing
The Swagger UI SHALL allow developers to construct and send test requests to API endpoints directly from the interface.

#### Scenario: User tests an endpoint with request body
- **WHEN** a user fills in request parameters/body in Swagger UI and clicks "Try it out" (or equivalent)
- **THEN** the API receives the request and returns a response (success or error)

#### Scenario: Response displayed with status and body
- **WHEN** a test request completes
- **THEN** Swagger UI displays the HTTP status code, response headers, and response body

### Requirement: Comprehensive API documentation
The Swagger UI SHALL display complete documentation for all documented endpoints including parameters, request schemas, response schemas, error codes, and authentication requirements.

#### Scenario: Endpoint details visible
- **WHEN** a user views an endpoint in Swagger UI
- **THEN** they can see the HTTP method, path, description, all parameters (path/query/body), request schema, possible response schemas for each status code (200, 400, 401, 500, etc.), and authentication requirements

#### Scenario: Error responses documented
- **WHEN** an endpoint has multiple possible error responses
- **THEN** Swagger UI shows each error response status code with its schema and description (e.g., 400 Bad Request, 401 Unauthorized, 500 Internal Server Error)

### Requirement: Consistent Swagger UI availability across environments
The system SHALL expose `/api/docs` consistently across development and production environments used by the project.

#### Scenario: Swagger UI available in development and production
- **WHEN** a user accesses `/api/docs` in supported environments
- **THEN** the Swagger UI interface loads successfully

#### Scenario: Documentation remains contract-consistent
- **WHEN** endpoint contracts are updated
- **THEN** the OpenAPI content served at `/api/docs` reflects those updates in each supported environment

**Future Note**: Once the API implements authentication, this requirement SHALL be superseded by a new requirement to protect `/api/docs` with the API's authentication mechanism across all environments.
