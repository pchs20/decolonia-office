## Why

The current vision assumes a rich text editor for budgets and invoices, which keeps document creation too manual and error-prone for a non-technical user. We need a structured, reusable model so your father can quickly create consistent budgets and invoices now, while preparing clean PDF export and accountant workflows later.

## What Changes

- Replace free-text-first budget and invoice authoring with structured line items (title, description, price) plus optional notes.
- Introduce budget management with client linkage, manual delivered date, totals, optional tax application, and sequential numbering.
- Introduce invoice management with client linkage, optional source budget linkage, issuer data support, totals, optional tax application, and year-scoped numbering.
- Add reusable predefined work/job templates that can be inserted into budgets/invoices and materialized as editable document rows.
- Add configurable tax definitions (starting with IVA 21%) and materialize selected tax data on each budget/invoice so historical documents remain stable.
- Add numbering configuration/state management so next numbers are auto-assigned but still user-adjustable in settings.
- Align the budget/invoice foundation with future invoice-from-budget and PDF export flows without implementing PDF generation in this change.

## Capabilities

### New Capabilities
- `budget-management`: Create, edit, and list structured budgets linked to clients, with line items, tax snapshotting, delivered date, and numbering.
- `invoice-management`: Create, edit, and list structured invoices linked to clients, optionally linked to budgets, with line items, tax snapshotting, issuer data snapshotting, and numbering.
- `commercial-document-catalog-and-settings`: Manage predefined work templates, tax definitions, and document numbering state used by budgets and invoices.

### Modified Capabilities
- `app-navigation-shell`: Extend navigation requirements to include access to budgets, invoices, and commercial document settings routes.

## Impact

- Affected backend/domain areas: new budget/invoice aggregates, line-item modeling, snapshot semantics, numbering allocation rules, and configuration entities.
- Affected API surface: new REST endpoints and transport schemas for budgets, invoices, work templates, tax definitions, and numbering/settings.
- Affected persistence: additive Postgres migrations for document, line item, template, tax, and sequence/config tables.
- Affected frontend: new pages/forms/lists for budgets and invoices, plus settings/catalog management and navigation updates.
- Affected future integrations: establishes structured source data for later PDF export and invoice-from-budget generation.
