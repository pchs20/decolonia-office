## Why

Budget and invoice concepts share an inline description editor that is fixed at
two rows, making longer plain-text descriptions difficult to enter and review.
The editor should adapt to the content while keeping the surrounding document
form usable, and saved descriptions should remain fully readable in the concept
list.

## What Changes

- Make the shared concept description editor auto-grow from a three-line minimum.
- Cap automatic growth at approximately fifteen visual lines and provide internal
  vertical scrolling for longer descriptions.
- Keep the editor inline in both budget and invoice forms.
- Preserve plain-text line breaks and blank lines entered by the user.
- Display the complete saved description in the concept table with wrapping and
  preserved line breaks, without truncation or expansion controls.
- Preserve existing concept save, cancel, dirty-state, and keyboard behavior.

## Capabilities

### New Capabilities

- `long-concept-descriptions`: Responsive editing and complete display of long
  plain-text descriptions on budget and invoice concepts.

### Modified Capabilities

<!-- No existing OpenSpec capabilities are present in this repository. -->

## Impact

- Shared presentation components under
  `apps/web/src/presentation/components/commercial-documents/`.
- Both budget and invoice forms, through their shared concept editor and table.
- No API, persistence, schema, or dependency changes are expected.
- Focused component coverage may be added for auto-growth limits and preserved
  description rendering.
