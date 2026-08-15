## 1. Foundation and persistence

- [x] 1.1 Add the provider-neutral export-state migration with document type, document ID, provider, shared destination reference, external reference, source version, success timestamp, failure metadata, and a uniqueness constraint per document/provider/destination.
- [x] 1.2 Add domain-independent repository interfaces and PostgreSQL adapters for reading export state and recording per-document synchronization outcomes by provider and shared destination.
- [x] 1.3 Add application outbound ports for backup data access, PDF rendering, cloud spreadsheet operations, cloud file operations, and export-state persistence.
- [x] 1.4 Replace service-account configuration with validated Google OAuth/Drive configuration and server-side token handling without exposing credentials.
- [x] 1.5 Extend Auth.js Google callbacks/configuration to request Drive consent, retain refresh credentials server-side, identify the Google subject, and omit provider tokens from the client session.

## 2. Shared backup bundle

- [x] 2.1 Implement the bundle assembler that reads current clients, budgets, invoices, and related export data through application ports.
- [x] 2.2 Implement tabular mappers for the `Clients`, `Budgets`, and `Invoices` datasets with stable application identifiers and document numbers.
- [x] 2.3 Reuse the existing budget and invoice PDF rendering pipeline to produce current PDF bytes and deterministic filenames.
- [x] 2.4 Implement date-based destination paths using `Budgets/<year>/<quarter>/` and `Invoices/<year>/<quarter>/` with `Q1` through `Q4` quarter folders.
- [x] 2.5 Add unit tests for bundle contents, tabular mappings, PDF filenames, folder paths, empty collections, and changed document dates.

## 3. Google Drive cloud synchronization

- [x] 3.1 Add the Google Drive and Sheets integration dependency and OAuth-backed infrastructure adapter behind the application outbound ports.
- [x] 3.2 Implement per-user Drive authorization and token refresh, then discover/access one canonical worker-owned `Decolonia` folder shared with the other authorized worker.
- [x] 3.3 Implement creation and refresh of one root-level `Decolonia-data` spreadsheet with `Clients`, `Budgets`, and `Invoices` tabs.
- [x] 3.4 Implement provider file create/update operations using stored provider external references and shared destination reference, including moving an existing file when its document year or quarter changes.
- [x] 3.5 Implement incremental PDF selection using the stored source version and record export state only after each remote operation succeeds for the shared destination.
- [x] 3.6 Implement bounded sync batches with continuation state, processed/remaining counts, per-document failures, retry behavior, and idempotent completion.
- [x] 3.7 Add authenticated API routes for starting/continuing cloud synchronization and requesting Drive authorization with stable transport response schemas.
- [x] 3.8 Add integration and application tests for authorization, token refresh, shared-destination scoping, spreadsheet refresh, first upload, in-place update, unchanged-document skip, interrupted batches, partial failure, retry, and invalid authorization.

## 4. Local ZIP backup

- [x] 4.1 Add a ZIP archive adapter that packages the workbook at the ZIP root and the PDF bundle under `Budgets/<year>/<quarter>` and `Invoices/<year>/<quarter>`.
- [x] 4.2 Implement an authenticated backup-download API route with download headers and bounded/streaming response behavior appropriate to the selected archive library.
- [x] 4.3 Ensure local ZIP generation never creates or updates cloud export-state records and never mutates application data.
- [x] 4.4 Add tests for root-level workbook paths, deterministic archive paths, workbook tabs, PDF entries, empty document collections, and safe failure on incomplete bundle generation.

## 5. Backup & Export UI and verification

- [x] 5.1 Add a Backup & Export tab under Settings with one authorization-aware cloud action and a filled-purple `Download backup ZIP` action.
- [x] 5.2 Implement authorization-status loading, conditional cloud action visibility, sync progress, continuation requests, completion summary, per-document failures, and re-authorization feedback in the Settings UI.
- [x] 5.3 Add localized labels and accessible loading, authorization, success, and error states for both export actions.
- [x] 5.4 Update API/OpenAPI contracts and environment configuration/documentation for per-user Drive OAuth and the new authenticated routes.
- [x] 5.5 Run focused application, infrastructure, and UI tests plus TypeScript checks; validate a small local dataset against both Drive folder layout and ZIP layout.
