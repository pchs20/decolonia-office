# Document Cloud Sync

## MODIFIED Requirements

### Requirement: Manually initiate cloud synchronization

The system SHALL provide an authenticated Backup & Export settings surface with a manual action that starts synchronization of the current clients, budgets, invoices, spreadsheet data, and generated PDFs to the configured cloud provider. The surface SHALL clearly communicate synchronization progress, completion, and failure, and SHALL prevent conflicting backup operations from running concurrently.

#### Scenario: Worker starts a cloud sync

- **WHEN** an authenticated worker selects `Sync to Google Drive`
- **THEN** the system starts a one-way export workflow to the configured shared Google Drive folder, disables conflicting backup actions, and reports its progress to the worker

#### Scenario: Worker has not granted Drive access

- **WHEN** an authenticated worker starts a cloud sync without a valid Google Drive authorization
- **THEN** the system asks the worker to authorize Drive access and does not start synchronization until authorization succeeds

#### Scenario: Backup settings show the correct primary cloud action

- **WHEN** the Backup & Export settings surface loads
- **THEN** it shows `Authorize Google Drive` when Drive authorization is unavailable and shows `Sync to Google Drive` when authorization is available, never presenting both as simultaneous primary actions

#### Scenario: Authorization status is checked without exposing credentials

- **WHEN** the Backup & Export settings surface requests Drive authorization status
- **THEN** the system returns only whether the current worker can authorize/synchronize and never returns access or refresh token values

#### Scenario: Cloud sync does not run automatically

- **WHEN** a client, budget, or invoice is created or updated
- **THEN** the system does not initiate a cloud synchronization request

#### Scenario: Unauthenticated worker attempts to sync

- **WHEN** an unauthenticated request attempts to start or continue a cloud sync
- **THEN** the system rejects the request according to the application's API authentication contract

#### Scenario: Cloud sync reports an operation failure

- **WHEN** a synchronization request fails before completion
- **THEN** the Backup & Export surface displays an actionable localized error, removes the pending state, and allows a later retry
