## MODIFIED Requirements

### Requirement: Export document PDFs using a browsable folder hierarchy
The system SHALL generate current budget and invoice PDFs using the existing PDF rendering behavior and place them in the cloud provider's configured application folder using this structure for future synchronizations:

```text
Decolonia/
  Decolonia-data.xlsx
  Presupuestos/<year>/<quarter>/<budget-pdf>
  Facturas/<year>/<quarter>/<invoice-pdf>
```

Quarter folders SHALL use `Q1`, `Q2`, `Q3`, and `Q4`, with each quarter representing three calendar months. Existing `Budgets` and `Invoices` folders and their contents SHALL not be renamed, deleted, or migrated by this change. Internal document types SHALL remain `budget` and `invoice`.

#### Scenario: Budget PDF is stored in its quarter folder
- **WHEN** a budget is included in a future cloud synchronization
- **THEN** its current PDF is generated and stored under `Presupuestos/<year>/<quarter>/` using the selected budget date and the configured budget filename convention

#### Scenario: Invoice PDF is stored in its quarter folder
- **WHEN** an invoice is included in a future cloud synchronization
- **THEN** its current PDF is generated and stored under `Facturas/<year>/<quarter>/` using its issued date and the configured invoice filename convention

#### Scenario: Existing English folders are left untouched
- **WHEN** a worker starts a cloud synchronization after this change
- **THEN** the system creates or reuses `Presupuestos` and `Facturas` folders for future exports and does not rename, delete, or migrate existing `Budgets` or `Invoices` folders

#### Scenario: Document date changes to another quarter after a prior sync
- **WHEN** a previously synchronized budget or invoice has a changed date
- **THEN** the system updates the existing provider file and places it in the folder corresponding to the new year and quarter under `Presupuestos` or `Facturas` instead of creating an unnecessary duplicate

### Requirement: Detailed sync completion feedback with document paths
The system SHALL provide comprehensive sync completion feedback that shows the full Google Drive paths for uploaded documents, categorizes results by status, and enables users to verify sync success and file locations using the Spanish document folder names.

#### Scenario: Sync completion displays uploaded document paths
- **WHEN** a cloud synchronization completes successfully
- **THEN** the sync completion message lists each uploaded document with its full Google Drive path in the format `Presupuestos/Year/Quarter/filename.pdf` or `Facturas/Year/Quarter/filename.pdf`

#### Scenario: Sync completion shows skipped document count
- **WHEN** a cloud synchronization completes and some documents were not re-uploaded because their source data had not changed since the last successful sync
- **THEN** the sync completion summary includes a count of skipped documents in the header

#### Scenario: Sync completion lists failed documents with error details
- **WHEN** a cloud synchronization completes and one or more documents failed to upload
- **THEN** the sync completion message lists each failed document with its type, ID, and error reason under a `Failed` section

#### Scenario: Sync completion summary aggregates batch results
- **WHEN** a synchronization runs in multiple batches and completes
- **THEN** the final sync completion message aggregates all uploaded, skipped, and failed documents across all batches into a single comprehensive report

#### Scenario: User can verify file locations by paths shown
- **WHEN** a user sees the sync completion message with document paths
- **THEN** each path uses the same Spanish folder hierarchy as the corresponding Google Drive location
