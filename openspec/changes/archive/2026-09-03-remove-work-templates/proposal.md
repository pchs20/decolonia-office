## Why

Work Templates are not being used and add distractions and complexity instead of solving the intended document-creation purpose. The recently introduced commercial-document duplication flow now provides the practical way to reuse a previous budget or invoice, so Work Templates are no longer needed; removing them eliminates their maintenance burden instead of preserving dormant code or compatibility paths.

## What Changes

- **BREAKING** Remove the Work Templates catalog from settings, including its UI, navigation, translations, hooks, and client code.
- **BREAKING** Remove the work-template REST routes, OpenAPI schemas/tags/paths, application services and use cases, domain and persistence adapters, and related tests.
- **BREAKING** Remove template selection and auto-fill behavior from budget and invoice line-item forms while preserving direct line-item editing.
- **BREAKING** Drop the `work_templates` database table and any related migration registration or seed data through the forward database change; existing template records are intentionally destroyed.
- Remove active documentation, diagrams, fixtures, and generated contracts that describe Work Templates.
- Preserve archived OpenSpec artifacts as historical records; they are not active requirements or compatibility commitments.

## Capabilities

### New Capabilities

- `commercial-document-work-template-removal`: Defines the complete absence of work-template behavior and the resulting direct-entry budget and invoice line-item workflow.

### Modified Capabilities

- `commercial-document-catalog-and-settings`: Remove Work Template catalog, persistence, and document-form requirements while retaining tax, pricing, numbering, worker, and backup settings.

## Impact

Affected areas include the Next.js route handlers and OpenAPI definition, the commercial-document application service and composition root, domain/application/infrastructure WorkTemplate modules, PostgreSQL migration registry and SQL, catalog settings components and translations, budget/invoice line-item forms and hooks, tests, README, and the domain class diagram. The database change is destructive and intentionally breaks callers of the removed internal API.
