## Context

Budget and invoice PDFs share `DocumentHeader`, which renders an `IssuerBlock` and a `ClientBlock`. Both blocks currently render an available phone number as a bare text line. PDF localization is already resolved by `document-pdf-renderer.ts` through `getPdfLabels(locale)`, and the resulting `PdfLabels` object is passed to the document templates for other labels.

The change is presentation-only. Phone values are materialized in the document snapshots and must remain unchanged in persistence, API responses, and non-PDF views. The existing conditional rendering for missing phone numbers must also remain unchanged.

## Architecture Diagrams

Not needed for this change. The existing PDF rendering flow and shared header component are sufficient to describe the affected boundary.

## Goals / Non-Goals

**Goals:**

- Provide a localized PDF phone label for all supported locales.
- Render the label before both issuer and client phone numbers in budget and invoice PDFs.
- Reuse the existing PDF localization flow and shared document-header components.
- Verify the output through focused header rendering tests.

**Non-Goals:**

- Do not change phone-number validation, normalization, storage, snapshots, API contracts, or other application views.
- Do not add a user-configurable label or a database setting.
- Do not introduce a new dependency or alter the PDF layout beyond the additional text.

## Decisions

### Use the existing PDF translation catalog

Add a `phone` entry to the `pdf` object in each of the Spanish, Catalan, and English message catalogs. The initial value is `Tel.` in every locale, while keeping the value in the translation catalog allows future locales to choose their own abbreviation without changing PDF components.

**Alternative considered:** hardcode `Tel.` in `IssuerBlock` and `ClientBlock`. This was rejected because it bypasses the existing locale-specific PDF label flow and makes future translation changes require code edits.

### Pass the resolved label through the shared header

Extend `DocumentHeader` to receive the resolved PDF phone label and pass it to both `IssuerBlock` and `ClientBlock`. Each block will render the label and phone value together only when its phone value is present.

**Alternative considered:** format phone numbers in the budget and invoice document templates. This was rejected because both document types use the same header and duplicating the formatting would make the two templates easier to drift.

### Keep the phone value as a separate data value

The label is composed at render time as presentation text. No mapper, schema, domain value object, repository, or API route will be changed.

**Alternative considered:** modify mapped phone values to include `Tel.`. This was rejected because it would contaminate API responses and non-PDF consumers with a display concern.

## Risks / Trade-offs

- [Risk] Adding text may slightly increase the width of a phone line. → Mitigation: use the existing phone line style and test representative rendered markup; phone numbers are already rendered in a flexible text block.
- [Risk] One document type or one party block could miss the new label. → Mitigation: test the shared header with both issuer and client phone values and exercise budget/invoice label propagation through the document components.
- [Risk] Translation catalogs could become structurally inconsistent. → Mitigation: add the same `pdf.phone` key to all three supported locale files and rely on the existing typed `PdfLabels` import.

## Migration Plan

No data migration or deployment migration is required. Deploy the translation and component changes together. Rollback consists of reverting the presentation and test changes; stored phone values are unaffected.

## Open Questions

None. The supported locales and the scope of both issuer and client phone numbers were confirmed during exploration.
