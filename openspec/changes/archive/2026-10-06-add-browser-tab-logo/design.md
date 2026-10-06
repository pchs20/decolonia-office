## Context

The Next.js app already serves a manifest and two static PWA icons, but both icon files are solid-blue placeholders and the root layout does not declare a favicon. Budget and invoice PDFs already use the same byte-identical paint-cans photo at `apps/web/public/pdf/budget-image.jpg` and `apps/web/public/pdf/invoice-image.jpg`.

The requested behavior is limited to browser and installed-app branding. The rectangular PDF assets must remain unchanged because they are part of the document header layout.

## Architecture Diagrams

```text
apps/web/public/pdf/budget-image.jpg
                 │
                 │ square crop, exported as PNG
                 ▼
       apps/web/public/icons/
          ├── icon-192.png ──┐
          ├── icon-512.png ──┼── manifest.json ──▶ installed PWA icon
          └── favicon.png ───┘
                                │
apps/web/app/layout.tsx ────────┘
             │
             └──────────────────────────────▶ browser tab favicon
```

Assumption: the crop is selected once from the existing photo and resized to each required output dimension, rather than cropping independently per size. This keeps the visual framing consistent.

## Goals / Non-Goals

**Goals:**

- Provide a recognizable favicon for browser tabs.
- Replace the existing placeholder PWA icons with the same square crop.
- Keep all branding derived from the existing PDF photo.
- Preserve the existing manifest, PDF image assets, and PDF rendering behavior.
- Keep the change static and dependency-free.

**Non-Goals:**

- Redesigning the PDF header or changing PDF image dimensions.
- Creating a new logo or vector brand mark.
- Changing application title, theme colors, routes, or authentication behavior.
- Adding a favicon-generation runtime dependency.

## Decisions

### Use the existing PDF photo as the source

The budget and invoice source images are byte-identical, so `budget-image.jpg` is sufficient as the crop source. The invoice image remains untouched and continues to be loaded by PDF rendering.

### Use square PNG outputs

Square PNG files are appropriate for browser favicon and PWA icon consumers and match the manifest's existing PNG declarations. Generate 192x192 and 512x512 files for the manifest, plus a favicon-sized or favicon-compatible PNG used by Next.js metadata.

### Configure the favicon in root metadata

Add the favicon reference to `apps/web/app/layout.tsx` through the existing `Metadata` export. This keeps head configuration in the App Router's central layout and makes the favicon available to all application routes.

### Keep the manifest icon contract stable

Retain the existing `/icons/icon-192.png` and `/icons/icon-512.png` URLs and manifest structure. Replacing the files in place avoids unnecessary manifest changes and preserves installed-app references.

## Risks / Trade-offs

- [Risk] A detailed photograph may be visually busy at 16x16 browser-tab size → Mitigation: use a tightly framed square crop with the paint cans and brush as the dominant subject, then inspect the generated asset at small sizes.
- [Risk] Browser or PWA caches may continue showing the old blue icon → Mitigation: retain stable icon URLs for PWA compatibility but use a versioned favicon URL or document cache-busting behavior in validation if needed.
- [Risk] Image conversion tooling may not be available in every development environment → Mitigation: generate committed static assets during implementation using an existing image tool available in the environment, without adding a runtime dependency.
- [Risk] Replacing the PWA icons could affect existing installations → Mitigation: keep dimensions, paths, and manifest metadata unchanged; users may need to reinstall or refresh an installed app for the new icon to appear.

## Migration Plan

1. Generate the square crop from the existing PDF photo and write the required PNG assets under `apps/web/public/icons/`.
2. Add the favicon metadata reference and leave the manifest URLs unchanged.
3. Validate image dimensions, static asset serving, rendered metadata, and the existing test/check/build commands.
4. Roll back by restoring the two original blue icon files and removing the favicon metadata entry; no data migration or deployment sequencing is required.

## Open Questions

- None. The source image, square-crop approach, asset locations, and browser/PWA scope are defined.
