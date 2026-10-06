## 1. Create Branded Icon Assets

- [x] 1.1 Create a square crop of `apps/web/public/pdf/budget-image.jpg` with the paint cans and brush clearly visible at small sizes.
- [x] 1.2 Replace `apps/web/public/icons/icon-192.png` with the crop exported at exactly 192x192 pixels.
- [x] 1.3 Replace `apps/web/public/icons/icon-512.png` with the same crop exported at exactly 512x512 pixels.
- [x] 1.4 Add a favicon asset derived from the same crop in a browser-compatible PNG or ICO format.

## 2. Wire Browser And PWA Branding

- [x] 2.1 Configure the favicon asset in `apps/web/app/layout.tsx` through the root Next.js metadata export.
- [x] 2.2 Confirm `apps/web/public/manifest.json` continues to reference the branded 192x192 and 512x512 assets with correct metadata.

## 3. Validate The Change

- [x] 3.1 Verify the generated icon files are valid image files with the required dimensions and consistent crop framing.
- [x] 3.2 Verify the favicon is emitted in the rendered document head and the static icon URLs remain reachable.
- [x] 3.3 Run the relevant project checks, including `pnpm test`, `pnpm check`, and `pnpm build`, and confirm PDF image assets and PDF rendering behavior remain unchanged.
