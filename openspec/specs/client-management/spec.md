# Client Management

## Purpose

Enable your father to store, organize, and retrieve client information (individuals and companies) in a centralized system. This foundation allows all downstream features (budgets, invoices) to reference and auto-fill client data.

## Requirements

### Requirement: Client data model with standardized fields
The system SHALL store client information with consistent fields that capture contact and billing details for both individuals and companies.

#### Scenario: Individual client created with all required fields
- **WHEN** a user creates a client of type "individual"
- **THEN** the system stores: name, street, city, postalCode, billingStreet, billingCity, billingPostalCode, taxId (NIF/NIE), phone, email, and marks the client as active

#### Scenario: Company client created with all required fields
- **WHEN** a user creates a client of type "company"
- **THEN** the system stores: name, street, city, postalCode, billingStreet, billingCity, billingPostalCode, taxId (CIF), phone, email, and marks the client as active

#### Scenario: Billing address fields default to work address fields
- **WHEN** a user creates or updates a client without explicit billing address fields
- **THEN** the system defaults billingStreet, billingCity, and billingPostalCode to the corresponding work address values

#### Scenario: Client domain entity exposes two address relations in code
- **WHEN** a client is loaded in domain/application code
- **THEN** the domain entity exposes `workAddress` and `billingAddress` value objects mapped from flattened address columns in persistence

#### Scenario: Client API response uses flat transport address fields
- **WHEN** a client is returned from REST endpoints
- **THEN** the response payload exposes flat transport fields (`street`, `city`, `postalCode`, `billingStreet`, `billingCity`, `billingPostalCode`) rather than nested address objects

#### Scenario: Client record includes timestamps
- **WHEN** a client is created or updated
- **THEN** the system automatically records created_at and updated_at timestamps

### Requirement: Create client via API
The system SHALL provide an API endpoint to create a new client record with validation.

#### Scenario: Valid client creation
- **WHEN** a POST request is sent to `/api/clients` with valid client data (name, type, street, city, postalCode, billingStreet, billingCity, billingPostalCode, taxId, phone, email)
- **THEN** the system creates the client and returns the new client record with HTTP 201

#### Scenario: Missing required field fails
- **WHEN** a POST request is sent to `/api/clients` with missing required fields
- **THEN** the system returns HTTP 400 with validation error details

#### Scenario: Invalid client type fails
- **WHEN** a POST request is sent to `/api/clients` with type not "individual" or "company"
- **THEN** the system returns HTTP 400 with validation error

### Requirement: Retrieve single client via API
The system SHALL provide an API endpoint to fetch a single client by ID, including only active clients by default.

#### Scenario: Retrieve active client by ID
- **WHEN** a GET request is sent to `/api/clients/:id` for an active client
- **THEN** the system returns the client record with HTTP 200

#### Scenario: Retrieve archived (inactive) client fails
- **WHEN** a GET request is sent to `/api/clients/:id` for an archived (is_active=false) client
- **THEN** the system returns HTTP 404

#### Scenario: Non-existent client returns 404
- **WHEN** a GET request is sent to `/api/clients/:id` with an invalid ID
- **THEN** the system returns HTTP 404

### Requirement: Update client via API
The system SHALL provide an API endpoint to update an existing client record with validation.

#### Scenario: Update active client fields
- **WHEN** a PATCH request is sent to `/api/clients/:id` with updated client data, including work or billing address fields
- **THEN** the system updates the client record and returns the updated record with HTTP 200

#### Scenario: Update non-existent client fails
- **WHEN** a PATCH request is sent to `/api/clients/:id` with an invalid ID
- **THEN** the system returns HTTP 404

#### Scenario: Invalid data in update fails
- **WHEN** a PATCH request is sent to `/api/clients/:id` with invalid data (e.g., missing required work address fields or incomplete billing fields when billing differs)
- **THEN** the system returns HTTP 400 with validation error details

### Requirement: Soft-delete client via API
The system SHALL provide an API endpoint to mark a client as archived (inactive) without deleting records.

#### Scenario: Archive active client
- **WHEN** a DELETE request is sent to `/api/clients/:id` for an active client
- **THEN** the system marks is_active=false and returns HTTP 204

#### Scenario: Archive non-existent client fails
- **WHEN** a DELETE request is sent to `/api/clients/:id` with an invalid ID
- **THEN** the system returns HTTP 404

#### Scenario: Archived client cannot be retrieved
- **WHEN** a client is archived, then a GET request is sent to `/api/clients/:id`
- **THEN** the system returns HTTP 404 (archived clients excluded from normal retrieval)

### Requirement: List active clients via API
The system SHALL provide an API endpoint to retrieve all active clients with pagination and search support.

#### Scenario: List all active clients
- **WHEN** a GET request is sent to `/api/clients` with no filters
- **THEN** the system returns a paginated list of all active clients with HTTP 200

#### Scenario: List is paginated
- **WHEN** a GET request is sent to `/api/clients?page=1&limit=10`
- **THEN** the system returns max 10 clients per page and includes total count and page info

#### Scenario: Search clients by name
- **WHEN** a GET request is sent to `/api/clients?search=João`
- **THEN** the system returns only active clients whose name contains "João" (case-insensitive)

#### Scenario: Empty list when no clients match
- **WHEN** a GET request is sent to `/api/clients?search=nonexistent`
- **THEN** the system returns an empty list with HTTP 200

### Requirement: Frontend integration for client management
The web app SHALL provide UI components and services to perform client CRUD operations and display client lists.

#### Scenario: Display list of clients
- **WHEN** a user navigates to the Clients page
- **THEN** the web app fetches the client list from `/api/clients` and displays clients with name, phone, and city from the dedicated city field

#### Scenario: Create client via form
- **WHEN** a user clicks "Add Client" and fills out the client form (name, type, street, city, postalCode, billingStreet, billingCity, billingPostalCode, taxId, phone, email)
- **THEN** the web app sends a POST request to `/api/clients` and displays success/error feedback

#### Scenario: Form captures explicit billing fields
- **WHEN** a user opens the create or edit client form
- **THEN** the form shows dedicated inputs for work and billing street/city/postal code fields so values are explicit and never inferred from free text

#### Scenario: Billing same-as-work toggle applies structured fields
- **WHEN** a user marks billing address as the same as work address in the client form
- **THEN** the web app writes billingStreet, billingCity, and billingPostalCode values equal to work address fields

#### Scenario: Edit existing client
- **WHEN** a user selects a client and modifies fields, then saves
- **THEN** the web app sends a PATCH request to `/api/clients/:id` and displays success/error feedback

#### Scenario: Delete client from UI
- **WHEN** a user clicks Delete on a client record
- **THEN** the web app sends a DELETE request to `/api/clients/:id` and removes the client from the list

#### Scenario: Search clients in UI
- **WHEN** a user types a name in the search box
- **THEN** the web app queries `/api/clients?search=<name>` and updates the list in real-time (or on search submit)

### Requirement: Client profile semantics align with shared Profile model
Client-management requirements SHALL remain compatible with the shared abstract `Profile` model used by both clients and workers.

#### Scenario: Shared field conventions remain consistent
- **WHEN** client and worker profile capabilities are used together
- **THEN** shared fields (name, tax identifier, contact fields, active status, timestamps, work address, billing address) use consistent semantics and naming conventions

#### Scenario: Client-specific behavior remains preserved
- **WHEN** client-management operations are executed after introducing worker profiles
- **THEN** existing client-specific behavior, including client `type` and client endpoint contracts, remains unchanged

### Requirement: Client and worker address semantics stay aligned
Client-management address behavior SHALL remain aligned with worker-profile address behavior for structured work and billing fields.

#### Scenario: Billing default behavior is equivalent across profiles
- **WHEN** billing address fields are omitted for client or worker profiles
- **THEN** billing street, billing city, and billing postal code default to the corresponding work address fields for both profile types

#### Scenario: Billing completeness validation is equivalent across profiles
- **WHEN** any billing field is provided in client or worker profile payloads
- **THEN** all billing address fields are required together for both profile types
