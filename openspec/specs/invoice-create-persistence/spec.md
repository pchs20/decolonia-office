# invoice-create-persistence Specification

## Purpose
Defines the persistence contract for creating invoice records through the PostgreSQL repository.
## Requirements
### Requirement: Invoice creation persists a complete row

The invoice repository SHALL execute an `INSERT INTO invoices` statement with exactly one value expression for every declared target column.

#### Scenario: Create a computed invoice

- **WHEN** the invoice creation use case passes a valid invoice to the PostgreSQL repository
- **THEN** the repository SHALL persist the invoice and its totals without a PostgreSQL target-column/value-count error

#### Scenario: Create an invoice with a custom identifier source

- **WHEN** the invoice has `identifierSource` set to `custom`
- **THEN** the repository SHALL store that value in `invoices.identifier_source` and preserve the remaining parameter bindings
