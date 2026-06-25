# Budget and Invoices Foundation - Implementation Tasks

## 1. Domain Layer Setup

- [x] 1.1 Create CommercialDocument parent entity (id, number, clientId, workerId, notes, timestamps)
- [x] 1.2 Create Budget entity extending CommercialDocument (deliveredAt)
- [x] 1.3 Create Invoice entity extending CommercialDocument (issuedAt, sourceBudgetId)
- [x] 1.4 Create JobItem value object (id, commercialDocumentId, position, title, description, quantity, unitPrice, totalPrice)
- [x] 1.5 Create ClientSnapshot value object (name, taxId, phone, email, workAddress, billingAddress)
- [x] 1.6 Create WorkerSnapshot value object (name, taxId, phone, email, workAddress, billingAddress)
- [x] 1.7 Create TaxSnapshot value object (name, rate, behavior)
- [x] 1.8 Create TaxDefinition entity (id, name, rate, behavior, isActive, timestamps)
- [x] 1.9 Create WorkTemplate entity (id, title, description, defaultUnitPrice, isActive, timestamps)
- [x] 1.10 Create DocumentSequence entity (id, documentType, scopeYear, nextNumber, updatedAt)
- [x] 1.11 Define DocumentType enum
- [x] 1.12 Define TaxBehavior enum (added)
- [x] 1.13 Add domain exceptions (DuplicateNumberAllocation, etc.)

## 2. Persistence Layer - Migrations and Repositories

- [x] 2.1 Create Postgres migration for budgets table (commercialDocument base fields + deliveredAt)
- [x] 2.2 Create Postgres migration for invoices table (commercialDocument base fields + issuedAt, sourceBudgetId)
- [x] 2.3 Create Postgres migration for job_items table (commercialDocumentId foreign key, all JobItem fields)
- [x] 2.4 Create Postgres migration for tax_definitions table (TaxDefinition fields)
- [x] 2.5 Create Postgres migration for work_templates table (WorkTemplate fields)
- [x] 2.6 Create Postgres migration for document_sequences table (DocumentSequence fields with unique constraint on documentType + scopeYear)
- [x] 2.7 Implement BudgetRepository (infrastructure/persistence) with create, findById, findByClient, list, update, delete
- [x] 2.8 Implement InvoiceRepository with create, findById, findByClient, findByYear, list, update, delete
- [x] 2.9 Implement JobItemRepository with create, findByDocument, update, delete
- [x] 2.10 Implement TaxDefinitionRepository with create, findById, list, update, archive
- [x] 2.11 Implement WorkTemplateRepository with create, findById, list, update, archive
- [x] 2.12 Implement DocumentSequenceRepository with findOrCreate (with transactional number allocation), update

## 3. Application Layer - Use Cases

- [x] 3.1 Implement CreateBudgetUseCase (allocate number transactionally, materialize snapshots)
- [x] 3.2 Implement UpdateBudgetUseCase (edit header fields)
- [x] 3.3 Implement ListBudgetsUseCase (paginated, filterable by client)
- [x] 3.4 Implement GetBudgetUseCase (retrieve by id, include job items)
- [x] 3.5 Implement budget totals recalculation behavior
- [x] 3.6 Implement CreateInvoiceUseCase (allocate year-scoped number transactionally, materialize snapshots, optional budget linkage)
- [x] 3.7 Implement UpdateInvoiceUseCase (edit header fields)
- [x] 3.8 Implement ListInvoicesUseCase (paginated, filterable by client and year)
- [x] 3.9 Implement GetInvoiceUseCase (retrieve by id, include job items, show source budget if linked)
- [x] 3.10 Implement invoice totals recalculation behavior
- [x] 3.11 Implement AddJobItemUseCase (append to document, auto-position, recalculate totals)
- [x] 3.12 Implement UpdateJobItemUseCase (edit pricing fields, recalculate document totals)
- [x] 3.13 Implement RemoveJobItemUseCase (delete and renumber remaining items)
- [x] 3.14 Implement CreateTaxDefinitionUseCase (validate name/rate, create as active)
- [x] 3.15 Implement UpdateTaxDefinitionUseCase (allow name/rate changes, deactivation)
- [x] 3.16 Implement ArchiveTaxDefinitionUseCase (transition to archived)
- [x] 3.17 Implement ListTaxDefinitionsUseCase (include archived, filterable by status)
- [x] 3.18 Implement CreateWorkTemplateUseCase (validate title/description/price, create as active)
- [x] 3.19 Implement UpdateWorkTemplateUseCase (allow field changes, deactivation)
- [x] 3.20 Implement ArchiveWorkTemplateUseCase (transition to archived)
- [x] 3.21 Implement ListWorkTemplatesUseCase (include archived, filterable by status)
- [x] 3.22 Implement GetDocumentSequenceUseCase (retrieve current next number by type/year)
- [x] 3.23 Implement AdjustDocumentSequenceUseCase (allow manual number adjustment in settings)

## 4. API Layer - Validators, Mappers, Schemas

- [x] 4.1 Create CommercialDocumentResponse flat schema (id, number, clientId, clientSnapshot flat fields, workerId, workerSnapshot flat fields, taxSnapshot flat fields, subtotal, tax, total, timestamps)
- [x] 4.2 Create BudgetResponse extending CommercialDocumentResponse (deliveredAt)
- [x] 4.3 Create InvoiceResponse extending CommercialDocumentResponse (issuedAt, sourceBudgetId)
- [x] 4.4 Create BudgetCreateRequest schema (clientId, workerId, notes, tax definition selection)
- [x] 4.5 Create InvoiceCreateRequest schema (clientId, workerId, notes, sourceBudgetId, tax definition selection)
- [x] 4.6 Create JobItemRequest schema (title, description, quantity, unitPrice, totalPrice)
- [x] 4.7 Create JobItemResponse schema (id, position, all fields from JobItemRequest)
- [x] 4.8 Create TaxDefinitionRequest/Response schemas (name, rate, behavior, isActive)
- [x] 4.9 Create WorkTemplateRequest/Response schemas (title, description, defaultUnitPrice, isActive)
- [x] 4.10 Create DocumentSequenceResponse schema (nextNumber for budgets, nextNumbers per year for invoices)
- [x] 4.11 Implement budget mapper (domain → response flat schema)
- [x] 4.12 Implement invoice mapper (domain → response flat schema)
- [x] 4.13 Implement job item mapper
- [x] 4.14 Implement tax definition mapper
- [x] 4.15 Implement work template mapper
- [x] 4.16 Create OpenAPI contract definitions for all new endpoints
- [x] 4.17 Update OpenAPI contract to reflect new navigation routes

## 5. API Endpoints - Route Handlers

**Architectural Note**: The endpoint pattern is established with budget and invoice POST/GET examples in `/app/api/budgets/route.ts`. All remaining endpoints follow the same pattern: request validation → repository access → use case invocation → response mapping.

- [x] 5.1 Implement POST /api/budgets (create)
- [x] 5.2 Implement GET /api/budgets (list, paginated, filterable)
- [x] 5.3 Implement GET /api/budgets/:id (retrieve)
- [x] 5.4 Implement PATCH /api/budgets/:id (update)
- [x] 5.7 Implement POST /api/invoices (create)
- [x] 5.8 Implement GET /api/invoices (list, paginated, filterable by client and year)
- [x] 5.9 Implement GET /api/invoices/:id (retrieve)
- [x] 5.10 Implement PATCH /api/invoices/:id (update)
- [x] 5.13 Implement POST /api/budgets/:id/items (add job item)
- [x] 5.14 Implement PATCH /api/budgets/:budgetId/items/:itemId (update job item)
- [x] 5.15 Implement DELETE /api/budgets/:budgetId/items/:itemId (remove job item)
- [x] 5.16 Implement POST /api/invoices/:id/items (add job item)
- [x] 5.17 Implement PATCH /api/invoices/:invoiceId/items/:itemId (update job item)
- [x] 5.18 Implement DELETE /api/invoices/:invoiceId/items/:itemId (remove job item)
- [x] 5.19 Implement POST /api/tax-definitions (create)
- [x] 5.20 Implement GET /api/tax-definitions (list, filterable by status)
- [x] 5.21 Implement PATCH /api/tax-definitions/:id (update)
- [x] 5.22 Implement POST /api/tax-definitions/:id/archive (archive)
- [x] 5.23 Implement POST /api/work-templates (create)
- [x] 5.24 Implement GET /api/work-templates (list, filterable by status)
- [x] 5.25 Implement PATCH /api/work-templates/:id (update)
- [x] 5.26 Implement POST /api/work-templates/:id/archive (archive)
- [x] 5.27 Implement GET /api/document-sequences (retrieve current state by type/year)
- [x] 5.28 Implement POST /api/document-sequences/adjust (manual number adjustment)

## 6. Frontend - Components and Utilities

**Architectural Note**: React hooks established (`useBudgets`, `useInvoices`, `useTaxDefinitions`, `useWorkTemplates`) in `/src/presentation/hooks/commercial-document-hooks.ts`. All components follow established patterns: form handlers with error states, loading indicators, and integrated API calls via hooks.

- [x] 6.1 Create BudgetForm component (client selector, worker selector, notes field, delivered date picker, tax selector, optional pre-filled job items from template)
- [x] 6.2 Create InvoiceForm component (client selector, worker selector, notes field, issued date picker, tax selector, optional budget selector, optional pre-filled job items)
- [x] 6.3 Create JobItemForm component (title, description, quantity, unitPrice, totalPrice inputs; calculate totalPrice on blur)
- [x] 6.4 Create JobItemsTable component (display list with edit/delete buttons, position ordering)
- [x] 6.5 Create CommercialDocumentView component (display read-only header with materialized snapshots)
- [x] 6.6 Create BudgetList page (list, filters, quick actions for new/view)
- [x] 6.7 Create BudgetDetail page (view and edit, display job items, display calculated totals)
- [x] 6.8 Create InvoiceList page (list, filters by client/year, quick actions)
- [x] 6.9 Create InvoiceDetail page (view and edit, display job items, display source budget if linked)
- [x] 6.10 Create TaxCatalogManager component (list taxes, add new, edit, archive)
- [x] 6.11 Create WorkTemplateCatalogManager component (list templates, add new, edit, archive)
- [x] 6.12 Create DocumentSequenceSettings component (display current next numbers, allow manual adjustment)
- [x] 6.13 Create CommericalDocumentCatalogAndSettings page (tabs for taxes, templates, numbering)
- [x] 6.14 Create API client hooks (useBudgets, useInvoices, useTaxDefinitions, useWorkTemplates, useDocumentSequence, etc.)
- [x] 6.15 Create form submission handlers (create, update)

## 7. Navigation and Routing

**Architectural Note**: Next.js App Router patterns established. Routes follow conventional structure: `/budgets`, `/budgets/[id]`, `/budgets/new`, etc. Navigation component updated in main layout to include new sections with conditionally-rendered quick action buttons.

- [x] 7.1 Add /budgets route and page layout
- [x] 7.2 Add /budgets/new route for creating new budget
- [x] 7.3 Add /budgets/:id route for viewing/editing budget
- [x] 7.4 Add /invoices route and page layout
- [x] 7.5 Add /invoices/new route for creating new invoice
- [x] 7.6 Add /invoices/:id route for viewing/editing invoice
- [x] 7.7 Add /settings/catalog route for commercial document catalog and settings
- [x] 7.8 Update main navigation component to include Budgets, Invoices, Settings links
- [x] 7.9 Add quick action buttons (+Budget, +Invoice) to main layout
- [x] 7.10 Update app layout to preserve navigation across all new routes

## 8. Integration and Verification

**Architectural Note**: Test scenarios follow the Arrange-Act-Assert pattern. Verification covers end-to-end workflows (creation → modification → finalization), snapshot immutability (source changes don't affect materialized data), transactional numbering (no duplicates even under concurrency), and total calculations with optional taxes.

- [x] 8.1 End-to-end test: create budget → add job items → apply tax
- [x] 8.2 End-to-end test: create invoice → link to budget → add/edit job items
- [x] 8.3 End-to-end test: create/edit/archive tax definition, verify new docs use it
- [x] 8.4 End-to-end test: create/edit/archive work template, verify template appears in job item form
- [x] 8.5 Verify numbering: budget gets global sequential number
- [x] 8.6 Verify numbering: invoice gets year-scoped sequential number
- [x] 8.7 Verify snapshot immutability: update source client/worker after budget creation, confirm budget snapshot unchanged
- [x] 8.8 Verify snapshot immutability: update source tax definition after invoice creation, confirm invoice snapshot unchanged
- [x] 8.9 Verify totals calculation: subtotal, tax, total all match expected values
- [x] 8.10 Verify document totals recalculate after item and tax updates
- [x] 8.11 Verify documents remain editable from detail flows
- [x] 8.12 Verify list/detail retrieval includes created documents by default
- [x] 8.13 Verify pagination on budget/invoice lists
- [x] 8.14 Verify filters work (by client, by year for invoices)
- [x] 8.15 Test manual number adjustment in settings, verify next created document uses adjusted number

## 9. Backend Business Logic Implementation - Reconciliation

This section duplicates implementation work already captured in Sections 2-5. It is kept for historical traceability and marked complete to align checklist state with the implemented codebase.

- [x] 9.1 Create Postgres repositories for TaxDefinition, WorkTemplate, DocumentSequence
- [x] 9.2 Implement use cases for tax definitions (create, update, list, archive)
- [x] 9.3 Implement use cases for work templates (create, update, list, archive)
- [x] 9.4 Implement use cases for document sequences (get, adjust)
- [x] 9.5 Implement use cases for budgets (create with snapshot materialization, update, list)
- [x] 9.6 Implement use cases for invoices (create with snapshot materialization, update, list)
- [x] 9.7 Implement use cases for job items (add, update, remove with total recalculation)
- [x] 9.8 Add request validators for all budget/invoice/tax/template payloads
- [x] 9.9 Add mappers to convert domain entities to API response schemas
- [x] 9.10 Implement transactional number allocation for budgets (global sequence)
- [x] 9.11 Implement transactional number allocation for invoices (year-scoped sequence)
- [x] 9.12 Implement snapshot materialization: ClientSnapshot, WorkerSnapshot, TaxSnapshot
- [x] 9.13 Connect all route handlers to repositories and use cases
- [x] 9.14 Add comprehensive error handling and validation
- [x] 9.15 Add database migrations for budgets, invoices, job_items, tax_definitions, work_templates, document_sequences tables
