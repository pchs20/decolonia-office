## Context

Budget and invoice PDFs use the shared `DocumentHeader` component. The right-side document column has a fixed `110pt` content width, while the title uses an `18pt` bold font. In the Spanish budget PDF, `PRESUPUESTO` exceeds that width and React-PDF wraps and hyphenates it. The same header is also used for invoice PDFs and for Catalan and English translations.

The change is limited to presentation styling. Document data, localization values, PDF generation entry points, and the surrounding header structure remain unchanged.

## Architecture Diagrams

```text
BudgetDocument ─┐
                ├─> DocumentHeader ──> right-side title/image/metadata column
InvoiceDocument ┘

localized title ──> constrained title style ──> one-line PDF heading
```

Assumption: the existing header width and right-side composition are intentional and should remain stable; the title style is the narrowest and least disruptive adjustment point.

## Goals / Non-Goals

**Goals:**

- Make the longest supported localized title fit on one line without hyphenation.
- Apply the correction once in the shared header so budgets and invoices stay consistent.
- Preserve the existing header alignment, image, metadata, and document flow.
- Verify the rendered behavior with automated coverage where the PDF test setup permits.

**Non-Goals:**

- Do not change translated labels or document terminology.
- Do not change the document column width, image dimensions, page margins, or metadata layout unless title sizing alone cannot satisfy the requirement.
- Do not change API contracts, persistence, export naming, or PDF dependencies.

## Decisions

### Reduce the shared title font size

Adjust the `DocumentHeader` title style to a smaller size, targeting the minimum modest reduction that allows `PRESUPUESTO` to fit within the existing `110pt` title area. A likely value is `15pt` or `16pt`, to be confirmed by rendered output and tests.

This is preferred over changing translation text because the existing localized labels are correct. It is also preferred over widening the document column because widening could reduce the issuer area and affect long issuer names or the image alignment.

### Keep one shared style for both document types

Budget and invoice headers continue to use the same title style. Separate budget/invoice sizing would add unnecessary branching and could make the two PDF types visually inconsistent.

### Verify all supported locales

Validation covers Spanish, Catalan, and English title values. Spanish is the motivating case because `PRESUPUESTO` is currently split; the other locales protect against an adjustment that creates a new regression for another translation.

## Risks / Trade-offs

- [Smaller title appears less prominent] → Limit the reduction to the smallest size that prevents wrapping and preserve bold weight and right alignment.
- [A future translation is longer than current labels] → Keep the title area constrained and add a regression test around the currently supported locale set; revisit sizing if new locales are added.
- [PDF layout tests may not expose line wrapping directly] → Assert the generated PDF text or render a representative document and inspect the extracted title text for the absence of a split hyphenated form.

## Migration Plan

1. Update the shared PDF header title style.
2. Add or extend PDF renderer/component tests for budget and invoice title output across supported locales.
3. Run the web package type check and test suite.
4. If visual verification shows the title is still split, reduce the title size slightly further; if it is unnecessarily small, test a modestly wider title area without changing the overall header structure.

Rollback is a single presentation-style revert; no persisted data or migration is involved.

## Open Questions

- The exact final font size should be chosen from rendered output rather than assumed from nominal font metrics.
- No current ADR needs revisiting because this change does not alter the commercial-document model, persistence, integration boundaries, or a hard-to-reverse architectural choice.
