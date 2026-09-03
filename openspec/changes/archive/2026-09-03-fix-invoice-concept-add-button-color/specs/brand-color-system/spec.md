## MODIFIED Requirements

### Requirement: Section "New" and item-add action buttons use brand colors
Each section's primary action button (e.g., "New Budget", "New Invoice", "New Client") and each commercial document's item-add action, including the nested add/submit action in the line-item form, SHALL use that section's canonical brand color as its background.

#### Scenario: Budgets "New" and item-add buttons use budget blue
- **WHEN** the budgets list page or budget form is rendered
- **THEN** the relevant primary "New" or item-add action button SHALL use `bg-budgets` (blue)

#### Scenario: Invoices "New" and nested item-add buttons use invoice green
- **WHEN** the invoices list page or invoice form is rendered
- **THEN** the relevant primary "New", item-add, and nested line-item submit action buttons SHALL use `bg-invoices` (green)

#### Scenario: Clients "New" button uses client amber
- **WHEN** the clients list page is rendered
- **THEN** the primary "New" action button SHALL use `bg-clients` (amber), NOT green

#### Scenario: Settings active tabs use settings violet
- **WHEN** a settings sub-tab is active
- **THEN** the active tab indicator SHALL use `text-settings border-settings` (violet), NOT blue
