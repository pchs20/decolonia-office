## 1. Shared Feedback Contract

- [x] 1.1 Add localized pending, preparation, and failure messages for PDF export and ZIP backup in every supported locale.
- [x] 1.2 Define the shared visual/accessibility conventions used by these actions: spinner or equivalent icon, disabled state, status semantics, retryable errors, and reduced-motion-safe behavior.

## 2. PDF Export Feedback

- [x] 2.1 Add pending and error state handling to the budget detail PDF export action, including disabled behavior, localized pending label, blob download handling, and retryable failure feedback.
- [x] 2.2 Add the equivalent pending and error state handling to the invoice detail PDF export action.
- [x] 2.3 Add focused download-boundary tests covering successful PDF response handling, cleanup, non-OK responses, and request failures for both document types.

## 3. Local Backup Download Feedback

- [x] 3.1 Replace the Backup & Export panel's silent ZIP navigation with an explicit client-managed request that validates the response, creates the browser download, and cleans up the object URL.
- [x] 3.2 Add preparation state, disabled conflicting backup controls, localized failure feedback, and reliable idle-state restoration for the ZIP download action.
- [x] 3.3 Add focused tests covering successful ZIP download, duplicate-click prevention, non-OK responses, and network/request failures without changing archive contents.

## 4. Cloud Sync Consistency

- [x] 4.1 Align Backup & Export cloud-sync pending/error accessibility semantics and conflicting-action disabling with the local backup behavior while preserving existing batch progress and completion details.
- [x] 4.2 Confirm the existing cloud-sync batch tests remain green while the shared Backup & Export operation-state changes preserve pending, completion, partial-failure, and retryable-failure behavior.

## 5. Verification

- [x] 5.1 Run focused affected tests and resolve failures.
- [x] 5.2 Run `pnpm test`, `pnpm check`, and `pnpm build` from the change worktree.
- [x] 5.3 Run OpenSpec verification for `add-loading-feedback` and confirm the implementation matches the proposal, specs, design, and tasks.
