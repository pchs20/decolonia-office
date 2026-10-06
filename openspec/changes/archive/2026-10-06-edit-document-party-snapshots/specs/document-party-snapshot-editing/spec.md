## ADDED Requirements

### Requirement: Edit document party snapshots
The system SHALL allow users to edit the complete client and worker snapshot values within budget and invoice forms without changing the document's linked client or worker identifiers.

#### Scenario: Expand client snapshot section
- **WHEN** a user opens a budget or invoice form and activates the client section
- **THEN** the form expands the client snapshot fields for editing while keeping the linked client unchanged

#### Scenario: Expand worker snapshot section
- **WHEN** a user opens a budget or invoice form and activates the worker section
- **THEN** the form expands the worker snapshot fields, including the worker bank account, for editing while keeping the linked worker unchanged

#### Scenario: Snapshot sections start collapsed
- **WHEN** a user opens a budget or invoice form
- **THEN** the client and worker snapshot sections are collapsed by default and can be expanded independently

#### Scenario: Save edited snapshot values
- **WHEN** a user edits snapshot fields and saves the budget or invoice
- **THEN** the system persists the complete edited client and worker snapshots on that document

### Requirement: Restore or apply current party information
The system SHALL provide a conditional action that replaces the complete local client or worker snapshot with the current information from its linked source record. The action SHALL remain hidden when the local snapshot matches the relevant source information and SHALL become visible when the values differ.

#### Scenario: Restore client data during creation
- **WHEN** a user is creating a budget or invoice and activates the client restore action
- **THEN** the form replaces the complete client snapshot with the currently selected client's information

#### Scenario: Restore worker data during creation
- **WHEN** a user is creating a budget or invoice and activates the worker restore action
- **THEN** the form replaces the complete worker snapshot with the current primary worker's information

#### Scenario: Hide restore action when creation snapshot is current
- **WHEN** a newly created document's client or worker snapshot matches the selected client or primary worker information
- **THEN** the form does not display the corresponding restore action

#### Scenario: Show restore action after local creation edits
- **WHEN** a user changes any field in a client or worker snapshot during document creation
- **THEN** the form displays the corresponding restore action so the user can return to the source information

#### Scenario: Apply latest client data during editing
- **WHEN** a user is editing a budget or invoice and activates the client apply-latest action
- **THEN** the form fetches the linked client and replaces the complete local client snapshot with the fetched information

#### Scenario: Apply latest worker data during editing
- **WHEN** a user is editing a budget or invoice and activates the worker apply-latest action
- **THEN** the form fetches the linked worker and replaces the complete local worker snapshot with the fetched information

#### Scenario: Hide apply-latest action when editing snapshot is current
- **WHEN** an edited document's client or worker snapshot matches the current linked source information
- **THEN** the form does not display the corresponding apply-latest action

#### Scenario: Show apply-latest action when editing snapshot differs
- **WHEN** an edited document's client or worker snapshot differs from the current linked source information
- **THEN** the form displays the corresponding apply-latest action

#### Scenario: Refresh is local until save
- **WHEN** a user applies current client or worker information and then cancels the form
- **THEN** the document retains its previous snapshot because the refresh was not persisted independently

### Requirement: Explain snapshot refresh changes
The system SHALL show a read-only summary of fields that differ before applying a current client or worker snapshot, without offering field-by-field merge selection.

#### Scenario: Refresh has changed fields
- **WHEN** fetched source information differs from the local snapshot
- **THEN** the form displays a read-only summary of the changed snapshot fields and offers an action to apply the complete fetched snapshot

#### Scenario: Refresh has no changed fields
- **WHEN** fetched source information is equal to the local snapshot
- **THEN** the form indicates that the snapshot is already current and does not change the form values

#### Scenario: Refresh is cancelled
- **WHEN** a user dismisses the change summary without applying it
- **THEN** the form keeps the existing snapshot values unchanged

#### Scenario: Source refresh fails
- **WHEN** the current client or worker cannot be fetched
- **THEN** the form keeps the existing snapshot values and displays an actionable error
