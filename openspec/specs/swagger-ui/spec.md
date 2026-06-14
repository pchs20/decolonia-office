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
The API SHALL serve an interactive Swagger UI interface at the `/api/docs` route.

#### Scenario: Access Swagger UI in browser
- **WHEN** a user navigates to `http://localhost:<API_PORT>/api/docs` (or production API URL)
- **THEN** the browser loads an interactive Swagger UI interface displaying the OpenAPI schema

#### Scenario: Swagger UI displays API title and description
- **WHEN** Swagger UI loads
- **THEN** it displays the API title, version, and description as configured in the OpenAPI schema

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
The API SHALL expose the `/api/docs` endpoint consistently across development, staging, and production environments.

#### Scenario: Swagger UI available in all environments
- **WHEN** accessing `/api/docs` in any environment (dev, staging, production)
- **THEN** the Swagger UI interface loads successfully with identical functionality

#### Scenario: Same documentation everywhere
- **WHEN** accessing `/api/docs` in different environments
- **THEN** the OpenAPI schema and documentation display the same information

**Future Note**: Once the API implements authentication, this requirement SHALL be superseded by a new requirement to protect `/api/docs` with the API's authentication mechanism across all environments.
