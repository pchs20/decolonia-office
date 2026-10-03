## ADDED Requirements

### Requirement: Export filenames identify the document safely
The system SHALL generate local and cloud PDF export filenames using the document type, a sanitized representation of the user-facing identifier, and a stable suffix derived from the internal document UUID. The filename strategy SHALL prevent duplicate export paths for different documents.

#### Scenario: Export two documents with the same identifier
- **WHEN** two invoices have the identifier `42` and are exported to the same destination period
- **THEN** each invoice receives a distinct PDF filename containing a stable document-specific suffix

#### Scenario: Export an identifier containing separators
- **WHEN** a budget identifier contains `/`, spaces, or other filename-sensitive characters
- **THEN** the exported filename sanitizes those characters while retaining a stable unique suffix

### Requirement: Export synchronization remains keyed by internal identity
The system SHALL use document type and internal document UUID to associate an exported PDF with its source document. Changing a document identifier SHALL update or rename that document's existing export rather than affecting another document with the same identifier.

#### Scenario: Rename an exported budget
- **WHEN** an exported budget changes from identifier `42` to `CLIENT-A/2026`
- **THEN** the synchronization updates the export associated with that budget UUID and reports the new path
