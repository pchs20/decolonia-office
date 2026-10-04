## Context

Budgets and invoices have separate parent forms but share the presentation
components for editing and displaying concepts (`JobItemForm` and
`JobItemsTable`). The shared editor currently uses a fixed two-row textarea, and
the table renders descriptions as ordinary inline text, which does not preserve
user-entered line breaks.

The change is presentation-only. JobItem remains a value object within the
Budget/Invoice aggregate, consistent with ADR-0003. Existing API payloads,
database columns, save flows, and document export behavior already support plain
text descriptions and do not need to change.

## Architecture Diagrams

```text
BudgetForm ─────┐
                ├── JobItemForm ── textarea auto-growth
InvoiceForm ────┘

BudgetForm ─────┐
                ├── JobItemsTable ── full wrapped description display
InvoiceForm ────┘
```

The behavior belongs in the shared components so budgets and invoices cannot
drift into different description experiences.

## Goals / Non-Goals

**Goals:**

- Make the inline description field start at three visual lines.
- Grow the field based on rendered content, including wrapped lines, up to an
  approximately fifteen-line maximum.
- Keep longer content accessible through the textarea's internal vertical
  scrollbar.
- Preserve plain-text newlines and blank lines in the table display.
- Display complete descriptions with wrapping and no truncation.
- Preserve existing submit, cancel, dirty-state, and keyboard interactions.
- Avoid adding dependencies or changing API and persistence contracts.

**Non-Goals:**

- Rich-text editing, Markdown interpretation, HTML rendering, or formatting
  controls.
- A modal, drawer, or separate full-screen description editor.
- Description length limits or database migrations.
- Truncating table descriptions or adding an expansion/collapse interaction.
- Changes to PDF rendering or document export formatting.

## Decisions

### Use content-driven textarea height with fixed line bounds

The shared `JobItemForm` will calculate the description textarea height from its
content on mount and whenever the value changes. The calculation will first
reset the element to its minimum state, then use its scroll height, bounded by
the height corresponding to approximately fifteen visual lines. The resulting
style will use internal vertical scrolling only once the maximum is reached.

The minimum and maximum should be expressed through the textarea's computed
line height rather than a hard-coded pixel value where practical, so the
behavior remains aligned with the existing text sizing. A small fixed fallback
is acceptable if browser measurement is unavailable during initial rendering.

Alternatives considered:

- **Fixed larger textarea:** simpler but wastes space for short descriptions and
  still requires manual scrolling for medium descriptions.
- **Native manual resize only:** familiar but not sufficiently discoverable and
  does not automatically reveal content while typing.
- **Modal or separate editor:** provides more space but adds unnecessary state
  and breaks the requested inline workflow.

### Preserve plain-text layout with CSS whitespace handling

The description element in `JobItemsTable` will use whitespace behavior that
preserves newline characters and blank lines while allowing long words or URLs
to wrap inside the description column. The content will remain text-rendered;
no HTML or Markdown interpretation will be introduced.

### Keep behavior in shared components

No budget-specific or invoice-specific implementation will be added. Both
forms already pass the same concept data and callbacks to the shared
components, so modifying those components satisfies parity by construction.

### Validate through focused presentation tests where supported

Tests should cover the observable behavior that can be tested reliably in the
existing test setup: the description field's minimum/maximum scrolling states,
newline-preserving table output, and the shared component usage. Existing
application tests and the standard repository checks remain the broader
regression guard.

## Risks / Trade-offs

- [Textarea height measurement can vary with fonts and responsive widths] -> Use
  `scrollHeight` after resetting the height, cap with a measured line-height
  based maximum, and keep internal scrolling as the fallback.
- [A table with several long descriptions can become vertically large] -> This
  is intentional for complete visibility; retain compact typography and column
  wrapping so the table remains scannable.
- [A CSS whitespace change can affect unusually long unbroken content] -> Apply
  wrapping only to the description element and verify that the table does not
  overflow horizontally.
- [Auto-resizing can accidentally submit the embedded form on Enter] -> Keep the
  existing keyboard guard that excludes textarea targets and verify newline entry.

## Migration Plan

No data migration is required. Existing stored descriptions remain valid plain
text and will gain the new display behavior automatically. The implementation
can be rolled back by reverting the shared presentation changes; API, database,
and export contracts are unaffected.

## Open Questions

None. The design does not revisit any in-force ADR. ADR-0003 remains applicable
because JobItem's aggregate and persistence role are unchanged.
