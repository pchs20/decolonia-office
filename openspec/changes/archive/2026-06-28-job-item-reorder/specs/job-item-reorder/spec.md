## ADDED Requirements

### Requirement: Reorder job items within a commercial document
The system SHALL allow users to move a job item one position up or down within the ordered list of a budget or invoice while in edit mode.

#### Scenario: Move item up
- **WHEN** user clicks the "move up" button on a job item that is not the first in the list
- **THEN** system swaps its position with the item immediately above it and re-renders the list in the new order

#### Scenario: Move item down
- **WHEN** user clicks the "move down" button on a job item that is not the last in the list
- **THEN** system swaps its position with the item immediately below it and re-renders the list in the new order

#### Scenario: Move up disabled for first item
- **WHEN** the job items list is rendered in edit mode
- **THEN** the "move up" control on the first item (lowest position) SHALL be disabled

#### Scenario: Move down disabled for last item
- **WHEN** the job items list is rendered in edit mode
- **THEN** the "move down" control on the last item (highest position) SHALL be disabled

#### Scenario: Reorder persisted immediately
- **WHEN** a user triggers a move up or move down action
- **THEN** the server persists the new positions of the two affected items atomically before the UI confirms the change

#### Scenario: Order preserved on reload
- **WHEN** user navigates away and returns to the document edit view
- **THEN** job items are displayed in the same order that was last saved
