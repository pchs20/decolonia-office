## ADDED Requirements

### Requirement: Export budget to PDF from detail view
The system SHALL provide an export action on the budget detail page that triggers a PDF download for the displayed budget.

#### Scenario: Export PDF button visible in view mode
- **WHEN** a user views a budget detail page (not in edit mode)
- **THEN** an "Export PDF" button is visible in the page header actions

#### Scenario: Clicking Export PDF downloads the budget PDF
- **WHEN** a user clicks "Export PDF" on a budget detail page
- **THEN** the browser downloads a PDF file named `presupuesto-{number}.pdf` containing the budget data

#### Scenario: Export PDF button not visible in edit mode
- **WHEN** a user is in budget edit mode
- **THEN** the "Export PDF" button is not shown
