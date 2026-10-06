# multiline-job-item-titles Specification

## Purpose
TBD - created by archiving change multiline-job-item-titles. Update Purpose after archive.
## Requirements
### Requirement: Job-item titles support intentional line breaks
Budget and invoice job-item titles SHALL accept and persist intentional line breaks as plain text without a length restriction imposed by the database.

#### Scenario: User enters a multiline title
- **WHEN** a user presses Enter while editing a job-item title
- **THEN** the editor inserts a newline into the title instead of submitting the item

#### Scenario: Multiline title is saved
- **WHEN** a user saves a job item whose title contains line breaks
- **THEN** the complete title, including its line breaks, is persisted and returned unchanged

#### Scenario: Long title is accepted
- **WHEN** a user saves a job-item title longer than 255 characters
- **THEN** the title is accepted without truncation or database length validation failure

### Requirement: Job-item titles preserve line breaks in displays
Budget and invoice concept tables and generated PDFs SHALL render job-item title line breaks as visible line breaks while preserving the title's plain-text content.

#### Scenario: Web table preserves title line breaks
- **WHEN** a saved job item has a multiline title
- **THEN** the budget or invoice concept table displays each explicit title line on its own line

#### Scenario: PDF preserves title line breaks
- **WHEN** a budget or invoice containing a multiline job-item title is exported
- **THEN** the PDF renders each explicit title line on its own line and keeps the title associated with its item's description and pricing

#### Scenario: Long title wraps within available space
- **WHEN** a title line exceeds the available concept column width
- **THEN** the line wraps within the column without clipping, truncation, or horizontal overflow

### Requirement: Existing job-item behavior remains intact
Multiline title support SHALL apply consistently to budget and invoice job items without changing required-title validation, description behavior, pricing calculations, persistence of other fields, or existing save and cancel behavior.

#### Scenario: Empty title remains invalid
- **WHEN** a user submits a job item whose title contains only whitespace and line breaks
- **THEN** the item is rejected by the existing required-title validation

#### Scenario: Budget and invoice forms behave consistently
- **WHEN** a user adds or edits a job item from either a budget or invoice form
- **THEN** the title uses the same multiline editing and display behavior in both forms

