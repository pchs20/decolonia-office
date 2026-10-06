## 1. Repository Fix

- [x] 1.1 Add `identifier_source` to the budget duplication `SELECT` in the same position as the `INSERT` target column.
- [x] 1.2 Add `identifier_source` to the invoice duplication `SELECT` in the same position as the `INSERT` target column.

## 2. Regression Coverage

- [x] 2.1 Update the budget duplication repository test to verify the corrected SQL alignment and preserved row metadata.
- [x] 2.2 Update the invoice duplication repository test to verify the corrected SQL alignment and preserved row metadata.

## 3. Validation

- [x] 3.1 Run the focused commercial-document duplication repository tests.
- [x] 3.2 Run the relevant project checks, including type checking and build where available.
- [x] 3.3 Run OpenSpec verification and inspect the complete worktree diff.

The focused test suite, full web test suite, and TypeScript check pass. The
Next.js production build was attempted twice but timed out during optimized
production compilation without reporting a compiler error.
