# App Navigation Shell Specification (Delta)

## MODIFIED Requirements

### Requirement: Main navigation menu
The system SHALL display a navigation menu in the main layout with links to all available features.

#### Scenario: Budgets menu item added
- **WHEN** main navigation menu is rendered
- **THEN** system includes a "Budgets" link that navigates to the budgets list page

#### Scenario: Invoices menu item added
- **WHEN** main navigation menu is rendered
- **THEN** system includes an "Invoices" link that navigates to the invoices list page

#### Scenario: Settings menu item added
- **WHEN** main navigation menu is rendered
- **THEN** system includes a "Settings" link that navigates to the commercial document catalog and settings page

## ADDED Requirements

### Requirement: Quick action buttons
The system SHALL provide quick action buttons in the navigation or toolbar for creating new budgets and invoices.

#### Scenario: Create new budget button
- **WHEN** user is anywhere in the app
- **THEN** system displays a floating or toolbar button (e.g., "+ Budget") that navigates to the new budget form

#### Scenario: Create new invoice button
- **WHEN** user is anywhere in the app
- **THEN** system displays a floating or toolbar button (e.g., "+ Invoice") that navigates to the new invoice form
