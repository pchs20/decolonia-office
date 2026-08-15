## Context

The application is a Next.js serverless web app backed by PostgreSQL. Clients, budgets, invoices, and their child data are persisted in the database. Budget and invoice PDFs are rendered on demand by the existing server-side PDF export pipeline; PDF files are not persisted by the application.

The change needs two destinations for one complete, one-way backup representation:

- A persistent cloud destination, initially Google Drive, updated only after a user presses a sync button.
- A stateless ZIP download generated for the user's machine.

The design must preserve the existing layer boundaries: HTTP routes compose application use cases, application code depends on outbound ports, and infrastructure implements database and external-provider adapters. It must also keep export metadata out of the client, budget, and invoice domain tables.

## Architecture Diagrams

The following lightweight container and flow diagram assumes the existing Next.js app remains the only deployable application container and that sync work is initiated by an authenticated user.

```text
                         authenticated worker
                                  |
                 +----------------+----------------+
                 |                                 |
        Sync to cloud button              Download backup button
                 |                                 |
                 v                                 v
        +-------------------+             +-------------------+
        | Next.js API route |             | Next.js API route |
        +---------+---------+             +---------+---------+
                  |                                 |
                  v                                 v
        +-------------------+             +-------------------+
        | Cloud sync use    |             | Backup export use |
        | case + batch      |             | case             |
        +---------+---------+             +---------+---------+
                  |                                 |
                  +----------------+----------------+
                                   v
                    +-------------------------------+
                    | Backup bundle assembler      |
                    | - Clients tab data           |
                    | - Budgets tab data           |
                    | - Invoices tab data           |
                    | - Budget/invoice PDF bytes   |
                    +---------------+---------------+
                                    |
                 +------------------+------------------+
                 |                                     |
                 v                                     v
       +-----------------------+             +-----------------------+
       | Provider adapter      |             | ZIP archive/stream    |
      | Shared Drive+Sheets   |             | response              |
       +-----------+-----------+             +-----------------------+
                   |
                   v
       +-----------------------+
      | Google Drive folder  |
      | + Decolonia-data.xlsx|
      | + Budgets/year/Qn    |
      | + Invoices/year/Qn   |
       +-----------------------+

        PostgreSQL <--- repositories/use-case ports ---> bundle assembler
             |
             +--> document export state (provider, document, external ref,
                  successful sync timestamp, and failure/progress metadata)
```

Assumptions: the ZIP response is generated within a bounded request or a bounded download flow; cloud synchronization is split into bounded requests because PDF rendering and remote uploads are not suitable for one unbounded serverless invocation. The exact batch size and whether spreadsheet creation occurs once per run or through a dedicated preparation step remain implementation details.

## Goals / Non-Goals

**Goals:**

- Provide one consistent backup bundle representation for cloud synchronization and local download.
- Export clients, budgets, and invoices as structured tabular data in three spreadsheet tabs.
- Export current budget and invoice PDFs using the existing rendering pipeline.
- Make cloud synchronization resumable and idempotent across batches and interrupted runs.
- Keep persistent export state provider-neutral and outside core domain tables.
- Isolate Google Drive and Sheets credentials and API details behind infrastructure adapters.
- Show useful progress and partial failure information to the user.
- Keep all export flows one-way from the application to a destination.

**Non-Goals:**

- Automatic synchronization after creates or updates.
- Cron or scheduled synchronization.
- A service-account or Google Workspace Shared Drive destination.
- Importing, restoring, or reconciling data from a cloud or ZIP backup.
- Treating a browser download as a persistent provider requiring synchronization state.
- Supporting OneDrive, S3, or other cloud providers in the first implementation; the ports should allow later adapters without designing their APIs now.
- Persisting PDFs as first-class application documents.

## Decisions

### One shared bundle model with destination adapters

Create an application-level bundle assembly use case that reads the current database state, builds the three tabular datasets, and renders the required budget and invoice PDFs. Cloud synchronization and ZIP download consume this same representation through separate destination adapters.

This avoids divergent backup contents between Drive and ZIP exports. The bundle assembler owns what is exported; destination adapters own how it is delivered. A separate generic "backup provider" abstraction is not needed for the stateless ZIP path because it has no remote identity or synchronization lifecycle.

### Provider-neutral persistent export state

Use a separate export-state table keyed by the exported document identity, provider, and shared destination. The logical key is `(documentType, documentId, provider, destinationReference)`, with fields for a provider-opaque external reference, the source version or update timestamp used for the last successful export, and success/failure timestamps or error information needed for resumable processing.

The destination reference identifies the shared folder/container, while the external reference stores Drive's file ID. Neither field is a Budget, Invoice, or Client domain attribute, and the schema must not assume every future provider uses the same identifier format.

Use a side table rather than columns on domain tables because one document can be exported to multiple destinations and export state has no business meaning. The uniqueness constraint prevents duplicate state rows for the same document/provider/destination pair while allowing separate provider records later.

### Shared personal Google Drive is the first persistent adapter

Implement Google Drive and Google Sheets behind outbound ports. One canonical worker creates a `Decolonia` folder in their personal Drive and shares that folder with the other authorized worker. Each worker grants Drive access through their own Google OAuth flow, and the adapter uses the logged-in worker's refreshed credentials to access the same shared folder. The application does not use a service account or Google Workspace Shared Drive for this provider.

Request the narrowest practical Drive scope (`drive.file`) so the integration can manage files created by the application. The server retains the refresh credential, refreshes short-lived access tokens as needed, and never includes provider tokens in the browser session or API responses. The Drive adapter creates or updates stable files using Drive file IDs. Human-readable application document numbers are used for filenames and spreadsheet values, not as Drive identifiers.

### Spreadsheet is refreshed as a current-state snapshot

Each completed cloud sync represents the current database state in `Clients`, `Budgets`, and `Invoices` tabs. The tabular snapshot is rebuilt from current rows rather than treated as an append-only event log. Stable application IDs and document numbers are included as columns so a future restoration tool can correlate rows back to source records.

The spreadsheet is the compact recovery index. PDF files preserve the rendered client-facing representations, while the tabs preserve structured values needed for future reconstruction. Restore/import behavior is intentionally deferred.

### Manual sync is a bounded resumable workflow

The UI presents one manual action, but the browser may issue multiple authenticated requests. Each request processes a bounded batch and returns progress plus a continuation signal. A batch records export state only after its individual remote operation succeeds. An interrupted run therefore leaves completed records marked and unfinished records eligible for the next click.

The sync endpoint must not make normal document saves wait for Google APIs, and document saves must not trigger sync work. The user can retry a failed run; successful files should be updated in place rather than duplicated.

### Local backup is a stateless ZIP export

The local action generates the same bundle structure, packages its spreadsheet data and PDFs into a ZIP with stable folders and filenames, and streams it as a download. It does not write export-state rows because the browser copy has no remote identity that the server can update later.

The persistent destination uses one stable application folder with the following structure:

```text
Decolonia/
  Decolonia-data.xlsx
  Budgets/
    <year>/<quarter>/<document-number>.pdf
  Invoices/
    <year>/<quarter>/<document-number>.pdf
```

Quarter folders use the conventional English names `Q1`, `Q2`, `Q3`, and `Q4`, where each quarter contains three calendar months. The ZIP structure mirrors the same destination layout, for example:

```text
backup-<timestamp>.zip
  Decolonia-data.xlsx
  Budgets/<year>/<quarter>/<document-number>.pdf
  Invoices/<year>/<quarter>/<document-number>.pdf
```

The exact spreadsheet file format and archive library are implementation decisions subject to the current runtime and response-size limits.

## Risks / Trade-offs

- [Risk] A large cloud sync can exceed serverless execution limits. -> Mitigation: bounded batches, continuation responses, persisted per-document state, and visible progress.
- [Risk] A remote operation can succeed while recording its state fails, causing a later duplicate or update lookup. -> Mitigation: use stable provider references when available, make provider operations idempotent, and reconcile by controlled folder/name lookup when state is missing.
- [Risk] A spreadsheet full refresh and PDF batch uploads can complete at different times. -> Mitigation: report the spreadsheet and PDF portions separately and treat a run as complete only when all required portions succeed.
- [Risk] Google OAuth refresh credentials can expire, be revoked, or be unavailable in a testing consent configuration. -> Mitigation: handle refresh failures explicitly, request authorization again, keep tokens server-side, and document the consent/publishing requirements for every worker.
- [Risk] ZIP generation may exceed memory or response limits for a large dataset. -> Mitigation: stream or batch archive generation where supported, enforce bounded response behavior, and surface size limitations before export when possible.
- [Risk] A provider-neutral table may be too generic for provider-specific state. -> Mitigation: keep the common fields minimal and allow provider metadata/error details in a structured field only where necessary; do not leak provider concepts into domain models.
- [Risk] A backup can contain sensitive client and financial information. -> Mitigation: require existing application authentication, restrict cloud-folder access, avoid logging exported contents, and document credential/retention responsibilities.

### Backup action presentation

The Backup & Export panel checks Drive authorization status on load and renders one primary cloud action: `Authorize Google Drive` when authorization is unavailable, or `Sync to Google Drive` when it is available. The local ZIP action remains independently available. Both actions use the filled Settings purple treatment; their labels and icons provide the distinction.

## Migration Plan

1. Add or migrate the export-state table through the repository's explicit migration process, including shared destination reference.
2. Add the bundle assembler, outbound ports, and provider adapters without changing existing document creation or PDF endpoints.
3. Extend Auth.js Google configuration with Drive authorization and server-side refresh handling.
4. Add authenticated API routes and UI actions for cloud sync and ZIP download.
5. Validate a small dataset locally, including interrupted batches and retry behavior, before enabling the cloud destination in hosted environments.
6. Roll back application code by disabling the new routes/UI; retain the additive export-state table unless a migration rollback is explicitly required. No existing domain data needs transformation.

## Open Questions

- What exact columns should each spreadsheet tab expose, especially for nested addresses, job items, snapshots, taxes, and internal notes?
- Should the spreadsheet be one `.xlsx` file managed through Sheets, or should the cloud representation use native Sheets only while ZIP contains a generated workbook/CSV set?
- What filename convention should be adopted for budget and invoice PDFs?
- Should failed export attempts retain a last error and retry count in the state table, or should that operational history be a separate sync-run table?
- Will the Google OAuth consent screen remain in Testing mode, with its refresh-token lifetime limitations, or be published/verified for longer-lived operation?
- Is a future restore/import workflow expected to use the spreadsheet as its source of truth, or should a later backup format add machine-oriented metadata in addition to the human-readable tabs?
