## Context

Budget and invoice PDFs share the same rendering infrastructure and presentation components, while `BudgetDocument` and `InvoiceDocument` define their document-specific content order. PDF labels are selected by locale through `getPdfLabels(locale)` and sourced from the existing `es`, `ca`, and `en` message files.

The requested text is a required coverage statement, not a commercial concept. It must therefore remain outside `Budget`, `JobItem`, pricing calculations, API payloads, and persistence. The budget template is the correct boundary because the statement applies to every rendered budget and should not appear in invoices.

## Architecture Diagrams

The change is local to one presentation flow, so a lightweight component/data-flow sketch is sufficient:

```text
PDF request
    |
    v
DocumentPdfRenderer -- locale --> getPdfLabels(locale)
    |                                   |
    |                                   v
    |                         pdf message files
    v
BudgetDocument
    |
    +--> Header
    +--> Client block
    +--> Job items table
    +--> Totals block
    +--> Budget disclaimer   <-- budget-only localized statement
    +--> Payment block       <-- optional
```

Assumption: the existing locale passed to `renderBudgetPdf` is authoritative for the disclaimer, just as it is for all other PDF labels.

## Goals / Non-Goals

**Goals:**

- Show the required coverage statement in every generated budget PDF.
- Render it after totals and before optional payment information.
- Provide translations for all currently supported PDF locales: Spanish, Catalan, and English.
- Keep the statement visually distinct from priced job items and totals.
- Preserve invoice output and all existing budget calculations.
- Add focused rendering tests for presence, ordering, locale coverage, and invoice exclusion.

**Non-Goals:**

- Add an editable disclaimer field to the budget form.
- Store the disclaimer in the database or budget aggregate.
- Add a price, tax, or job item for the coverage statement.
- Add configuration to enable or disable the statement.
- Change invoice PDFs, API contracts, PDF endpoints, or external dependencies.

## Decisions

### Use a PDF translation label

Add one required label to the existing `pdf` translation namespace in `es.json`, `ca.json`, and `en.json`. The Spanish value is the supplied canonical text: `Seguro de responsabilidad civil ámbito de construcción`. Catalan and English receive semantically equivalent translations.

This reuses the established `PdfLabels` typing and locale fallback behavior instead of introducing a second translation mechanism or hardcoding the phrase in a React component.

### Render the statement directly in the budget template

Render a small styled text block from `BudgetDocument` after `TotalsBlock` and before the conditional `PaymentBlock`. A dedicated local style or small presentation component may be used if it keeps the template readable, but no domain object is needed.

Rendering at this boundary guarantees that:

- it appears for every budget regardless of bank-account configuration;
- it remains after totals even when payment details are omitted;
- it cannot alter job-item rows or amount calculations;
- it is not accidentally included in invoices, whose template is separate.

### Preserve normal document flow

Use the existing React PDF flow layout rather than absolute positioning. The disclaimer should wrap naturally if required by a locale or page width, while its position relative to totals and payment information remains stable.

### Test behavior at the rendered-template boundary

Extend the existing budget PDF rendering test setup with the new label and assertions that:

- the Spanish disclaimer is present in a budget;
- the disclaimer appears after total text and before payment text when a bank account exists;
- the disclaimer remains present without a bank account;
- an invoice render does not include the disclaimer;
- translation files expose the label for all supported locales, preferably through the existing translation typing or focused label checks.

## Risks / Trade-offs

- [Risk] The disclaimer could be mistaken for a priced concept if styled like a table row. -> [Mitigation] Render it as a standalone informational text block outside `JobItemsTable` and `TotalsBlock`.
- [Risk] A translation may be missing or inconsistent across locales. -> [Mitigation] Add the same `pdf` key to all three message files and cover each locale in tests or translation validation.
- [Risk] Future template changes could move the disclaimer relative to payment details. -> [Mitigation] Keep ordering assertions in the budget PDF rendering test.
- [Risk] Long localized text could wrap or create unwanted page pressure. -> [Mitigation] Use normal flow layout and a compact, readable style; verify generated markup/PDF rendering in focused tests.

## Migration Plan

No data migration is required. Deploy the presentation and translation changes together. Rollback consists of reverting the budget template, message-file, and test changes; existing budgets and invoices remain unchanged.

## Open Questions

None. The statement is confirmed as a required informational disclaimer, applies only to budget PDFs, and has a fixed placement and locale scope.
