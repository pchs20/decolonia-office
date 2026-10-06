## 1. OpenSpec And Persistence

- [x] 1.1 Add focused change artifacts for multiline job-item titles
- [x] 1.2 Add a migration changing `job_items.title` from `VARCHAR(255)` to `TEXT`

## 2. Shared Editing And Display

- [x] 2.1 Convert the shared job-item title editor to an auto-growing textarea with description-parity keyboard behavior
- [x] 2.2 Preserve multiline titles in the shared web job-items table
- [x] 2.3 Ensure budget and invoice forms continue to persist and compare multiline titles correctly

## 3. PDF Export

- [x] 3.1 Preserve explicit title line breaks and wrapping in the shared PDF job-items table

## 4. Tests And Verification

- [x] 4.1 Add focused tests for multiline title editing, validation, web display, and persistence
- [x] 4.2 Add focused PDF coverage for multiline title output
- [x] 4.3 Run standard checks and OpenSpec verification
