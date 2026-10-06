## MODIFIED Requirements

### Requirement: Auto-growing concept description editor
The budget and invoice concept editor SHALL provide inline plain-text textareas for both the title and description fields. Each textarea SHALL have a minimum height of three visual lines, grow automatically as its content grows until it reaches a maximum height of approximately fifteen visual lines, and provide internal vertical scrolling for additional content after reaching that maximum.

#### Scenario: Empty fields start at the minimum height
- **WHEN** a user adds or edits a concept with an empty title or description
- **THEN** each inline textarea displays at least three visual lines of editing space

#### Scenario: Fields grow with wrapped content
- **WHEN** a user enters plain text in the title or description that occupies more than the current textarea height and fewer than approximately fifteen visual lines
- **THEN** that textarea grows to expose the content without requiring internal scrolling

#### Scenario: Very long field becomes internally scrollable
- **WHEN** a user enters plain text in the title or description that occupies more than approximately fifteen visual lines
- **THEN** that textarea remains capped at approximately fifteen visual lines and provides vertical scrolling for the remaining content

#### Scenario: Newlines remain editable as plain text
- **WHEN** a user enters explicit line breaks or blank lines in the title or description
- **THEN** the editor preserves those characters and does not interpret the content as rich text or markup

### Requirement: Complete concept description display
The budget and invoice concept table SHALL display the complete saved plain-text title and description for each concept. The display SHALL preserve explicit line breaks and blank lines, wrap long unbroken lines within the concept column, and avoid truncation, line clamping, ellipses, or a separate expansion action.

#### Scenario: Saved title and description are fully visible
- **WHEN** a concept has a title or description longer than the editor's minimum height
- **THEN** the concept table displays the complete field content in the concept row

#### Scenario: Paragraph structure is preserved
- **WHEN** a saved title or description contains explicit line breaks or blank lines
- **THEN** the table renders those line breaks and blank lines visibly

#### Scenario: Long lines wrap within the table
- **WHEN** a saved title or description contains a line longer than the available concept column width
- **THEN** the line wraps within the column without causing horizontal overflow or hiding content

### Requirement: Existing concept editing behavior remains intact
The text usability improvements SHALL apply consistently to concepts edited from both budget and invoice forms without changing the existing save, cancel, dirty-state, or keyboard behavior of the shared inline concept editor.

#### Scenario: Budget concept uses the shared behavior
- **WHEN** a user adds or edits a concept from a budget form
- **THEN** the concept uses the auto-growing editor and complete table display behavior

#### Scenario: Invoice concept uses the shared behavior
- **WHEN** a user adds or edits a concept from an invoice form
- **THEN** the concept uses the auto-growing editor and complete table display behavior

#### Scenario: Cancel preserves existing dirty-state protection
- **WHEN** a user changes a title or description and cancels the inline concept editor
- **THEN** the existing unsaved-changes confirmation behavior remains available and the concept is not saved unless the user submits it

#### Scenario: Enter creates a newline in either text field
- **WHEN** the title or description textarea has focus and the user presses Enter
- **THEN** a newline is inserted into that field instead of submitting the inline concept form
