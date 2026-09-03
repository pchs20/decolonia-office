## Why

The add-concept action in the invoice form currently uses the budget blue instead of the invoice section's canonical green. This makes invoice editing visually inconsistent with the rest of the invoice UI and should be corrected to preserve the brand color distinction between budgets and invoices.

## What Changes

- Update the invoice form's add-concept button to use the canonical invoice green styling.
- Keep the equivalent budget-form action styled with the canonical budget blue.
- Preserve existing button behavior, labels, accessibility, and layout.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `brand-color-system`: Require invoice concept/item add actions to use the invoice green brand color and budget concept/item add actions to use budget blue.

## Impact

- Affected UI: invoice and budget form item-add action styling.
- Affected code: presentation components and any related UI color regression tests.
- No API, persistence, dependency, or data-model changes.
