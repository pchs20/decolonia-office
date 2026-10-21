## Context

Budget and invoice PDFs share the React-PDF presentation components `DocumentHeader`, `ClientBlock`, `TotalsBlock`, and `PaymentBlock`. The current document flow renders the client as a full-width section after the header and renders payment as another full-width section after totals. This creates avoidable vertical gaps and reduces the number of line items that fit on the first page.

The commercial-document model already contains all required worker and client fields. Client `phone` and `email` are nullable optional values, so the layout must conditionally omit them. The existing PDF header title, image, number, date, localized labels, totals calculations, and budget disclaimer behavior remain compatibility constraints.

The currently accepted ADRs were reviewed. ADR-0003 governs the commercial-document model and does not need revision because this change is limited to presentation composition.

## Architecture Diagrams

```text
BudgetDocument ─┐
                ├─> DocumentHeader
InvoiceDocument ┘      ├─ worker block
                       ├─ client block
                       └─ document title/image/metadata

BudgetDocument ─┐
                ├─> DocumentSummary
InvoiceDocument ┘      ├─ optional PaymentBlock (left)
                       └─ TotalsBlock (right)
```

Assumption: React-PDF flex rows provide stable horizontal composition at the fixed A4 content width. The client and payment sections can wrap within their columns if unusually long values are supplied; no data truncation is introduced.

## Goals / Non-Goals

**Goals:**

- Reclaim vertical space in both PDF types through shared horizontal composition.
- Place client details between worker and document identity details.
- Render optional client phone and email only when values are present.
- Place payment details left of the totals computation.
- Preserve existing values, labels, locale behavior, disclaimer behavior, and document generation entry points.
- Keep implementation local to the PDF presentation layer and cover layout behavior with tests.

**Non-Goals:**

- No API, database, persistence, or domain-model changes.
- No new PDF dependency.
- No changes to totals calculations or currency formatting.
- No changes to the document image assets or translated terminology.
- No new architectural decision record.

## Decisions

### Use the existing shared components in new flex rows

`DocumentHeader` will accept the client and the client label, then render `IssuerBlock`, `ClientBlock`, and the existing document metadata as three sibling columns. `BudgetDocument` and `InvoiceDocument` will pass their existing client data into the shared header and remove the separate client section.

This is preferred over duplicating header markup because budgets and invoices already share the component and must remain visually consistent.

### Keep client optional fields conditional at the component boundary

`ClientBlock` will render phone and email using the same conditional pattern already used by `IssuerBlock`. Null, undefined, and empty optional values will produce no text node or label. Required-looking client data such as name and address remains unchanged.

This is preferred over pre-formatting a list in each document because the block owns the presentation rules for party details.

### Introduce a shared lower summary container

Both document components will render a shared `DocumentSummary` containing an optional payment column and the totals column. `TotalsBlock` remains responsible for totals content and stays right aligned. `PaymentBlock` remains responsible for payment content but loses its standalone full-width top spacing/border so the parent summary controls the section separation.

This is preferred over placing payment props directly into `TotalsBlock` because payment and totals are separate concerns and the same composition is needed by both document types.

### Preserve budget disclaimer ordering

For budgets, the disclaimer remains after the lower summary and before any payment-specific content is removed from the old flow. It will not be included in invoices. This keeps existing user-visible semantics while allowing the payment/totals content to share a row.

## Risks / Trade-offs

- [Long worker or client values can make a narrow column wrap] → Use flexible worker/client columns with a fixed, sufficiently wide document column and preserve normal React-PDF wrapping rather than truncating data.
- [Payment content may be taller than totals] → Allow the summary row to size to its tallest child and keep the optional payment block out of the layout when no bank account exists.
- [Existing static-markup tests may not prove visual placement] → Assert component output order and key style/layout markers, then run focused PDF tests and the full package checks.
- [A future locale may introduce longer labels] → Keep the existing localized labels and use the shared layout; revisit column sizing only if a supported locale demonstrates overflow.

## Migration Plan

1. Add the shared compact header and lower summary composition in the PDF components.
2. Add conditional client phone/email rendering.
3. Update component tests for header placement, optional contacts, payment/totals order, and budget/invoice disclaimer behavior.
4. Run focused Jest tests, TypeScript checks, the package build, and OpenSpec verification.
5. Roll back by reverting the presentation component and test changes; no persisted data migration is required.

## Open Questions

- None blocking implementation. Exact column widths will be chosen from the existing A4 content width and validated by the PDF component tests/build rather than changing document data contracts.
