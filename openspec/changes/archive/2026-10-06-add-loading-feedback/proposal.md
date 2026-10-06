## Why

Some actions in the application take long enough that the interface appears idle while the server is working. PDF exports and complete backup downloads are the clearest examples: users receive no immediate confirmation that the request started, may click again, and have little feedback when an operation fails. The existing save and Google Drive synchronization patterns provide a foundation for making long-running actions observable and predictable.

## What Changes

- Add explicit pending feedback for budget and invoice PDF exports, including disabled controls, progress wording, and retryable error feedback.
- Make complete ZIP backup downloads an explicit client-managed request so the interface can represent preparation, prevent duplicate requests, and report failures.
- Preserve the existing Google Drive synchronization progress behavior while making the operation status and conflicting-action blocking consistent with the export experience.
- Establish a small, consistent loading-feedback contract for long-running user actions without introducing a background job system or changing export contents and API payloads.

## Capabilities

### New Capabilities

- `loading-feedback`: Defines user-visible pending, success, and failure feedback for long-running actions and the accessibility expectations for those states.

### Modified Capabilities

- `budget-and-invoices-export`: PDF export actions must communicate pending and failure states while preserving the existing PDF response behavior.
- `document-backup-export`: Complete ZIP backup downloads must communicate preparation and failure states while preserving the existing stateless archive contract.
- `document-cloud-sync`: Cloud synchronization feedback must consistently prevent conflicting backup operations and expose retryable failures.

## Impact

- Affected UI: budget and invoice detail pages, Backup & Export settings panel, and shared localized messages/icons used by these controls.
- Affected client behavior: PDF and ZIP binary downloads will be initiated through explicit client-side request handling rather than silent navigation where needed for feedback.
- Affected tests: presentation/component tests and focused API/download behavior tests may need coverage for pending, success, and failure paths.
- No database, authentication, export-format, or public API contract changes are expected.
