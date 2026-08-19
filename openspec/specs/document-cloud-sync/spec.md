# Document Cloud Sync

## Purpose

Define manual, one-way synchronization of application data and generated PDFs to a shared Google Drive destination.

## Requirements

### Requirement: Manually initiate cloud synchronization
The system SHALL provide an authenticated Backup & Export settings surface with a manual action that starts synchronization of the current clients, budgets, invoices, spreadsheet data, and generated PDFs to the configured cloud provider.

#### Scenario: Worker starts a cloud sync
- **WHEN** an authenticated worker selects `Sync to Google Drive`
- **THEN** the system starts a one-way export workflow to the configured shared Google Drive folder and reports its progress to the worker

#### Scenario: Worker has not granted Drive access
- **WHEN** an authenticated worker starts a cloud sync without a valid Google Drive authorization
- **THEN** the system asks the worker to authorize Drive access and does not start synchronization until authorization succeeds

#### Scenario: Backup settings show the correct primary cloud action
- **WHEN** the Backup & Export settings surface loads
- **THEN** it shows `Authorize Google Drive` when Drive authorization is unavailable and shows `Sync to Google Drive` when authorization is available, never presenting both as simultaneous primary actions

#### Scenario: Authorization status is checked without exposing credentials
- **WHEN** the Backup & Export settings surface requests Drive authorization status
- **THEN** the system returns only whether the current worker can authorize/synchronize and never returns access or refresh token values

#### Scenario: Cloud sync does not run automatically
- **WHEN** a client, budget, or invoice is created or updated
- **THEN** the system does not initiate a cloud synchronization request

#### Scenario: Unauthenticated worker attempts to sync
- **WHEN** an unauthenticated request attempts to start or continue a cloud sync
- **THEN** the system rejects the request according to the application's API authentication contract

### Requirement: Export structured data to one spreadsheet
The system SHALL maintain one cloud spreadsheet named `Decolonia-data` at the root of the shared `Decolonia` folder, containing current-state tabs named `Clients`, `Budgets`, and `Invoices`.

#### Scenario: Sync refreshes the spreadsheet snapshot
- **WHEN** a cloud synchronization completes its spreadsheet step
- **THEN** the `Clients`, `Budgets`, and `Invoices` tabs represent the current database state at the time the snapshot was assembled

#### Scenario: Spreadsheet contains stable source identifiers
- **WHEN** rows are written to any export tab
- **THEN** each row includes the corresponding application identifier and human-readable document number where applicable

#### Scenario: Spreadsheet sync is retried
- **WHEN** a worker retries a synchronization after a previous spreadsheet step failed or was interrupted
- **THEN** the system refreshes the same configured spreadsheet rather than creating an unbounded duplicate spreadsheet

### Requirement: Export document PDFs using a browsable folder hierarchy
The system SHALL generate current budget and invoice PDFs using the existing PDF rendering behavior and place them in the cloud provider's configured application folder using this structure:

```text
Decolonia/
  Decolonia-data.xlsx
  Budgets/<year>/<quarter>/<budget-pdf>
  Invoices/<year>/<quarter>/<invoice-pdf>
```

Quarter folders SHALL use `Q1`, `Q2`, `Q3`, and `Q4`, with each quarter representing three calendar months.

#### Scenario: Budget PDF is stored in its quarter folder
- **WHEN** a budget is included in a cloud synchronization
- **THEN** its current PDF is generated and stored under `Budgets/<year>/<quarter>/` using the selected budget date and the configured budget filename convention

#### Scenario: Invoice PDF is stored in its quarter folder
- **WHEN** an invoice is included in a cloud synchronization
- **THEN** its current PDF is generated and stored under `Invoices/<year>/<quarter>/` using its issued date and the configured invoice filename convention

#### Scenario: Document date changes to another quarter after a prior sync
- **WHEN** a previously synchronized budget or invoice has a changed date
- **THEN** the system updates the existing provider file and places it in the folder corresponding to the new year and quarter instead of creating an unnecessary duplicate

### Requirement: Track persistent export state per provider, destination, and document
The system SHALL store cloud export metadata in a separate provider-neutral export-state table rather than adding provider fields to client, budget, or invoice domain tables. Persistent state SHALL identify the shared destination so all authorized workers update the same exported files.

#### Scenario: First PDF synchronization records the provider reference
- **WHEN** a budget or invoice PDF is uploaded successfully for a provider and shared destination for the first time
- **THEN** the system stores the document type, application document ID, provider, stable destination reference, provider-opaque external reference, source version or update timestamp, and successful synchronization timestamp

#### Scenario: Existing PDF synchronization updates in place
- **WHEN** a budget or invoice has an export-state record for the configured provider and shared destination and its source data changed since the last successful synchronization
- **THEN** the system updates the referenced provider file in place and records the new successful source version and synchronization timestamp

#### Scenario: Unchanged PDF is skipped
- **WHEN** a budget or invoice has an export-state record for the configured provider and shared destination whose successful source version matches the current source data
- **THEN** the system does not regenerate or upload that PDF during an incremental synchronization

#### Scenario: Export state supports multiple providers
- **WHEN** the same document is synchronized to two different providers or two different authorized Drive owners
- **THEN** the system stores independent export-state records keyed by document, provider, and destination

### Requirement: Process cloud synchronization in bounded resumable batches
The system SHALL process cloud synchronization through bounded requests that return enough progress information for the client to continue until the workflow is complete.

#### Scenario: Batch reports continuation
- **WHEN** a synchronization batch completes while documents remain to be processed
- **THEN** the response reports processed and remaining work and indicates that the client can request the next batch

#### Scenario: Interrupted sync resumes
- **WHEN** the browser closes or a request fails after some documents in a synchronization have completed successfully
- **THEN** a later manual synchronization skips or updates completed documents according to their export state and continues with unfinished documents

#### Scenario: Individual success is recorded after remote success
- **WHEN** a provider operation for one document succeeds
- **THEN** the system records that document's export state before reporting it as completed

### Requirement: Surface partial failures and allow retry
The system SHALL report cloud provider and document-level failures without falsely marking failed exports as successful.

#### Scenario: One document fails in a batch
- **WHEN** a PDF upload or update fails for one document while other batch operations succeed
- **THEN** the system reports the failed document, preserves successful export state for completed documents, and allows a later retry

#### Scenario: Provider configuration is invalid
- **WHEN** synchronization starts without valid Drive authorization for the logged-in worker or access to the shared destination
- **THEN** the system reports an authorization/configuration error and does not begin destructive or partial document processing

### Requirement: Detailed sync completion feedback with document paths
The system SHALL provide comprehensive sync completion feedback that shows the full Google Drive paths for uploaded documents, categorizes results by status, and enables users to verify sync success and file locations.

#### Scenario: Sync completion displays uploaded document paths
- **WHEN** a cloud synchronization completes successfully
- **THEN** the sync completion message lists each uploaded document with its full Google Drive path in the format `Folder/Year/Quarter/filename.pdf` (e.g., `Budgets/2026/Q3/presupuesto-005.pdf`)

#### Scenario: Sync completion shows skipped document count
- **WHEN** a cloud synchronization completes and some documents were not re-uploaded because their source data had not changed since the last successful sync
- **THEN** the sync completion summary includes a count of skipped documents in the header (e.g., "✅ Sync completed (8 uploaded, 2 skipped, 1 failed)")

#### Scenario: Sync completion lists failed documents with error details
- **WHEN** a cloud synchronization completes and one or more documents failed to upload
- **THEN** the sync completion message lists each failed document with its type, ID, and error reason under a "Failed" section

#### Scenario: Sync completion summary aggregates batch results
- **WHEN** a cloud synchronization runs in multiple batches and completes
- **THEN** the final sync completion message aggregates all uploaded, skipped, and failed documents across all batches into a single comprehensive report

#### Scenario: User can verify file locations by paths shown
- **WHEN** a user sees the sync completion message with document paths
- **THEN** they can navigate to their Google Drive and find the files at the displayed paths to verify backup success
