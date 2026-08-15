# Document Backup Export

## Purpose

Define stateless local backup downloads containing the structured application data and generated document PDFs.

## Requirements

### Requirement: Manually download a complete backup ZIP
The system SHALL provide an authenticated Backup & Export settings action that generates and downloads a current backup archive as a ZIP file.

#### Scenario: Worker downloads a backup
- **WHEN** an authenticated worker selects `Download backup ZIP`
- **THEN** the system generates a backup archive and returns it as a downloadable ZIP response

#### Scenario: Unauthenticated worker attempts a backup download
- **WHEN** an unauthenticated request attempts to generate a backup archive
- **THEN** the system rejects the request according to the application's API authentication contract

### Requirement: ZIP contains the complete structured backup
The system SHALL include one workbook containing `Clients`, `Budgets`, and `Invoices` data, plus current budget and invoice PDFs, in the downloaded archive.

#### Scenario: Backup contains structured data
- **WHEN** a backup archive is generated
- **THEN** it contains a workbook with tabs named `Clients`, `Budgets`, and `Invoices`, including stable application identifiers and human-readable document numbers where applicable

#### Scenario: Backup contains current budget PDFs
- **WHEN** budgets exist at the time the backup is assembled
- **THEN** the archive contains a current rendered PDF for each budget

#### Scenario: Backup contains current invoice PDFs
- **WHEN** invoices exist at the time the backup is assembled
- **THEN** the archive contains a current rendered PDF for each invoice

### Requirement: ZIP mirrors the cloud folder organization
The system SHALL organize ZIP entries using the same logical structure as the persistent cloud destination:

```text
<workbook>.xlsx
Budgets/<year>/<quarter>/<budget-pdf>
Invoices/<year>/<quarter>/<invoice-pdf>
```

Quarter folders SHALL use `Q1`, `Q2`, `Q3`, and `Q4`, with each quarter representing three calendar months.

#### Scenario: Backup places PDFs by year and quarter
- **WHEN** a budget or invoice PDF is added to the archive
- **THEN** its path contains the document type, its selected year, and its `Q1` through `Q4` quarter folder

#### Scenario: Backup uses deterministic document paths
- **WHEN** the same current database state is exported more than once
- **THEN** equivalent documents use the same relative archive paths and filenames, apart from the archive's timestamped outer filename

#### Scenario: Workbook is at the archive root
- **WHEN** a backup archive is generated
- **THEN** the workbook is stored at the ZIP root as `Decolonia-data.xlsx`, not inside a `Data` subfolder

### Requirement: ZIP export is stateless and one-way
The system SHALL generate each backup archive from current database state without creating or updating persistent cloud export-state records.

#### Scenario: Repeated local downloads are independent
- **WHEN** a worker downloads two backups without changing the database
- **THEN** each archive is generated independently and neither download depends on a previous export-state record

#### Scenario: Local download does not import data
- **WHEN** a backup archive is generated or downloaded
- **THEN** the system does not modify application data and does not ingest any archive contents

### Requirement: Report local export failures safely
The system SHALL fail the backup download with an actionable error when required data or PDF generation cannot be assembled, without returning a misleading partial backup as a successful complete archive.

#### Scenario: PDF generation fails
- **WHEN** a required budget or invoice PDF cannot be rendered
- **THEN** the system reports the export failure and does not label the incomplete archive as a successful complete backup

#### Scenario: Empty document collections are exported
- **WHEN** the database contains no budgets or no invoices
- **THEN** the workbook still contains the corresponding tabs and the archive contains the corresponding folders only as required by the archive format
