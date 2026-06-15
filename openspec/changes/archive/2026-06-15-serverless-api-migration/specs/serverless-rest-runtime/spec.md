## ADDED Requirements

### Requirement: Serverless REST endpoints for client management
The system SHALL provide serverless REST endpoints for client management with the same resource semantics as the current API.

#### Scenario: Create client via serverless endpoint
- **WHEN** a valid `POST /api/clients` request is sent
- **THEN** the serverless API creates a client and returns HTTP 201 with the created client payload

#### Scenario: Retrieve client list via serverless endpoint
- **WHEN** a `GET /api/clients?page=1&limit=10` request is sent
- **THEN** the serverless API returns a paginated list of active clients with HTTP 200

### Requirement: REST contract compatibility for existing web flows
The migrated runtime MUST preserve existing endpoint paths, methods, status codes, and response shapes required by the current web application.

#### Scenario: Existing web client calls remain valid
- **WHEN** the web app calls client-management endpoints using current request formats
- **THEN** responses remain compatible without requiring breaking UI behavior changes

#### Scenario: Error handling remains compatible
- **WHEN** invalid payloads or unknown IDs are sent to client endpoints
- **THEN** the API returns expected error status codes and structured error payloads consumable by the web app

### Requirement: Persistent relational data in managed free-tier database
The production environment SHALL store application data in a persistent managed relational database suitable for free-tier operation.

#### Scenario: Data persists across runtime restarts
- **WHEN** serverless runtime instances are recycled or restarted
- **THEN** previously created client records remain available in subsequent API requests

#### Scenario: Database connectivity configured by environment variables
- **WHEN** deployment environment variables are configured for production and local development
- **THEN** the serverless API connects successfully to the configured relational database

### Requirement: Free-tier operational constraints are explicit
The deployment definition MUST document and validate key free-tier constraints affecting runtime behavior.

#### Scenario: Cold-start behavior is documented
- **WHEN** deployment documentation is reviewed
- **THEN** expected cold-start and request-latency behavior is explicitly documented

#### Scenario: Quota limits are tracked
- **WHEN** runtime and database usage approach free-tier limits
- **THEN** maintainers can identify the risk through documented quota monitoring points
