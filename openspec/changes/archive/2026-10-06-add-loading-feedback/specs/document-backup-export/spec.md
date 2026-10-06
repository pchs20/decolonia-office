# Document Backup Export

## MODIFIED Requirements

### Requirement: Manually download a complete backup ZIP

The system SHALL provide an authenticated Backup & Export settings action that generates and downloads a current backup archive as a ZIP file. The action SHALL expose preparation and failure feedback while preserving the complete, stateless archive contract.

#### Scenario: Worker downloads a backup

- **WHEN** an authenticated worker selects `Download backup ZIP`
- **THEN** the system generates a backup archive, returns it as a downloadable ZIP response, and communicates that preparation is in progress until the download is ready

#### Scenario: Backup download control prevents duplicate requests

- **WHEN** a backup archive is being prepared or downloaded
- **THEN** the `Download backup ZIP` control is disabled and a second backup request cannot be initiated from the Backup & Export panel

#### Scenario: Backup download failure is actionable

- **WHEN** backup archive generation or download fails
- **THEN** the Backup & Export panel displays a localized error, restores the download control, and does not report a successful backup

#### Scenario: Unauthenticated worker attempts a backup download

- **WHEN** an unauthenticated request attempts to generate a backup archive
- **THEN** the system rejects the request according to the application's API authentication contract

### Requirement: Report local export failures safely

The system SHALL fail the backup download with an actionable error when required data or PDF generation cannot be assembled, without returning a misleading partial backup as a successful complete archive. The client SHALL return to an actionable idle state after displaying the failure.

#### Scenario: PDF generation fails

- **WHEN** a required budget or invoice PDF cannot be rendered
- **THEN** the system reports the export failure and does not label the incomplete archive as a successful complete backup

#### Scenario: Empty document collections are exported

- **WHEN** the database contains no budgets or no invoices
- **THEN** the workbook still contains the corresponding tabs and the archive contains the corresponding folders only as required by the archive format
