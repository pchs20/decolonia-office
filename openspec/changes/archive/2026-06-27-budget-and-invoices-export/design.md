## Context

Budgets and invoices are fully structured in the domain with job items, snapshots, and totals. The missing piece is exporting them to PDF for client delivery. The app runs on Next.js with serverless API routes deployed to Vercel.

Worker profiles currently store `name`, `taxId`, `phone`, `email`, and addresses. The invoice template requires a bank account number for payment information — this field is absent from the domain model.

## Architecture Diagrams

```
HTTP Request
     │
     ▼
┌─────────────────────────────────────────────────────┐
│  Next.js API Route                                  │
│  GET /api/budgets/[id]/pdf                          │
│  GET /api/invoices/[id]/pdf                         │
│                                                     │
│  1. Fetch CommercialDocument + JobItems             │
│     (via existing use cases)                        │
│                                                     │
│  2. Call PdfGenerationService                       │
│     renderBudgetPdf(doc, items) → Buffer            │
│     renderInvoicePdf(doc, items) → Buffer           │
│                                                     │
│  3. Return binary response                          │
│     Content-Type: application/pdf                   │
│     Content-Disposition: attachment; filename=...   │
└─────────────────────────────────────────────────────┘
             │
             ▼
    ┌────────────────┐
    │ @react-pdf/    │
    │ renderer       │
    │                │
    │ BudgetDocument │◄──── IssuerBlock
    │ InvoiceDocument│◄──── ClientBlock
    │                │◄──── JobItemsTable
    │                │◄──── TotalsBlock
    │                │◄──── PaymentBlock (invoice only)
    └────────────────┘
```

**Template data flow** — all data comes from the existing `CommercialDocument` + `JobItem[]` already returned by the existing GET endpoints. No new query paths required for the core PDF rendering. The only new data is `bankAccount` flowing through the worker profile → snapshot → invoice template.

## Goals / Non-Goals

**Goals:**
- Export budget as a PDF with issuer block, client block, job items table, and totals.
- Export invoice as a PDF with the same blocks plus a payment block (bank account).
- `bankAccount` added to worker profile, materialized into `WorkerSnapshot`, used in invoice PDFs.
- PDF generation is server-side, returns a binary response, triggers browser download.
- Export button on budget and invoice detail pages (view mode only).

**Non-Goals:**
- Email delivery of PDFs.
- Custom branding or logo upload.
- PDF templates other than the default layout defined here.
- Notes field in the PDF (internal use only).
- Caching or storing generated PDFs.
- Print stylesheet / browser-print approach.

## Decisions

### 1. Server-side PDF generation via `@react-pdf/renderer`

**Decision:** Use `@react-pdf/renderer` in a Next.js API route to generate PDF binaries on the server.

**Rationale:** The library runs in Node.js, produces real PDF output (not browser print artifacts), and is the established standard for Next.js + Vercel deployments. Template authoring uses JSX — consistent with the existing React codebase. The alternative (client-side `PDFDownloadLink`) avoids a server roundtrip but ties the WASM bundle to the client bundle, bloating the initial page load. Server-side also leaves the door open for future email attachment scenarios.

**Alternatives considered:**
- `PDFDownloadLink` (client-side): simpler, no API route, but larger client bundle and no future email support.
- Puppeteer: too heavy for Vercel serverless (binary size, cold start).
- `window.print()`: no real PDF, depends on browser print dialog, unacceptable UX.

### 2. Two separate document components, shared sub-components

**Decision:** `BudgetDocument` and `InvoiceDocument` are distinct top-level `@react-pdf/renderer` `<Document>` components. They share leaf components: `IssuerBlock`, `ClientBlock`, `JobItemsTable`, `TotalsBlock`. `PaymentBlock` (bank account) is invoice-only.

**Rationale:** Budget and invoice layouts differ meaningfully — budget has a single-column layout with the client block below the header, invoice has a two-column header (issuer left, client right). Sharing a single template with conditional logic would be harder to iterate on than two clean templates with shared leaf components.

### 3. `bankAccount` is optional on `WorkerSnapshot`

**Decision:** `WorkerSnapshot.bankAccount` is `string | null`. The invoice template renders the `PaymentBlock` only when `bankAccount` is non-null. Existing documents (created before the migration) will have `null` and will silently omit the payment block.

**Rationale:** Avoids backfilling historical snapshots. The worker can add their bank account in settings and future documents will include it. This is safe and additive.

### 4. Snapshot columns use flat naming convention

**Decision:** The new DB column is `worker_snapshot_bank_account` on both `budgets` and `invoices` tables (nullable varchar), consistent with the existing flat snapshot column naming in those tables (e.g., `worker_snapshot_name`, `worker_snapshot_tax_id`).

**Rationale:** Consistent with the established pattern in the existing schema (see `budget-repository.ts` line 39). No structural change to snapshot storage strategy.

### 5. `bankAccount` is also stored on the `profiles` table

**Decision:** Add `bank_account` (nullable varchar) to the `profiles` table. Exposed via the existing worker/settings API.

**Rationale:** The profile is the source of truth for worker data. `bankAccount` materializes into the snapshot at document creation time (same as `name`, `taxId`, etc.).

## Risks / Trade-offs

- **`@react-pdf/renderer` serverless cold start** → The library is ~1MB. First request after a cold start may take 1–2 seconds. Mitigation: acceptable for a low-traffic single-user app; no action needed now.
- **Font rendering** → Default fonts may not render special characters (e.g., accented Spanish characters) correctly. Mitigation: test early with real data; fall back to embedding a Unicode font if needed (e.g., Roboto from Google Fonts, which `@react-pdf/renderer` supports natively).
- **`bankAccount` not retroactively materialized** → Existing documents have `null` bank account in snapshot. Mitigation: by design (Non-Goal above); the invoice PDF simply omits the payment block when null.
- **Job items table may overflow a single page** → Long item lists could exceed one PDF page. Mitigation: `@react-pdf/renderer` handles page breaks automatically; no special handling needed for the initial version.

## Migration Plan

1. Add `bank_account` column to `profiles` table (nullable varchar, no default) — additive, safe, zero downtime.
2. Add `worker_snapshot_bank_account` column to `budgets` and `invoices` tables (nullable varchar) — additive, safe, zero downtime.
3. Deploy application changes (domain, infrastructure, API, UI, PDF routes) as a single release.
4. No rollback complexity — all new columns are nullable; existing rows remain valid with `null`.

## Open Questions

None. All major decisions resolved during exploration.
