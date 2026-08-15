## Why

The application currently keeps important client, budget, and invoice data in the database, while generated PDFs exist only temporarily when exported. A database failure would therefore leave no convenient, complete recovery copy. This change adds a manually triggered backup and export flow that preserves the current data as both a reusable cloud copy and a downloadable local archive.

## What Changes

- Add a cloud synchronization capability that exports clients, budgets, and invoices to a provider-backed backup destination, initially Google Drive.
- Store the tabular export in one spreadsheet with separate `Clients`, `Budgets`, and `Invoices` tabs, refreshed from the current database state on each manual sync.
- Place the cloud spreadsheet at the root of the shared `Decolonia` folder, alongside the `Budgets` and `Invoices` folders.
- Generate and export budget and invoice PDFs using the existing PDF rendering behavior, organized consistently with the tabular export.
- Add provider-agnostic export state outside the core domain tables so persistent providers can track their own external file references and successful synchronization timestamps per exported document.
- Add a manual sync action with resumable/batched processing and visible progress so a large export is not limited to one unbounded serverless request.
- Use the logged-in worker's Google OAuth grant for the initial Drive destination; request Drive access only when needed and do not add automatic push-on-write behavior.
- Add a stateless local backup export that generates the same complete backup structure and downloads it as a ZIP archive to the user's machine.
- Keep the export one-way from the application to the selected destination. Importing or restoring data from a backup is outside this change.

## Capabilities

### New Capabilities

- `document-cloud-sync`: Manually synchronize clients, budgets, invoices, spreadsheet tabs, and generated PDFs to a persistent cloud provider, initially Google Drive, with provider-specific export state and resumable progress.
- `document-backup-export`: Generate a complete, current backup bundle containing the tabular export and document PDFs, then download it as a ZIP archive without persistent synchronization state.

### Modified Capabilities

- `google-auth`: Extend the existing Google OAuth contract to request Drive access and retain refresh credentials for server-side synchronization without exposing them to the browser session.

## Impact

- New authenticated UI actions for cloud synchronization and local ZIP download, including progress and partial-failure reporting.
- New API/application services for assembling the shared backup bundle and delivering it through cloud and local destinations.
- New persistence for provider-agnostic export state and synchronization metadata, kept separate from budget, invoice, and client domain tables.
- Changes to Google authentication/session handling so Drive access and refresh credentials are available only to the server-side sync flow and are not exposed in the client session.
- New Google Drive/Sheets integration using one canonical personal Drive folder shared with the other authorized worker, with OAuth token refresh and shared-destination state.
- New ZIP archive generation and streaming response support for local downloads.
- Existing PDF generation and client/budget/invoice query paths will be reused by the export flow; no existing domain document behavior should change.
