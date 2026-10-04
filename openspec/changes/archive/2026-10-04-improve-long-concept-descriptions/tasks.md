## 1. Auto-Growing Description Editor

- [x] 1.1 Update the shared `JobItemForm` description textarea to auto-grow from a three-line minimum based on rendered content.
- [x] 1.2 Cap the description textarea at approximately fifteen visual lines and enable internal vertical scrolling beyond the cap.
- [x] 1.3 Preserve the existing plain-text value, newline entry, submit, cancel, dirty-state, and loading behavior while adding auto-growth.

## 2. Complete Description Display

- [x] 2.1 Update the shared `JobItemsTable` description styling to preserve line breaks and blank lines.
- [x] 2.2 Ensure long unbroken description content wraps within the description column without horizontal overflow.
- [x] 2.3 Keep complete descriptions visible without truncation, line clamping, ellipses, or expansion controls.

## 3. Verification

- [x] 3.1 Evaluate focused component coverage. The current Jest setup uses the Node environment and has no DOM testing library, so browser layout behavior is covered by type/build validation rather than new component tests.
- [x] 3.2 Run the relevant checks: `pnpm test` and `pnpm check` passed; `pnpm build` was intentionally skipped at the user's request after timing out during production optimization.
- [x] 3.3 Perform manual OpenSpec completeness and coherence review. The installed OpenSpec CLI does not expose a `verify` command.
