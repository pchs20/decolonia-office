## Purpose

Define catalog and settings capabilities for taxes, work templates, and document numbering state used by budgets and invoices.

## Requirements

### Requirement: Create a tax definition
The system SHALL allow users to create reusable tax definitions (e.g., IVA 21%) for use in budgets and invoices.

#### Scenario: Create a new tax
- **WHEN** user fills out the new tax form with name (e.g., "IVA 21%"), rate (e.g., 21), and behavior (added)
- **THEN** system creates the tax definition as active and stores it in the catalog

#### Scenario: Tax appears in dropdown
- **WHEN** tax definition is created
- **THEN** system displays it in the tax selection dropdown for budget and invoice forms

### Requirement: Edit tax definition
The system SHALL allow users to modify existing tax definitions.

#### Scenario: Update tax rate and name
- **WHEN** user edits a tax definition's name or rate
- **THEN** system persists changes; future budgets/invoices using this tax will apply the new rate, but existing documents retain their materialized snapshot

#### Scenario: Deactivate a tax
- **WHEN** user marks a tax definition as inactive
- **THEN** system hides it from the tax selection dropdown for new documents; existing documents with that tax remain unchanged

### Requirement: Archive tax definition
The system SHALL allow users to deactivate and reactivate tax definitions. Deactivation removes the tax from new document selection dropdowns; reactivation restores it. Both operations are available from the tax catalog manager in settings.

#### Scenario: Deactivate a tax from settings
- **WHEN** user clicks "Deactivate" on an active tax definition in the settings catalog
- **THEN** system sets the tax to inactive and the row status badge changes to "Inactive"

#### Scenario: Reactivate a tax from settings
- **WHEN** user clicks "Reactivate" on an inactive tax definition in the settings catalog
- **THEN** system sets the tax to active and the row status badge changes to "Active"

#### Scenario: Inactive tax hidden from document forms
- **WHEN** a tax definition is inactive
- **THEN** it does NOT appear in the tax selection dropdown when editing budget or invoice line items

### Requirement: List tax definitions
The system SHALL display all tax definitions (active and inactive) in the settings catalog with name, rate, behavior, and status. Status SHALL be displayed as a badge with correct label ("Active" or "Inactive").

#### Scenario: View tax catalog
- **WHEN** user navigates to the settings/catalog page
- **THEN** system displays all taxes including inactive ones, each showing its current status badge

### Requirement: Create a work template
The system SHALL allow users to create reusable work/job templates with title, description, and default unit price for quick insertion into budgets and invoices.

#### Scenario: Create a new work template
- **WHEN** user fills out the new template form with title (e.g., "Interior Painting - Per Sq M"), description, and optional default unit price
- **THEN** system creates the template as active

#### Scenario: Template available for reuse
- **WHEN** a work template is created
- **THEN** user can select it when adding job items, and system pre-fills the job item title, description, and unitPrice

### Requirement: Edit work template
The system SHALL allow users to modify existing work templates.

#### Scenario: Update template details
- **WHEN** user edits a template's title, description, or default unit price
- **THEN** system persists changes; templates used in existing documents are not affected (job items contain materialized copies, not references)

#### Scenario: Deactivate a template
- **WHEN** user marks a template as inactive
- **THEN** system hides it from the template selection dropdown for new job items; existing documents remain unchanged

### Requirement: Archive work template
The system SHALL allow users to deactivate and reactivate work templates. Deactivation removes the template from job item form dropdowns; reactivation restores it. Both operations are available from the work template catalog manager in settings.

#### Scenario: Deactivate a work template from settings
- **WHEN** user clicks "Deactivate" on an active work template in the settings catalog
- **THEN** system sets the template to inactive and the row status badge changes to "Inactive"

#### Scenario: Reactivate a work template from settings
- **WHEN** user clicks "Reactivate" on an inactive work template in the settings catalog
- **THEN** system sets the template to active and the row status badge changes to "Active"

#### Scenario: Inactive template hidden from job item form
- **WHEN** a work template is inactive
- **THEN** it does NOT appear in the template selection dropdown in the job item form

### Requirement: List work templates
The system SHALL display all work templates (active and inactive) in the settings catalog with title, description, default unit price, and status. Status SHALL be displayed as a badge with correct label ("Active" or "Inactive").

#### Scenario: View work template catalog
- **WHEN** user navigates to the settings/catalog page
- **THEN** system displays all templates including inactive ones, each showing its current status badge

### Requirement: Edit tax definition from catalog row
The system SHALL allow users to edit an existing tax definition directly from the catalog list row without navigating away.

#### Scenario: Edit a tax
- **WHEN** user clicks "Edit" on a tax definition row
- **THEN** an inline edit form appears pre-populated with the current name, rate, and behavior

#### Scenario: Save tax edit
- **WHEN** user submits the inline edit form with valid data
- **THEN** system persists the changes and the row reflects the updated values

#### Scenario: Cancel tax edit
- **WHEN** user clicks "Cancel" in the inline edit form
- **THEN** the form is dismissed and the original row is restored unchanged

### Requirement: Edit work template from catalog row
The system SHALL allow users to edit an existing work template directly from the catalog list row without navigating away.

#### Scenario: Edit a work template
- **WHEN** user clicks "Edit" on a work template row
- **THEN** an inline edit form appears pre-populated with the current title, description, and default unit price

#### Scenario: Save work template edit
- **WHEN** user submits the inline edit form with valid data
- **THEN** system persists the changes and the row reflects the updated values

#### Scenario: Cancel work template edit
- **WHEN** user clicks "Cancel" in the inline edit form
- **THEN** the form is dismissed and the original row is restored unchanged

### Requirement: Manage document numbering state
The system SHALL allow users to view and adjust the next sequential number for budgets (global scope) and invoices (per-year scope).

#### Scenario: View next budget number
- **WHEN** user opens the settings/numbering configuration
- **THEN** system displays the next budget number to be auto-assigned (e.g., "Next Budget Number: #15")

#### Scenario: Manually adjust budget next number
- **WHEN** user edits the next budget number field and saves
- **THEN** system updates the state; the next budget created will use the new number

#### Scenario: View next invoice number by year
- **WHEN** user opens the settings/numbering configuration
- **THEN** system displays the next invoice number for the current year (e.g., "Next Invoice Number (2026): #8") and allows viewing/adjusting numbers for other years

#### Scenario: Manually adjust invoice next number for a year
- **WHEN** user edits the next invoice number for a specific year and saves
- **THEN** system updates the state; the next invoice created in that year will use the new number

### Requirement: Settings UI organization
The system SHALL organize catalog and numbering management in a single settings/configuration page accessible from the main navigation.

#### Scenario: Access settings from navigation
- **WHEN** user clicks "Settings" or similar in the main navigation
- **THEN** system displays a settings/catalog page with tabs or sections for taxes, work templates, and numbering configuration

#### Scenario: Settings page structure
- **WHEN** user is on the settings page
- **THEN** system displays:
  - Tax definitions section with list and "Add New Tax" button
  - Work templates section with list and "Add New Template" button
  - Numbering configuration section with editable fields for next budget number and per-year invoice numbers
