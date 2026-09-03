## ADDED Requirements

## REMOVED Requirements

### Requirement: Create a work template
**Reason**: Work Templates are unused, add distraction and complexity, and are no longer needed now that commercial-document duplication provides reuse of existing budgets and invoices.
**Migration**: Create new line items directly or duplicate an existing budget or invoice; no compatibility endpoint or data conversion is provided.

### Requirement: Edit work template
**Reason**: The Work Template catalog is being decommissioned in its entirety.
**Migration**: Edit materialized line items directly in their budget or invoice, or duplicate the document before editing.

### Requirement: Archive work template
**Reason**: The Work Template catalog and lifecycle are being removed rather than deprecated.
**Migration**: No migration is provided; existing template records are destroyed by the database migration.

### Requirement: List work templates
**Reason**: The Work Template settings catalog is being removed because it is unused and creates unnecessary UI and maintenance complexity.
**Migration**: Use the document list and duplication actions to reuse prior work.

### Requirement: Edit work template from catalog row
**Reason**: The Work Template catalog is being decommissioned in its entirety.
**Migration**: Edit document line items directly.

### Requirement: Settings UI organization
**Reason**: Its Work Templates section is obsolete; the remaining settings sections continue to be organized on the settings page.
**Migration**: Remove only the Work Templates tab and section; retain taxes, numbering, pricing, workers, and backup settings.

### Requirement: Work-template capability is absent
The system SHALL NOT expose, execute, or persist a Work Template or line-item preset capability anywhere in the active application.

#### Scenario: Work-template settings are unavailable
- **WHEN** an authenticated user opens Settings
- **THEN** the application shows no Work Template catalog, controls, navigation entry, translation, or client request

#### Scenario: Work-template API is unavailable
- **WHEN** the application is built and its API contract is inspected
- **THEN** no Work Template route, schema, tag, mapper, service, use case, repository, or domain entity is present

#### Scenario: Work-template persistence is absent
- **WHEN** the database schema is migrated to the current version
- **THEN** the current schema contains no `work_templates` table, index, or seed data, existing Work Template records have been removed, and the only reference to the retired table in migration history is the preserved immutable create migration plus the new drop migration

### Requirement: Commercial documents use direct line-item entry
Budget and invoice forms SHALL create and edit line items directly without loading, selecting, or auto-filling a Work Template.

#### Scenario: Create a budget line item
- **WHEN** a user adds a line item to a budget
- **THEN** the form provides direct fields for title, description, quantity, and unit price without a template selector

#### Scenario: Create an invoice line item
- **WHEN** a user adds a line item to an invoice
- **THEN** the form provides direct fields for title, description, quantity, and unit price without a template selector

#### Scenario: Existing document line items remain independent
- **WHEN** a budget or invoice containing line items is opened after the removal
- **THEN** its materialized line-item data remains editable and has no dependency on a removed template record

### Requirement: Removal leaves no active references
The repository SHALL contain no active source, test, documentation, generated contract, fixture, or translation reference to Work Templates, while archived OpenSpec records MAY retain historical references.

#### Scenario: Active reference audit
- **WHEN** the active repository is searched for Work Template identifiers or user-facing terminology
- **THEN** matches occur only in the current removal change artifacts, if any, and not in active application code, tests, docs, or generated contracts
