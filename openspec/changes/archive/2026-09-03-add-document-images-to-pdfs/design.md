## Context

Budget and invoice PDFs are generated on the server with `@react-pdf/renderer`. Both document templates render the worker's materialized information through the shared `IssuerBlock`, which currently contains text only. The new image is fixed application content, not worker data, and does not need persistence or user configuration.

The change must support two independently selected document assets: one for budgets and one for invoices. They will initially contain the same image, but the selection boundary must remain separate so the assets can diverge later without changing the document data model.

## Architecture Diagrams

```text
BudgetDocument ────────┐
                       ├── IssuerBlock
InvoiceDocument ──────┘       ├── selected static image
                               └── worker name and information

Budget PDF renderer  ──> budget asset
Invoice PDF renderer ──> invoice asset
```

The asset is resolved in the server-side rendering path rather than relying on a browser-only URL:

```text
public/pdf/<asset>
        │
        ▼
server-side PDF renderer
        │  resolve to a react-pdf-readable source
        ▼
BudgetDocument / InvoiceDocument
        │
        ▼
        Image beside IssuerBlock text
```

## Goals / Non-Goals

**Goals:**

- Include an image to the left of the worker name and information in budget PDFs.
- Include an image to the left of the worker name and information in invoice PDFs.
- Keep budget and invoice image selection independent.
- Use fixed static files under `apps/web/public/pdf/`.
- Make the image source reliable for server-side `renderToBuffer` execution.
- Preserve the existing worker snapshot behavior and document export API.

**Non-Goals:**

- No worker profile image field or worker image upload.
- No database migration or document snapshot column for the image.
- No settings UI, API endpoint, or runtime configuration for changing images.
- No change to budget/invoice content other than the issuer image and its layout.
- No requirement to preserve historical image versions, since the image is fixed application content.

## Decisions

### Separate logical assets

The budget and invoice templates will each reference their own static asset, even while both files contain identical content. This makes the future difference explicit and avoids coupling the two document types through a single shared asset constant.

The assets belong under `apps/web/public/pdf/`. Their exact committed filenames should be stable, descriptive names rather than the original camera-generated filename, for example `budget-image.jpg` and `invoice-image.jpg`.

### Shared issuer layout

The existing `IssuerBlock` remains the single place responsible for the issuer presentation. The parent document selects the asset and passes it to that block. The block uses a horizontal layout with a constrained image box followed by the existing worker text, preserving the existing fields and formatting.

This avoids duplicating layout code in `BudgetDocument` and `InvoiceDocument`, while allowing each parent template to choose a different image.

### Server-readable image source

The renderer will provide `@react-pdf/renderer` with a source that works in the server runtime, such as a resolved filesystem path or a data URI generated from the static file. A relative browser URL is not sufficient as the primary contract because PDF generation uses `renderToBuffer` in a server-side execution path.

The implementation should use the smallest reliable mechanism supported by the existing Next.js server bundle. If direct filesystem resolution is incompatible with the deployed serverless bundle, the image should instead be imported or converted to an embedded data URI at the renderer boundary. The document components should receive an already-resolved image source and remain independent of filesystem concerns.

### Image sizing

The image will have an explicit bounded width and height so it cannot change the issuer header's dimensions unpredictably. Its aspect ratio should be preserved, preferring containment over cropping because the supplied landscape image contains meaningful content across its full width. The layout must remain usable when worker information contains optional or long fields.

## Risks / Trade-offs

- [Serverless asset resolution can differ between local Next.js and deployment bundles] → Keep filesystem/import logic at the renderer boundary and verify a production build plus an actual PDF render.
- [The landscape image may consume too much vertical space beside the issuer text] → Use a fixed compact image box with preserved aspect ratio and test documents with both minimal and complete worker information.
- [Separate files can accidentally drift while their content is intended to be identical initially] → Treat separate filenames as intentional document-type assets; visual equality is an initial content choice, not a shared runtime dependency.
- [A missing or unreadable asset could break PDF generation] → Ensure both required assets are committed and add a focused render test or validation that exercises both document types.

## Migration Plan

1. Add the two fixed image assets under `apps/web/public/pdf/`.
2. Update the PDF rendering components and server renderer to resolve and display the document-specific image.
3. Run focused PDF tests, then the standard type-check, test, and build checks.
4. Rollback consists of reverting the component/renderer changes and removing the two static assets; no database rollback is required.

## Open Questions

- Confirm the final descriptive filenames for the two assets before implementation.
- Confirm the desired compact image dimensions after viewing a generated PDF. The design assumes a bounded, contained image rather than a cropped logo treatment.
