# PWA Installability

## Purpose

Define the requirements for making the Next.js web app installable as a Progressive Web App on iPad via Safari's "Add to Home Screen" feature.

## ADDED Requirements

### Requirement: Web app manifest
The app SHALL provide a `manifest.json` file served from `apps/web/public/manifest.json` and linked from the root HTML layout, containing the minimum fields required for PWA installability.

#### Scenario: Manifest is discoverable by the browser
- **WHEN** a browser loads the web app
- **THEN** it finds a `<link rel="manifest">` tag in the `<head>` pointing to `/manifest.json`

#### Scenario: Manifest contains required PWA fields
- **WHEN** the manifest is fetched and parsed
- **THEN** it contains `name`, `short_name`, `start_url`, `display: "standalone"`, `background_color`, `theme_color`, and at least one icon entry (192×192 PNG)

### Requirement: App is installable on iPad via Add to Home Screen
The web app SHALL be installable on iPad through Safari's "Add to Home Screen" flow, launching in standalone display mode without the browser chrome.

#### Scenario: User installs the app on iPad
- **WHEN** a user visits the production URL in Safari on iPad and taps "Add to Home Screen"
- **THEN** the app is added to the home screen with the configured icon and short name

#### Scenario: App launches in standalone mode
- **WHEN** the app is launched from the iPad home screen
- **THEN** it opens in standalone display mode (no Safari navigation bar or address bar visible)

### Requirement: Theme and viewport meta tags
The app layout SHALL include `theme-color`, `apple-mobile-web-app-capable`, and `apple-mobile-web-app-status-bar-style` meta tags in the HTML `<head>` to ensure correct rendering on iOS.

#### Scenario: iOS respects theme color
- **WHEN** the app is viewed in Safari on iOS
- **THEN** the browser UI chrome matches the configured theme color

#### Scenario: iOS standalone mode is enabled
- **WHEN** the HTML `<head>` is inspected
- **THEN** it contains `<meta name="apple-mobile-web-app-capable" content="yes">` and `<meta name="apple-mobile-web-app-status-bar-style">`

### Requirement: Icon assets for PWA
The app SHALL provide icon files at 192×192 and 512×512 pixels in PNG format, referenced from the manifest.

#### Scenario: Icons are served as static assets
- **WHEN** a browser requests the icon URLs specified in the manifest
- **THEN** PNG image files are returned with the correct dimensions

#### Scenario: Icon appears on iPad home screen
- **WHEN** the app is installed on an iPad home screen
- **THEN** the configured icon is displayed at the appropriate size for the device
