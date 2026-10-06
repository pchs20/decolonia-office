# Loading Feedback

## Purpose

Define consistent, accessible feedback for user-initiated operations that take long enough to otherwise appear inactive.

## ADDED Requirements

### Requirement: Long-running actions expose a pending state

The system SHALL provide visible pending feedback for supported long-running user actions from the moment the request starts until it completes or fails.

#### Scenario: User starts a supported action

- **WHEN** an authenticated user starts a supported PDF export, local backup download, or cloud synchronization
- **THEN** the initiating control or operation area immediately communicates that the action is in progress

#### Scenario: Pending action prevents duplicate initiation

- **WHEN** a supported action is in progress
- **THEN** the initiating control is disabled and a second request cannot be started from that control

#### Scenario: Pending feedback does not hide unrelated content

- **WHEN** a supported action is in progress
- **THEN** the current page content remains visible unless the action itself requires replacing that content

### Requirement: Loading feedback is accessible and localized

The system SHALL expose pending and failure states through accessible status semantics and localized text, without relying on animation or color alone.

#### Scenario: Assistive technology detects pending work

- **WHEN** a supported action enters its pending state
- **THEN** the relevant control or status region exposes an accessible busy or status indication and a meaningful localized label

#### Scenario: User prefers reduced motion

- **WHEN** a user has enabled a reduced-motion preference
- **THEN** loading feedback remains understandable without requiring animated motion

### Requirement: Operation failures restore retryability

The system SHALL communicate a failed supported action near its initiating control or operation area and restore the control to a retryable state.

#### Scenario: Supported action fails

- **WHEN** a PDF export, local backup download, or cloud synchronization request fails
- **THEN** the system displays a localized actionable error, removes the pending state, and allows the user to retry

#### Scenario: Supported action succeeds

- **WHEN** a supported action completes successfully
- **THEN** the system removes the pending state and preserves or displays the existing success result for that action

### Requirement: Operation scope matches the user task

The system SHALL use control-local feedback for single-document actions and persistent operation feedback for multi-document operations.

#### Scenario: Single PDF export is pending

- **WHEN** a user exports one budget or invoice PDF
- **THEN** feedback is shown on the corresponding export control without blocking unrelated document viewing

#### Scenario: Multi-document operation is pending

- **WHEN** a user downloads a complete backup or synchronizes multiple documents
- **THEN** feedback is shown in the Backup & Export operation area and conflicting backup actions are prevented from running concurrently
