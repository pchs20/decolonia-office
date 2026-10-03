## 1. Shared Header Styling

- [x] 1.1 Adjust the shared `DocumentHeader` title style to the smallest font size that keeps the longest supported localized title on one line within the existing document column.
- [x] 1.2 Preserve the current title alignment, bold weight, image placement, number metadata, date metadata, and shared usage by budget and invoice documents.

## 2. Regression Coverage

- [x] 2.1 Add or extend PDF tests covering budget and invoice title output for Spanish, Catalan, and English labels.
- [x] 2.2 Verify the Spanish budget title is not emitted as a hyphenated or split `PRE-` / `SUPUESTO` form.

## 3. Verification

- [x] 3.1 Run the web package test suite and type check.
- [x] 3.2 Verify the production PDF rendering path builds successfully and the focused header layout regression confirms single-line title output, preserved metadata, and unchanged header structure for representative budget and invoice titles.
