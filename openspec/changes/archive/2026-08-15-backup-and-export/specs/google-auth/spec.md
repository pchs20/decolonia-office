## ADDED Requirements

### Requirement: Google Drive authorization for cloud backup
The system SHALL request Google Drive authorization separately from basic login and SHALL retain the granted provider credentials for server-side cloud synchronization.

#### Scenario: Worker grants Drive access
- **WHEN** an authenticated worker completes the Google consent flow for the configured Drive scope
- **THEN** the system records the provider access and refresh credentials for that worker without exposing them through the client session

#### Scenario: Worker signs in without granting Drive access
- **WHEN** a worker completes basic Google login but declines Drive access
- **THEN** login succeeds and normal application use remains available, while cloud synchronization reports that Drive authorization is required

### Requirement: Refresh Google Drive access tokens
The system SHALL refresh expired Google Drive access tokens server-side using the stored refresh credential before calling Drive or Sheets APIs.

#### Scenario: Access token is expired
- **WHEN** a cloud synchronization request has an expired access token and a valid refresh credential
- **THEN** the server obtains a new access token and continues synchronization without asking the worker to log in again

#### Scenario: Refresh credential is invalid
- **WHEN** Google rejects the refresh credential
- **THEN** the system marks Drive authorization as unavailable, does not expose token values, and asks the worker to authorize Drive again

### Requirement: Keep provider credentials out of the client session
The system SHALL NOT expose Google access tokens or refresh tokens through the browser-readable session object or API responses.

#### Scenario: Client requests its session
- **WHEN** a browser retrieves the authenticated session
- **THEN** the session contains worker identity information only and no Google provider credentials
