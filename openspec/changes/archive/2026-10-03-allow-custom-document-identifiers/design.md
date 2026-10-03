## Context

Budgets and invoices are separate concrete aggregates backed by separate PostgreSQL tables. Each currently stores a `number` string with a database `UNIQUE` constraint. Creation allocates the number through the commercial-document settings repository before persisting the document; editing currently cannot change it. Local ZIP and Google Drive exports use the number in PDF filenames, while the export state is keyed by document type and internal document UUID.

The design must preserve the default automatic flow while allowing a user-provided identifier, same-type duplicates after explicit confirmation, and safe exports. The internal UUID remains immutable identity; `number` is a user-facing reference.

## Architecture Diagrams

```text
User form
   │ create/update identifier + confirmation
   ▼
API route
   │ validate and pass identifier intent
   ▼
Commercial document use case
   ├─ automatic mode ──> sequence repository ──> next generated number
   ├─ custom mode ────> supplied validated identifier
   └─ duplicate check ─> same-type repository lookup
                         │
                         ▼
                  PostgreSQL budgets/invoices
                  UUID unique; number non-unique
                         │
                         ├─ XLSX: original number value
                         └─ PDF export: sanitized number + stable UUID suffix
```

Assumption: the application remains a single Next.js web application with PostgreSQL persistence; no separate numbering service is introduced.

## Goals / Non-Goals

**Goals:**

- Preserve automatic budget and invoice numbering when no custom identifier is supplied.
- Accept validated user-facing text identifiers up to the existing 255-character column limit.
- Detect same-type duplicates and require an explicit confirmation token/flag before persistence.
- Permit identifier edits without changing the document UUID.
- Remove database uniqueness on `budgets.number` and `invoices.number`.
- Make local and Google Drive PDF paths collision-safe and stable per document.
- Keep spreadsheet and rendered-document content unchanged except for the selected identifier.

**Non-Goals:**

- Changing the automatic sequence format or sequence settings UI.
- Making identifiers globally unique across budgets and invoices.
- Adding a separate identifier history or audit log.
- Automatically advancing sequences when a custom identifier is numeric.
- Changing the visible identifier format of existing invoices.

## Decisions

### Identifier representation and validation

Keep `number` as a string and treat it as a complete user-facing identifier. Trim surrounding whitespace, require a non-empty value, reject control characters, and enforce the existing 255-character maximum. Do not impose a numeric or invoice-year format on custom values. This supports external references while preserving compatibility with existing values.

Store an explicit `identifier_source` value of `automatic` or `custom` on each budget and invoice. Creation starts in automatic mode, switches to custom mode when the user edits the identifier, and can return to automatic mode through a reset action. Existing-document edits may change the identifier and source, but never allocate a new number or modify sequence settings. The system must not infer source from equality between the stored identifier and a sequence value.

Alternative considered: restrict custom values to positive integers or `number/year`. Rejected because it prevents common external references such as `CLIENT-A/2026/04` and the database already models the field as text.

### Automatic versus custom allocation

Extend create requests with identifier mode, an optional identifier, and duplicate confirmation. If the request is automatic, the use case allocates exactly as today. If the request is custom, it uses the validated value and does not call the allocator. Custom identifiers do not alter sequence state. Update requests may change the identifier/source but never call the allocator.

Alternative considered: always allocate first, then replace the value. Rejected because it consumes sequence values unnecessarily and complicates failure behavior.

### Duplicate confirmation

Add repository lookup support for a same-type identifier, excluding the current document during updates. The API returns a conflict/warning response when a duplicate exists and confirmation is absent. A repeated request with explicit confirmation persists the document. The database does not enforce uniqueness, so the confirmed write is authoritative.

The duplicate check is advisory and race-tolerant by design: duplicate identifiers are allowed, so concurrent confirmed writes remain valid.

### Database migration

Add a migration that drops the named or column-backed unique constraints on both document tables. Keep indexes on `number` for search and duplicate lookup. Rollback must not attempt to recreate uniqueness if duplicate rows may already exist; restoration requires data cleanup and an explicit operational decision.

### Export filenames

Build PDF filenames from the existing document-type prefix, sanitized identifier, and a stable short suffix derived from the UUID. For example:

```text
presupuesto-42-8c3f.pdf
factura-INV-2026-0042-a91d.pdf
```

Use the same naming helper for local ZIP and cloud synchronization. Continue using document type and UUID as export-state identity so changing a number renames/updates only that document's file.

Alternative considered: detect collisions only when assembling an export. Rejected because local and cloud exports could produce different paths and because stable filenames simplify synchronization and retries.

### UI interaction

Show the automatically suggested identifier in the create form. Provide a compact edit affordance that switches to custom mode and reveals an input, plus a "Reset to automatic" action that restores the original suggestion. On edit forms, provide the same control for changing the existing identifier, but do not offer an automatic reset that allocates a new identifier unless a later requirement defines that behavior. A duplicate warning must explain that the identifier is already used by the same document type and expose an explicit continue action.

## Risks / Trade-offs

- [Duplicate identifiers reduce visual discoverability] → Keep UUID-based routes and show number together with client/date in lists and warnings.
- [Existing consumers may assume numeric identifiers] → Keep automatic output unchanged and validate custom values at the API boundary; update generated API schemas and tests.
- [Sequence allocation can currently advance before insert failure] → Custom mode avoids allocation; separately preserve current automatic behavior unless implementation work safely moves allocation and insert into one transaction.
- [Export filenames become longer] → Use a short stable UUID suffix while retaining the complete identifier in document content and spreadsheet cells.
- [Dropping uniqueness is difficult to roll back] → Deploy the migration only with the duplicate-confirmation behavior and document rollback as forward-fix/data-cleanup rather than blind constraint recreation.
- [Changing a number can rename an existing Drive file] → Continue using the export state external reference keyed by UUID and test rename synchronization.

## Migration Plan

1. Add validation, identifier-aware create/update contracts, duplicate lookup/confirmation, and UI behavior while the existing uniqueness constraint remains in place.
2. Add export filename generation and collision-safe tests.
3. Deploy the migration dropping the budget and invoice number uniqueness constraints.
4. Verify automatic creation, custom creation, duplicate confirmation, edits, local ZIP export, and Google Drive synchronization.

Rollback of application code is safe only before duplicate data is created. After duplicates exist, rollback requires either retaining the new behavior or cleaning duplicate rows before recreating uniqueness.

## Open Questions

- Whether duplicate warnings should include links or document metadata for the conflicting records.
- Whether issued invoices or delivered budgets need an additional confirmation before changing their identifiers.
- Whether the short UUID suffix should be fixed-length or use the full UUID in exports.
