## 1. Shared Snapshot Model And UI

- [x] 1.1 Extract or add shared client/worker snapshot form types, source-to-snapshot mapping, normalization, and changed-field comparison helpers.
- [x] 1.2 Implement a reusable collapsible document-party snapshot section with independent collapsed state, complete editable fields, worker bank account support, and create/edit action labels.
- [x] 1.3 Add proactive source comparison, conditional action visibility, read-only changed-field summary, apply/cancel behavior, loading state, no-change feedback, and source-fetch error handling for refresh actions.

## 2. Budget Integration

- [x] 2.1 Replace the budget form's always-expanded client block with the shared snapshot section and preserve existing create/edit snapshot submission behavior.
- [x] 2.2 Add the editable worker snapshot section to the budget form while keeping the linked worker fixed during editing.
- [x] 2.3 Wire budget creation restore actions to the selected client and primary worker records and budget editing apply-latest actions to on-demand source fetches.

## 3. Invoice Integration

- [x] 3.1 Replace the invoice form's always-expanded client block with the shared snapshot section and preserve existing create/edit snapshot submission behavior.
- [x] 3.2 Add the editable worker snapshot section to the invoice form while keeping the linked worker fixed during editing.
- [x] 3.3 Wire invoice creation restore actions to the selected client and primary worker records and invoice editing apply-latest actions to on-demand source fetches.

## 4. Localization And Validation

- [x] 4.1 Add localized labels and messages for collapsed sections, restore/apply-latest actions, changed-field summaries, no-change feedback, loading states, and refresh errors.
- [x] 4.2 Add focused tests covering complete snapshot replacement, worker bank account editing, normalization/comparison, refresh cancellation, and unchanged-source behavior for both budget and invoice forms.
- [x] 4.3 Run `pnpm test`, `pnpm check`, `pnpm build`, and OpenSpec validation; full tests, direct TypeScript checking, JSON validation, whitespace checking, and `openspec validate edit-document-party-snapshots` pass. The repository wrapper check/build and direct Next build were terminated by the environment after timing out during TypeScript/optimized build processing without reporting a compilation error.
