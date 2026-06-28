## MODIFIED Requirements

### Requirement: Worker profile management API
The system SHALL provide REST endpoints to create, retrieve, update, archive, list active worker profiles, and designate a primary worker.

#### Scenario: Create worker profile
- **WHEN** a valid `POST /api/workers` request is submitted
- **THEN** the system creates a worker profile and returns HTTP 201 with the created profile payload

#### Scenario: Retrieve active worker profile by id
- **WHEN** a valid `GET /api/workers/:id` request targets an active worker profile
- **THEN** the system returns HTTP 200 with the worker profile payload

#### Scenario: Update active worker profile
- **WHEN** a valid `PATCH /api/workers/:id` request is submitted for an active worker profile
- **THEN** the system applies requested changes and returns HTTP 200 with the updated profile payload

#### Scenario: Set worker as primary via API
- **WHEN** a valid `PATCH /api/workers/:id` request includes `isPrimary: true` for an active worker profile
- **THEN** the system atomically unsets the current primary worker (if any), sets the target worker as primary, and returns HTTP 200 with the updated profile payload

#### Scenario: Retrieve primary worker
- **WHEN** a valid `GET /api/workers` request is made with a `primary=true` query parameter
- **THEN** the system returns HTTP 200 with the single primary worker profile, or an empty result if none is configured

#### Scenario: Archive worker profile
- **WHEN** a valid `DELETE /api/workers/:id` request is submitted for an active worker profile
- **THEN** the system marks the profile inactive and returns HTTP 204

## MODIFIED Requirements

### Requirement: Worker profile management UI
The system SHALL provide a management interface for worker profiles accessible from the Settings page under a dedicated Workers tab. The Workers tab SHALL be the fifth tab in the Settings catalog screen.

#### Scenario: Navigate to workers via Settings
- **WHEN** a user navigates to Settings and selects the Workers tab
- **THEN** the system displays the list of active worker profiles with an option to add, edit, delete, and set primary

#### Scenario: Workers tab absent from main navigation
- **WHEN** a user views the main application navigation bar
- **THEN** no Workers link is visible; Workers is only accessible via Settings

#### Scenario: Create worker from settings
- **WHEN** a user clicks the add worker action from the Workers settings tab
- **THEN** the system navigates to `/settings/workers/new` where the worker creation form is displayed

#### Scenario: Edit worker from settings
- **WHEN** a user clicks the edit action on a worker in the Workers settings tab
- **THEN** the system navigates to `/settings/workers/:id/edit` where the worker edit form is displayed

#### Scenario: Delete worker from settings
- **WHEN** a user clicks the delete action on a non-primary worker
- **THEN** the system soft-deletes the worker profile and removes it from the list
