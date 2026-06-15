## MODIFIED Requirements

### Requirement: Swagger UI served at /api/docs
The system SHALL serve an interactive Swagger UI interface at the `/api/docs` route independent of a dedicated NestJS runtime process.

#### Scenario: Access Swagger UI in browser
- **WHEN** a user navigates to `/api/docs` in local or deployed environments
- **THEN** the browser loads an interactive Swagger UI interface displaying the current OpenAPI schema

#### Scenario: Swagger UI remains available after runtime migration
- **WHEN** the API runtime is delivered via serverless handlers
- **THEN** `/api/docs` remains accessible and documents the same REST resources

### Requirement: Consistent Swagger UI availability across environments
The system SHALL expose `/api/docs` consistently across development and production environments used by the project.

#### Scenario: Swagger UI available in development and production
- **WHEN** a user accesses `/api/docs` in supported environments
- **THEN** the Swagger UI interface loads successfully

#### Scenario: Documentation remains contract-consistent
- **WHEN** endpoint contracts are updated
- **THEN** the OpenAPI content served at `/api/docs` reflects those updates in each supported environment
