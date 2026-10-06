## Context

Budget and invoice forms share `JobItemForm` and `JobItemsTable`, while both PDF document types share the PDF `JobItemsTable`. Descriptions already use plain-text textareas and preserve line breaks in the web table. Titles currently use a single-line input, render without whitespace preservation, and are stored as `VARCHAR(255)`.

## Architecture Diagrams

```text
BudgetForm ─────┐
                ├── JobItemForm ── title/description textareas
InvoiceForm ────┘          │
                           ▼
                    API + JobItem value object
                           │
                           ▼
                    job_items.title TEXT

BudgetDocument ───┐
                  ├── PDF JobItemsTable ── preserved title line breaks
InvoiceDocument ──┘
```

The shared components remain the single presentation boundary for budget and invoice parity.

## Goals / Non-Goals

**Goals:**

- Let users insert intentional line breaks in job-item titles using the same plain-text interaction as descriptions.
- Preserve title line breaks through API, persistence, web display, and PDF export.
- Remove the database-specific 255-character title limit.
- Keep titles required and preserve existing form, pricing, and aggregate behavior.

**Non-Goals:**

- Rich text, Markdown, HTML, or per-line formatting.
- Changes to document header titles, document numbers, or search behavior.
- New title truncation, expansion controls, or title-specific maximum length.

## Decisions

### Store job-item titles as PostgreSQL TEXT

Change `job_items.title` from `VARCHAR(255)` to `TEXT`. PostgreSQL `TEXT` is appropriate for unrestricted plain text and matches the existing description column. No application contract changes are needed because TypeScript already models the field as `string`.

Alternative considered: retain `VARCHAR(255)`. Rejected because the requested behavior explicitly removes the title length restriction and asks for parity with descriptions.

### Use the shared auto-growing textarea behavior for titles

Extend the existing `JobItemForm` textarea measurement to the title field. Both textareas use a three-line minimum, approximately fifteen-line maximum, and internal scrolling beyond the maximum. The embedded keyboard guard must exclude both textareas from submit-on-Enter behavior.

### Preserve plain-text line breaks in web and PDF output

Apply whitespace-preserving wrapping to the web title element. In the PDF table, render the title as text with its existing line breaks and allow the row to grow naturally. No HTML conversion or rich-text interpretation is introduced.

## Risks / Trade-offs

- [Multiline titles increase table and PDF row height] → Allow natural row growth and rely on existing PDF pagination.
- [Very long title text may make a concept row visually large] → Keep the same approximately fifteen-line editing cap but do not truncate saved output.
- [PDF renderer handling of explicit newline characters may differ from browser rendering] → Add focused PDF rendering coverage and inspect generated text/layout behavior.
- [Existing rows may contain titles at the old limit] → The migration is widening-only and does not alter existing values.

## Migration Plan

Add a forward-only migration that alters `job_items.title` to `TEXT`. Existing values remain unchanged. Reverting application behavior would not require data changes.

## Open Questions

None. The title length decision is resolved as unrestricted `TEXT`, and no durable architectural decision is changed; ADR-0003 remains applicable.
