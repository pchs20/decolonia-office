## ADDED Requirements

### Requirement: Records can be soft-deleted
The system SHALL soft-delete clients, budgets, and invoices by marking them inactive rather than physically removing their primary record. Soft-deleted records SHALL remain available for historical relationships and SHALL NOT be restorable through this change.

#### Scenario: Delete a client
- **WHEN** an authorized user confirms deletion of an active client
- **THEN** the client is marked inactive and its budgets and invoices remain unchanged

#### Scenario: Delete a budget
- **WHEN** an authorized user confirms deletion of an active budget
- **THEN** the budget is marked inactive, its job items remain stored, and every invoice referencing it has `source_budget_id` cleared

#### Scenario: Delete an invoice
- **WHEN** an authorized user confirms deletion of an active invoice
- **THEN** the invoice is marked inactive and its job items remain stored

### Requirement: Active reads exclude soft-deleted records
The system SHALL exclude inactive clients, budgets, and invoices from active get-by-ID, list, search, duplicate, source-budget, and PDF retrieval workflows. Documents belonging to an inactive client SHALL remain eligible for active document reads and listings.

#### Scenario: Fetch a soft-deleted record
- **WHEN** an active get-by-ID, duplicate, or PDF request targets an inactive client, budget, or invoice
- **THEN** the system responds as though the record is not available to the active workflow

#### Scenario: List documents for an inactive client
- **WHEN** a user lists budgets or invoices associated with an inactive client
- **THEN** active budgets and invoices are still returned

### Requirement: Delete actions are available in list and detail views
The system SHALL present a delete action for clients, budgets, and invoices in both their list view and detail view. Each action SHALL require a simple confirmation before sending the delete request.

#### Scenario: Cancel deletion
- **WHEN** the user dismisses the confirmation
- **THEN** no delete request is sent and the record remains active

#### Scenario: Confirm deletion from a detail view
- **WHEN** the user confirms deletion from a client, budget, or invoice detail view
- **THEN** the record is soft-deleted and the user is returned to the corresponding list view

## ADDED Requirements

### Requirement: Local exports exclude inactive records
The local backup export SHALL include only active clients, budgets, and invoices. Inactive records SHALL NOT appear in exported tables or generated document files.

#### Scenario: Build a local backup with inactive records
- **WHEN** a local backup is assembled while any supported record is inactive
- **THEN** the backup contains no table row or PDF file for that inactive record
