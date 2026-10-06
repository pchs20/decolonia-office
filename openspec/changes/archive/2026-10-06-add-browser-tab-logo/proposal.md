## Why

The browser tab currently has no recognizable application icon, while the same paint-cans image already establishes the visual identity of the budget and invoice PDFs. Reusing a square crop of that existing photo will make the web app easier to identify without introducing a separate brand asset.

## What Changes

- Add a square favicon derived by cropping the existing PDF paint-cans photo.
- Configure the cropped image as the browser tab icon through the Next.js application metadata.
- Use the same cropped image for the PWA icon assets so browser-tab and installed-app branding are consistent.
- Preserve the existing rectangular PDF image assets and PDF rendering behavior.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `pwa-installability`: Require the application favicon and PWA icons to use a square crop of the existing PDF photo, while preserving the existing manifest and installability behavior.

## Impact

- Static assets under `apps/web/public/icons/`.
- Root Next.js metadata in `apps/web/app/layout.tsx`.
- PWA icon references in `apps/web/public/manifest.json`.
- Existing `apps/web/public/pdf/*.jpg` assets are read-only source assets for the crop and are not changed.
- No API, database, dependency, or PDF-generation changes.
