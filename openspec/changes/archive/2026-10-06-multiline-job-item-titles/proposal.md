## Why

Budget and invoice concepts currently support intentional line breaks in their descriptions but not in their titles. This prevents users from presenting a concept heading across multiple lines when that is the clearest description of the work.

## What Changes

- Allow budget and invoice job-item titles to contain intentional line breaks.
- Use the same inline editing behavior for titles and descriptions, including newline entry and plain-text preservation.
- Display saved title line breaks in the budget and invoice concept table.
- Preserve title line breaks in generated budget and invoice PDFs.
- Remove the database's current 255-character title limit so titles use unrestricted plain-text storage.
- Preserve existing required-title validation, save, cancel, dirty-state, and pricing behavior.

## Capabilities

### New Capabilities

- `multiline-job-item-titles`: Multiline plain-text titles for budget and invoice concepts across editing, display, persistence, and PDF export.

### Modified Capabilities

- `long-concept-descriptions`: Extend shared concept editor and table behavior to apply newline-preserving editing and display to titles as well as descriptions.
- `budget-management`: Add intentional multiline title support to budget job items and their PDF export.
- `invoice-management`: Add intentional multiline title support to invoice job items and their PDF export.

## Impact

- Shared job-item editor and table presentation components.
- Budget and invoice PDF job-item rendering.
- Job-item database migration from `VARCHAR(255)` to unrestricted `TEXT`.
- Focused tests for newline entry, display preservation, persistence, and PDF output.
