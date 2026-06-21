## Purpose

Provide internationalization (i18n) infrastructure for the web app, enabling multi-locale UI text support (Catalan, Spanish, English) with TypeScript-safe translation keys, cookie-based locale persistence, and correct `<html lang>` attributes for accessibility.

## Requirements

### Requirement: Locale configuration
The system SHALL define a list of supported locales (`ca`, `es`, `en`) and a single `DEFAULT_LOCALE` constant in `src/presentation/i18n/config.ts` that controls the fallback and initial locale when no user preference exists.

#### Scenario: Default locale is Spanish
- **WHEN** `DEFAULT_LOCALE` is read
- **THEN** its value SHALL be `'es'`

#### Scenario: Supported locales list is exhaustive
- **WHEN** `SUPPORTED_LOCALES` is read
- **THEN** it SHALL contain exactly `['ca', 'es', 'en']`

---

### Requirement: Translation message files
The system SHALL provide one flat JSON translation file per supported locale at `src/presentation/i18n/messages/{locale}.json`, containing all UI strings grouped by screen/concept using nested keys.

#### Scenario: All locales cover the same keys
- **WHEN** `ca.json`, `es.json`, and `en.json` are present
- **THEN** each file SHALL define the same top-level namespaces (`common`, `clients`, `workers`)

#### Scenario: Missing key falls back gracefully
- **WHEN** a translation key exists in `es.json` but is absent in `ca.json`
- **THEN** the UI SHALL display the key path as a string (react-i18next default) rather than crashing

---

### Requirement: i18n provider
The system SHALL expose an `I18nProvider` React component at `src/presentation/i18n/provider.tsx` that initialises react-i18next with the correct locale on mount, using the `locale` cookie value as the initial language and `DEFAULT_LOCALE` as the fallback.

#### Scenario: Provider initialises with cookie locale
- **WHEN** the `locale` cookie is set to `ca`
- **THEN** react-i18next SHALL be initialised with language `ca`

#### Scenario: Provider falls back to default when no cookie
- **WHEN** no `locale` cookie is present
- **THEN** react-i18next SHALL be initialised with `DEFAULT_LOCALE`

---

### Requirement: Locale persistence via cookie
The system SHALL persist the user's locale choice in a browser cookie named `locale` with `path=/` and `SameSite=Lax`, written whenever the user changes the language.

#### Scenario: Cookie written on language change
- **WHEN** the user selects a different locale from the language toggle
- **THEN** a cookie `locale={value}` SHALL be set in the browser

#### Scenario: Cookie readable server-side on next request
- **WHEN** the page is loaded after the cookie has been set
- **THEN** the server SHALL be able to read the `locale` cookie value from the request headers

---

### Requirement: TypeScript key safety
The system SHALL provide an `i18next.d.ts` declaration file at `src/presentation/i18n/i18next.d.ts` that augments the `i18next` module with the type shape of `es.json`, so that incorrect or missing translation keys produce TypeScript compile errors.

#### Scenario: Valid key compiles
- **WHEN** a component calls `t('clients.title')`
- **THEN** TypeScript SHALL accept the call without error

#### Scenario: Invalid key fails to compile
- **WHEN** a component calls `t('clients.nonexistentKey')`
- **THEN** TypeScript SHALL produce a compile-time error

---

### Requirement: `<html lang>` reflects active locale
The system SHALL set the `lang` attribute on the root `<html>` element to the active locale code, read from the `locale` cookie on every server render.

#### Scenario: Lang attribute matches cookie
- **WHEN** the `locale` cookie is `ca`
- **THEN** the rendered HTML SHALL include `<html lang="ca">`

#### Scenario: Lang attribute defaults when no cookie
- **WHEN** no `locale` cookie is present
- **THEN** the rendered HTML SHALL include `<html lang="es">`

---

### Requirement: All existing UI strings are translated
The system SHALL replace all hardcoded English strings in `src/presentation/components/clients/` and `src/presentation/components/workers/` with `t()` calls using the appropriate translation keys from the message files.

#### Scenario: Client list page renders in active locale
- **WHEN** the active locale is `ca`
- **THEN** all visible text on the clients list page SHALL be in Catalan

#### Scenario: Worker screens render in active locale
- **WHEN** the active locale is `es`
- **THEN** all visible text on the workers screens SHALL be in Spanish
