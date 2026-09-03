## 1. Static Assets

- [x] 1.1 Add the fixed budget PDF image asset under `apps/web/public/pdf/` using a stable descriptive filename.
- [x] 1.2 Add the fixed invoice PDF image asset under `apps/web/public/pdf/` using a stable descriptive filename, initially matching the budget image.

## 2. PDF Rendering

- [x] 2.1 Add independent budget and invoice image selections to the server-side PDF rendering flow.
- [x] 2.2 Resolve the selected static image into a source supported by server-side `@react-pdf/renderer` rendering.
- [x] 2.3 Update the shared issuer block to render the selected image to the left of the existing worker name and information.
- [x] 2.4 Constrain image dimensions and preserve the image aspect ratio without removing existing issuer fields.

## 3. Verification

- [x] 3.1 Add or update focused PDF rendering tests to verify budget and invoice PDFs use their corresponding image assets.
- [x] 3.2 Verify PDFs render successfully with minimal and complete worker information and that the issuer image does not disrupt the header layout.
- [x] 3.3 Run `pnpm test`, `pnpm check`, and `pnpm build` from the task worktree.
