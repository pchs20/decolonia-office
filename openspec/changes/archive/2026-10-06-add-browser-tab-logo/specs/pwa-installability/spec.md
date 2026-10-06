## MODIFIED Requirements

### Requirement: Icon assets for PWA

The app SHALL provide icon files at 192x192 and 512x512 pixels in PNG format, referenced from the manifest. The icon files SHALL be square crops of the existing paint-cans photo used by the budget and invoice PDF headers, preserving that image as the source of the application's visual identity.

#### Scenario: Icons are served as static assets
- **WHEN** a browser requests the icon URLs specified in the manifest
- **THEN** PNG image files are returned with the correct 192x192 and 512x512 dimensions

#### Scenario: Icons use the PDF photo branding
- **WHEN** the 192x192 or 512x512 icon is inspected
- **THEN** it shows a square crop of the existing paint-cans photo rather than the previous solid-blue placeholder

#### Scenario: Icon appears on iPad home screen
- **WHEN** the app is installed on an iPad home screen
- **THEN** the configured cropped photo icon is displayed at the appropriate size for the device

### Requirement: Browser tab favicon

The root web application SHALL expose a favicon derived from the same square crop of the existing paint-cans photo, and the root HTML document SHALL reference that favicon through Next.js metadata.

#### Scenario: Browser displays the application favicon
- **WHEN** a browser loads any application route
- **THEN** the document head contains a favicon link pointing to the cropped photo asset

#### Scenario: Favicon branding matches the PWA icon
- **WHEN** the favicon and PWA icon assets are displayed
- **THEN** they use the same cropped photo branding
