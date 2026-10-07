## ADDED Requirements

### Requirement: Google Drive sync removes inactive records from the spreadsheet
The next Google Drive synchronization SHALL rebuild active data tables so inactive clients, budgets, and invoices are absent from the synchronized spreadsheet.

#### Scenario: Sync after a client is soft-deleted
- **WHEN** a Google Drive sync runs after a client is marked inactive
- **THEN** the client row is absent from the synchronized Clients table while related active budgets and invoices remain present

### Requirement: Google Drive sync trashes deleted document PDFs
The next Google Drive synchronization SHALL identify previously exported budget and invoice records that are now inactive and move their tracked Drive PDFs to Google Drive trash. The sync SHALL retain enough export state to retry a failed trash operation later and SHALL report the failure.

#### Scenario: Trash an exported inactive document
- **WHEN** a sync finds an inactive budget or invoice with a tracked external Drive file reference
- **THEN** it moves that Drive file to trash and no longer treats the document as an active export

#### Scenario: Retry a failed trash operation
- **WHEN** moving an inactive document’s tracked Drive file to trash fails
- **THEN** the sync records the failure, leaves the export state available for retry, and attempts it during a later sync

#### Scenario: Inactive document has no tracked Drive file
- **WHEN** a sync finds an inactive document without an external Drive file reference
- **THEN** it records no file deletion failure and does not generate a replacement PDF

### Requirement: Google Drive sync preserves historical documents for inactive clients
Google Drive synchronization SHALL continue exporting active budgets and invoices even when their client is inactive, using the document snapshots already stored on those records.

#### Scenario: Sync an active document for an inactive client
- **WHEN** a budget or invoice remains active but its client is inactive
- **THEN** the document remains in the spreadsheet and its PDF remains eligible for Drive synchronization
