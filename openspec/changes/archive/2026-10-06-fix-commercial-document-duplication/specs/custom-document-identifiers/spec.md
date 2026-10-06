## ADDED Requirements

### Requirement: Duplicated documents preserve identifier source metadata
The system SHALL duplicate budgets and invoices with a new internal UUID and allocated user-facing identifier while preserving the source document's explicit `identifier_source` value.

#### Scenario: Duplicate a budget with a custom identifier
- **WHEN** a budget marked with `identifier_source = custom` is duplicated
- **THEN** the new budget is persisted with a new UUID, a newly allocated identifier, and `identifier_source = custom`

#### Scenario: Duplicate an invoice with an automatic identifier
- **WHEN** an invoice marked with `identifier_source = automatic` is duplicated
- **THEN** the new invoice is persisted with a new UUID, a newly allocated current-year identifier, and `identifier_source = automatic`

#### Scenario: Duplicate queries remain column aligned
- **WHEN** the budget or invoice duplication repository executes its `INSERT ... SELECT` statement
- **THEN** every target column has exactly one corresponding expression and the transaction completes without a PostgreSQL column-count error
