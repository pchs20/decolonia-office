## Why

Budget and invoice PDFs currently present the worker's information as text only. Adding the fixed document image beside that information will make exported documents more recognizable and professional, while keeping the image independent from worker profile data. The budget and invoice assets should be separate from the start so they can diverge later without another structural change.

## What Changes

- Add a fixed image to the issuer area of generated budget PDFs, positioned to the left of the worker name and information.
- Add a fixed image to the issuer area of generated invoice PDFs, positioned to the left of the worker name and information.
- Define separate static asset selections for budgets and invoices, initially using the same image content.
- Keep the assets in the application's static PDF asset directory under `apps/web/public/pdf/`.
- Resolve the selected static assets in a way that works with the server-side `@react-pdf/renderer` PDF generation path.
- Do not add worker image fields, database columns, upload functionality, settings UI, or API configuration in this change.

## Capabilities

### New Capabilities

<!-- No new standalone capability is required. The image behavior belongs to the existing PDF export capability. -->

### Modified Capabilities

- `budget-and-invoices-export`: Require budget and invoice PDFs to include their corresponding fixed document image in the issuer block alongside the materialized worker information.

## Impact

- PDF presentation components for budgets, invoices, and the shared issuer block.
- Server-side PDF asset resolution used by the document PDF renderer.
- Static assets under `apps/web/public/pdf/`.
- Existing budget and invoice PDF export tests and fixtures, where applicable.
- No database schema, domain entity, worker API, or commercial-document settings changes are expected.
