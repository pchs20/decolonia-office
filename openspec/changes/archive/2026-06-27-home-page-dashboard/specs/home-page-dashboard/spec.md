## ADDED Requirements

### Requirement: Dashboard quick-action buttons
The system SHALL display two prominent, card-sized action buttons on the home page: one to create a new budget and one to create a new invoice. Each button SHALL be large enough to be comfortably tapped on an iPad.

#### Scenario: New budget button navigates to the new budget form
- **WHEN** the user taps or clicks the "New Budget" quick-action button
- **THEN** the system SHALL navigate to `/budgets/new`

#### Scenario: New invoice button navigates to the new invoice form
- **WHEN** the user taps or clicks the "New Invoice" quick-action button
- **THEN** the system SHALL navigate to `/invoices/new`

---

### Requirement: Recent budgets section
The system SHALL display the 5 most recently created budgets on the home page as a list of tappable cards. Each card SHALL show the budget number, client name, total amount, and creation date.

#### Scenario: Recent budgets are shown on load
- **WHEN** the home page finishes loading
- **THEN** the system SHALL display up to 5 budget cards ordered by `createdAt` descending

#### Scenario: Budget card navigates to the budget detail
- **WHEN** the user taps or clicks a budget card
- **THEN** the system SHALL navigate to `/budgets/<id>`

#### Scenario: "See all" link is present
- **WHEN** the recent budgets section is rendered
- **THEN** a "See all" link SHALL be visible and SHALL navigate to `/budgets`

#### Scenario: No budgets exist
- **WHEN** the user has no budgets yet
- **THEN** the section SHALL display an empty-state message instead of cards

---

### Requirement: Recent invoices section
The system SHALL display the 5 most recently created invoices on the home page as a list of tappable cards. Each card SHALL show the invoice number, client name, total amount, and creation date.

#### Scenario: Recent invoices are shown on load
- **WHEN** the home page finishes loading
- **THEN** the system SHALL display up to 5 invoice cards ordered by `createdAt` descending

#### Scenario: Invoice card navigates to the invoice detail
- **WHEN** the user taps or clicks an invoice card
- **THEN** the system SHALL navigate to `/invoices/<id>`

#### Scenario: "See all" link is present
- **WHEN** the recent invoices section is rendered
- **THEN** a "See all" link SHALL be visible and SHALL navigate to `/invoices`

#### Scenario: No invoices exist
- **WHEN** the user has no invoices yet
- **THEN** the section SHALL display an empty-state message instead of cards

---

### Requirement: Dashboard i18n support
All text strings on the home page dashboard SHALL be translatable and available in Catalan (`ca`), Spanish (`es`), and English (`en`).

#### Scenario: Dashboard renders in the active locale
- **WHEN** the user has `ca` set as their locale
- **THEN** all dashboard text SHALL render in Catalan
