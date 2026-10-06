## Context

Budgets and invoices already persist client and worker snapshots as document-owned values and already accept both snapshots in create and update requests. The current budget and invoice forms duplicate the snapshot state and mapping logic, render the client fields as an always-expanded block, and do not render the worker fields even though worker snapshot state is submitted. Client and worker records expose `updatedAt` and can be retrieved by id through existing services.

The change therefore stays inside the existing web application boundary. It adds a shared presentation pattern and source-record refresh flow without changing the document aggregate, snapshot storage, or automatic propagation semantics.

## Architecture Diagrams

The refresh is a local form operation. It reads a source record, compares mapped values with the current document snapshot, and only sends the resulting snapshot through the existing document update request when the user saves.

```text
User
 │ expands section / clicks restore or apply-latest
 ▼
Document Party Snapshot Section
 │                    │
 │ current form state │ fetch source by linked id
 │                    ▼
 │              ClientService / WorkerService
 │                    │
 │                    ▼
 │              current source record
 │                    │ map + compare
 └───────────────┬────┘
                 ▼
        read-only changed-field summary
                 │ confirm
                 ▼
        replace local complete snapshot
                 │ save document
                 ▼
     existing budget/invoice PATCH endpoint
```

Assumptions:

- The linked client and worker identifiers remain immutable in edit mode for this change.
- A refresh action replaces the complete snapshot, including optional fields and worker bank account.
- The current source records are fetched when the form opens so action visibility reflects whether a refresh is needed; the source is fetched again when the user activates a visible refresh action.

### Screen Representation

The form keeps the party sections compact during the normal workflow. Client and worker sections are independent and collapsed by default.

```text
┌──────────────────────────────────────────────────────────────┐
│ Edit budget                                                  │
│                                                              │
│ Number        [ 42                                      ]   │
│ Notes         [                                         ]   │
│                                                              │
│ Client: Maria García                  [⌄ Expand]             │
│                                                              │
│ Worker: Decolonia / Pedro Durán       [⌄ Expand]             │
│                                                              │
│ Job items                              [Add item]             │
│ ...                                                          │
│                                                              │
│                         [Cancel] [Save budget]               │
└──────────────────────────────────────────────────────────────┘
```

When a section is expanded, it shows the complete document-owned snapshot and the context-appropriate restore action only when the local snapshot differs from its source. The linked party itself is not changed from this form.

```text
Client: Maria García                    [⌃ Collapse]
  [Apply latest client data]
  Name             [Maria García                         ]
  Tax ID           [                                ]
  Phone            [                                ]
  Email            [                                ]
  Work address     [                                ]
  Work city        [                                ]
  Work postal code [                                ]
  Billing address  [                                ]
  Billing city     [                                ]
  Billing postal   [                                ]

Worker: Decolonia / Pedro Durán         [⌃ Collapse]
  [Apply latest worker data]
  Name             [Decolonia / Pedro Durán             ]
  Tax ID           [                                ]
  Phone            [                                ]
  Email            [                                ]
  Bank account     [                                ]
  Work address     [                                ]
  Work city        [                                ]
  Work postal code [                                ]
  Billing address  [                                ]
  Billing city     [                                ]
  Billing postal   [                                ]
```

During creation, the two actions use `Restore client data` and `Restore worker data` instead. They are hidden until the user changes the corresponding snapshot. During editing, `Apply latest client data` and `Apply latest worker data` are shown only when the document snapshot differs from the current linked record. After a refresh finds differences, the form presents a read-only summary before replacing the complete local snapshot.

```text
Apply latest client data?

The following fields differ from the current client record:
  - Phone
  - Billing address
  - Billing city

All client snapshot fields will be replaced in this document.
The client record itself will not be modified.

                         [Cancel] [Apply latest data]
```

If no fields differ, the form reports that the snapshot is already current and leaves the values unchanged. Accepted refreshes update the visible fields immediately; the document is persisted only when the user saves.

## Goals / Non-Goals

**Goals:**

- Provide the same snapshot editing and refresh behavior in budget and invoice creation/editing forms.
- Keep client and worker sections independently collapsible and collapsed by default.
- Reuse one snapshot section component and shared mapping/comparison helpers where practical.
- Use `Restore ...` wording during creation and `Apply latest ...` wording during editing.
- Apply accepted refreshes immediately to local form state so users can review the values before saving.
- Show a read-only list of changed fields before replacing a snapshot.
- Preserve current save/cancel semantics and historical snapshot behavior.

**Non-Goals:**

- Changing the linked client or worker on an existing document.
- Automatically updating documents when client or worker records change.
- Persisting a refresh independently of document save.
- Field-by-field merge selection or conflict resolution.
- Adding snapshot version columns, refresh audit events, database migrations, or new REST endpoints.

## Decisions

### Reuse existing persistence contracts

The implementation SHALL continue to send `clientSnapshot` and `workerSnapshot` through the existing budget and invoice create/update requests. The refresh operation is a frontend orchestration of existing `GET /api/clients/:id`, `GET /api/workers/:id`, and document `PATCH` behavior, so no backend contract or migration is required.

### Add a shared document-party snapshot section

Budget and invoice forms should use a shared component for the repeated concerns: summary header, independent collapsed state, snapshot inputs, bank account visibility for workers, refresh action, loading/error state, and changed-field summary. The forms remain responsible for selecting the initial source ids, holding aggregate form state, and submitting the document.

The component should accept a party kind (`client` or `worker`), the current snapshot, the source record or source id, whether the form is creating or editing, and callbacks for snapshot replacement. It should not own document persistence or client/worker association changes.

### Compare normalized snapshot values

Source records and document responses use different transport shapes: clients/workers have flat address fields while snapshots use nested work and billing addresses. Mapping both sides into the same snapshot form shape before comparison avoids false differences caused by null/empty-string representation or address layout. Comparison should cover every snapshot field, including worker bank account.

The change summary should use stable field labels and list only fields whose normalized values differ. It should not expose a merge checkbox for each field. Confirming applies the entire mapped snapshot; dismissing leaves the current form state untouched.

### Detect stale snapshots proactively

The form should fetch the current linked client and worker records on load and compare them with the document snapshots after normalizing both to the shared snapshot shape. This makes the refresh action conditional and avoids presenting an action that has no effect. The source should still be fetched again when the user activates the action so the change summary and replacement use current data.

For creation, the source records used to initialize the snapshots are already available. The form compares the current local snapshot against those records and shows the restore action only after a local edit. For editing, the initial comparison uses the records fetched on form load; a local snapshot edit also makes the apply-latest action visible because applying the source would replace different local values.

### Keep refresh local until submit

Restore/apply-latest actions update React form state immediately. They do not issue a document PATCH. This preserves cancel behavior, lets the user review the full resulting document, and keeps the existing single-save workflow intact. The form's dirty signature must include both snapshots so a refresh is recognized as an unsaved document change.

### Handle creation and editing with distinct action semantics

Creation uses the selected client and primary worker records already used to initialize snapshots. The action is labeled as restoring data because it resets possible local edits to source values. Editing fetches the linked source record on demand and labels the action as applying latest data because it updates an existing historical snapshot. The underlying replacement and summary behavior remains shared.

### No new ADR

The existing accepted commercial-document design decision already establishes document-owned snapshots for historical accuracy. This change applies that decision to editing and explicit refresh; it does not introduce a durable architectural choice that supersedes the current ADR.

## Risks / Trade-offs

- [Risk] Applying the complete source snapshot can overwrite intentional document-specific edits → Mitigation: show the changed-field summary and require explicit confirmation before replacing the local form state.
- [Risk] Users may expect refresh to be saved immediately → Mitigation: make the action update visible form values immediately and use clear copy that the document still requires Save; retain existing dirty/cancel handling.
- [Risk] Repeated budget/invoice form logic can drift → Mitigation: centralize presentation, mapping, normalization, and changed-field derivation in shared components/helpers and cover both forms with focused tests.
- [Risk] A source record can be archived or unavailable after the form opens → Mitigation: fetch on form load for visibility, fetch again on action for freshness, leave the snapshot unchanged on failure, and show an actionable error.
- [Risk] A long list of changed fields can make the confirmation noisy → Mitigation: summarize field labels only, with no old/new values or merge controls in the first iteration.

## Migration Plan

1. Add the shared snapshot section and comparison/mapping helpers.
2. Integrate the section into budget and invoice forms for both creation and editing.
3. Add localization strings and focused component/form tests.
4. Run the standard project checks and OpenSpec verification.

No data migration is required. Existing documents retain their snapshots and gain editing/refresh behavior when opened in the updated application. Rollback is a code rollback; persisted snapshot data remains valid because the storage contract is unchanged.

## Open Questions

None blocking. Exact visual styling and the final translated field labels should follow the existing component and localization conventions during implementation.
