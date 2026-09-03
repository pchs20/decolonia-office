## 1. Inventory And Persistence

- [x] 1.1 Audit active source, tests, translations, documentation, OpenAPI, fixtures, and scripts for Work Template identifiers and user-facing terminology; record any indirect references that must be removed.
- [x] 1.2 Add a forward SQL migration that irreversibly drops the `work_templates` table and its dependent indexes/constraints, and verify it is safe after the table has been created by prior migrations.
- [x] 1.3 Preserve the already-applied `CreateWorkTemplatesTable` migration file and its original registration, with the destructive removal represented only by the new forward migration.

## 2. Application And API Removal

- [x] 2.1 Delete the WorkTemplate domain entity, application outbound port, use-case module, unit tests, Postgres model/mapper/repository, and API mapper/schema/client modules.
- [x] 2.2 Remove WorkTemplate dependency injection and all WorkTemplate methods/imports from the commercial-document service and API composition root.
- [x] 2.3 Delete `/api/work-templates` route handlers and remove WorkTemplate schemas, tags, paths, and responses from the OpenAPI source of truth.
- [x] 2.4 Remove Work Template error translations and any remaining transport or application error mapping entries.

## 3. User Interface Simplification

- [x] 3.1 Remove `WorkTemplateCatalogManager` and its settings-page registration, navigation, state, hooks, and catalog translations while keeping tax and commercial-document settings intact.
- [x] 3.2 Simplify `JobItemForm` to direct title, description, quantity, and unit-price entry with no template loading, selector, auto-fill logic, or template-specific i18n keys.
- [x] 3.3 Remove or update tests that construct WorkTemplate repository dependencies and add focused coverage proving budget and invoice line items remain directly editable.

## 4. Active Documentation And Contract Cleanup

- [x] 4.1 Remove Work Templates from the README feature list and any current user-facing documentation.
- [x] 4.2 Remove the WorkTemplate class and relationships from the active domain class diagram and any current diagrams or generated documentation.
- [x] 4.3 Confirm archived OpenSpec changes remain unchanged and are clearly outside the active-reference audit boundary.

## 5. Verification And Completion

- [x] 5.1 Search active repository paths for `WorkTemplate`, `work-template`, `work_template`, and Work Template user-facing terms; resolve every match outside the current change artifacts, immutable migration history, and archived history.
- [x] 5.2 Run focused commercial-document tests and database migration validation, then run `pnpm test`.
- [x] 5.3 Run `pnpm check`, fixing all unused imports, dead code, contract drift, and type errors caused by the removal. `pnpm build` intentionally skipped at the user's request.
- [x] 5.4 Run `openspec validate remove-work-templates --type change --strict` and confirm all requirements and task checkboxes are complete.
