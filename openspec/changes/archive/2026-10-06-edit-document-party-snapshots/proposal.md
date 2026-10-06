## Why

Budgets and invoices correctly preserve client and worker information as document-owned snapshots, but the editing experience currently exposes the client fields as a large always-visible block and does not expose the worker snapshot for editing. This makes the normal workflow unnecessarily dense while making occasional document-specific corrections difficult. The document editor should keep historical snapshot semantics while making both parties easy to customize and explicitly refresh from their current records.

## What Changes

- Make client and worker snapshot information editable in both budget and invoice forms.
- Present client and worker snapshot fields in independent collapsed sections, expanded only when the user needs to inspect or modify them.
- Keep the linked client and worker fixed while editing; changing document associations is out of scope.
- During document creation, provide restore actions that replace the local snapshot with the selected client or primary worker's current information.
- During document editing, provide apply-latest actions that replace the local snapshot with the linked client or worker's current information.
- Apply refreshes immediately to the form, but persist them only when the user saves the document.
- Before applying a refresh, show a read-only summary of the snapshot fields that would change; do not provide field-by-field merge selection.
- Reuse the behavior consistently for budgets and invoices.

## Capabilities

### New Capabilities

- `document-party-snapshot-editing`: Edit, collapse, restore, and explicitly refresh client and worker snapshots within commercial-document forms.

### Modified Capabilities

- `budget-management`: Budget editing and creation now support compact, editable client and worker snapshot sections with explicit restore/apply-latest behavior.
- `invoice-management`: Invoice editing and creation now support compact, editable client and worker snapshot sections with explicit restore/apply-latest behavior.

## Impact

- Affected presentation components: shared commercial-document snapshot UI plus budget and invoice forms.
- Affected client-side API usage: fetch the current linked client or worker when a restore/apply-latest action is used; existing document update endpoints remain the persistence boundary.
- Affected localization resources: labels, action text, refresh summaries, and confirmation/error states for budgets and invoices.
- Affected tests: form behavior, snapshot mapping/refresh behavior, and any relevant API/use-case coverage.
- No database migration or change to snapshot persistence is expected.
