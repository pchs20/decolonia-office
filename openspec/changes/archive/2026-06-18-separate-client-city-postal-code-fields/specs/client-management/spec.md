## MODIFIED Requirements

### Requirement: Client data model with standardized fields
The system SHALL store client information with consistent fields that capture contact and billing details for both individuals and companies.

#### Scenario: Individual client created with all required fields
- **WHEN** a user creates a client of type "individual"
- **THEN** the system stores: name, street, city, postal_code, billing_street, billing_city, billing_postal_code, tax_id (NIF/NIE), phone, email, and marks the client as active

#### Scenario: Company client created with all required fields
- **WHEN** a user creates a client of type "company"
- **THEN** the system stores: name, street, city, postal_code, billing_street, billing_city, billing_postal_code, tax_id (CIF), phone, email, and marks the client as active

#### Scenario: Billing address fields default to work address fields
- **WHEN** a user creates or updates a client without explicit billing address fields
- **THEN** the system defaults billing_street, billing_city, and billing_postal_code to the corresponding work address values

#### Scenario: Client exposes two address relations in code
- **WHEN** a client is loaded in application code
- **THEN** the client exposes `workAddress` and `billingAddress` value objects mapped from flattened address columns in persistence

#### Scenario: Client record includes timestamps
- **WHEN** a client is created or updated
- **THEN** the system automatically records created_at and updated_at timestamps

### Requirement: Create client via API
The system SHALL provide an API endpoint to create a new client record with validation.

#### Scenario: Valid client creation
- **WHEN** a POST request is sent to `/api/clients` with valid client data (name, type, street, city, postal_code, billing_street, billing_city, billing_postal_code, tax_id, phone, email)
- **THEN** the system creates the client and returns the new client record with HTTP 201

#### Scenario: Missing required field fails
- **WHEN** a POST request is sent to `/api/clients` with missing required fields
- **THEN** the system returns HTTP 400 with validation error details

#### Scenario: Invalid client type fails
- **WHEN** a POST request is sent to `/api/clients` with type not "individual" or "company"
- **THEN** the system returns HTTP 400 with validation error

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

### Requirement: Frontend integration for client management
The web app SHALL provide UI components and services to perform client CRUD operations and display client lists.

#### Scenario: Display list of clients
- **WHEN** a user navigates to the Clients page
- **THEN** the web app fetches the client list from `/api/clients` and displays clients with name, phone, and city from the dedicated city field

#### Scenario: Create client via form
- **WHEN** a user clicks "Add Client" and fills out the client form (name, type, street, city, postal_code, billing_street, billing_city, billing_postal_code, tax_id, phone, email)
- **THEN** the web app sends a POST request to `/api/clients` and displays success/error feedback

#### Scenario: Form captures explicit billing fields
- **WHEN** a user opens the create or edit client form
- **THEN** the form shows dedicated inputs for work and billing street/city/postal code fields so values are explicit and never inferred from free text

#### Scenario: Billing same-as-work toggle applies structured fields
- **WHEN** a user marks billing address as the same as work address in the client form
- **THEN** the web app writes billing_street, billing_city, and billing_postal_code values equal to work address fields

#### Scenario: Edit existing client
- **WHEN** a user selects a client and modifies fields, then saves
- **THEN** the web app sends a PATCH request to `/api/clients/:id` and displays success/error feedback

#### Scenario: Delete client from UI
- **WHEN** a user clicks Delete on a client record
- **THEN** the web app sends a DELETE request to `/api/clients/:id` and removes the client from the list

#### Scenario: Search clients in UI
- **WHEN** a user types a name in the search box
- **THEN** the web app queries `/api/clients?search=<name>` and updates the list in real-time (or on search submit)
