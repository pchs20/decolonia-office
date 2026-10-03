## Why

Budget and invoice PDFs currently render the Spanish budget title as `PRE-` and `SUPUESTO` because the shared document header is too narrow for the title at its current font size. This creates an avoidable visual defect in a customer-facing document and should be corrected before more PDFs are generated or shared.

## What Changes

- Adjust the shared PDF document-header title presentation so supported budget and invoice titles fit on one line when rendered.
- Preserve the existing right-aligned header layout, image, metadata, and localized document labels.
- Add regression coverage for title rendering across budget and invoice PDFs and supported locales where practical.

## Capabilities

### New Capabilities

- `pdf-document-header-layout`: Keep localized budget and invoice PDF titles readable and unsplit in the document header.

### Modified Capabilities

<!-- No existing spec-level requirements are being changed. -->

## Impact

- Affected presentation code: `apps/web/src/presentation/components/pdf/DocumentHeader.tsx`.
- Affected PDF consumers: budget and invoice PDF rendering through the shared document renderer.
- No API, persistence, data-model, or external dependency changes are expected.
