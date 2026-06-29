## MODIFIED Requirements

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

## ADDED Requirements

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
