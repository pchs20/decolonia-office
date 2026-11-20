## 1. Date-only form and transport contracts

- [x] 1.1 Add a shared local-calendar `YYYY-MM-DD` helper and tests that cover defaulting to today and date serialization without timezone shifts.
- [x] 1.2 Extend budget and invoice create input types, API request parsing, and transport schemas to require delivered/issued date values.
- [x] 1.3 Update budget and invoice API/OpenAPI response and request contract definitions so business-date fields are documented as non-nullable and type-safe.

## 2. Budget and invoice persistence

- [x] 2.1 Pass required `deliveredAt` through the budget creation use case and PostgreSQL repository insert.
- [x] 2.2 Pass required `issuedAt` through the invoice creation use case and PostgreSQL repository insert.
- [x] 2.3 Add application and repository tests proving creation persists both business dates and duplication assigns today's date.
- [x] 2.4 Add the migration that backfills null business dates from `created_at`, fails on missing source timestamps, and enforces `NOT NULL` without a database default.

## 3. Document forms

- [x] 3.1 Add a required delivered-date control to the budget form, default it to the local current date for new budgets, load the mandatory stored value for edits, and add the Set today action.
- [x] 3.2 Add a required issued-date control to the invoice form, default it to the local current date for new invoices, load the mandatory stored value for edits, and add the Set today action.
- [x] 3.3 Add localized labels, Set today text, required-date validation messages, and accessible form associations for both controls.
- [x] 3.4 Submit the selected date during budget and invoice creation and update, block empty/invalid UI submissions, and ensure no clear-date action is exposed.
- [x] 3.5 Add focused form/API tests for today defaults, date edits, Set today, and required validation.

## 4. Read-only visualization and preserved consumers

- [x] 4.1 Update the shared commercial-document read-only view to show created date and the relevant delivered/issued date as separate labeled values.
- [x] 4.2 Render the non-null business date alongside the created date with no Not set branch.
- [x] 4.3 Add visualization tests for populated business dates for both document types.
- [x] 4.4 Confirm home-page creation-date rendering and direct PDF business-date behavior.
- [x] 4.5 Remove nullable/fallback compatibility paths from import, duplication, mappers, entities, and PDF rendering.

## 5. Validation

- [x] 5.1 Run focused tests for the changed application, API, persistence, and presentation modules and resolve failures.
- [x] 5.2 Run `pnpm test`, `pnpm check`, and `pnpm build`.
- [x] 5.3 Run `/opsx-verify add-document-business-dates` and resolve any critical completeness or consistency findings.
