## ADDED Requirements

### Requirement: App navigation shell layout
The system SHALL provide a `(web-routes)/layout.tsx` server component that wraps all app route pages (clients, workers, and future routes) with an `<I18nProvider>` and an `<AppShell>` component containing a top navigation bar. This layout SHALL NOT apply to `/api/*` or `/api/docs` routes.

#### Scenario: Shell wraps app pages
- **WHEN** the user navigates to any route inside `(web-routes)/`
- **THEN** the page SHALL render inside the navbar shell

#### Scenario: Shell does not wrap API routes
- **WHEN** a request is made to `/api/health` or `/api/docs`
- **THEN** the response SHALL NOT include any navbar HTML

---

### Requirement: Top navigation bar
The system SHALL render a persistent top navigation bar on all app pages containing at minimum: the application name, navigation links to Clients and Workers sections, and the language toggle.

#### Scenario: Navbar is visible on all app pages
- **WHEN** the user is on any page inside `(web-routes)/`
- **THEN** a navigation bar SHALL be visible at the top of the page

#### Scenario: Navbar contains app navigation links
- **WHEN** the navbar is rendered
- **THEN** it SHALL contain a link to `/clients` and a link to `/workers`

---

### Requirement: Language toggle dropdown
The system SHALL provide a `<LanguageToggle>` client component in `src/presentation/components/LanguageToggle.tsx` that displays the current locale and allows the user to switch between `ca`, `es`, and `en`. On selection it SHALL update the react-i18next language in memory and write the `locale` cookie.

#### Scenario: Toggle shows current locale
- **WHEN** the active locale is `es`
- **THEN** the toggle SHALL visually indicate Spanish as the current selection

#### Scenario: User can switch locale
- **WHEN** the user selects `ca` from the toggle
- **THEN** the UI text SHALL switch to Catalan without a full page reload

#### Scenario: Toggle is accessible without a flag icon
- **WHEN** the toggle is rendered
- **THEN** it SHALL identify locales by their language name or code (e.g., `CA`, `ES`, `EN`), not by country flags
