## MODIFIED Requirements

### Requirement: App navigation shell layout
The system SHALL provide a `(web-routes)/layout.tsx` server component that wraps all app route pages (clients, workers, budgets, invoices, settings, and the home page dashboard) with an `<I18nProvider>` and an `<AppShell>` component. On large screens (`md` breakpoint and above) the shell SHALL render a persistent top navigation bar. On small screens (below `md`) the shell SHALL render a minimal top bar and a fixed bottom tab bar. The root route (`/`) SHALL resolve inside this group. This layout SHALL NOT apply to `/api/*` or `/api/docs` routes.

#### Scenario: Shell wraps app pages including the home page
- **WHEN** the user navigates to any route inside `(web-routes)/`, including `/`
- **THEN** the page SHALL render inside the navbar shell

#### Scenario: Shell does not wrap API routes
- **WHEN** a request is made to `/api/health` or `/api/docs`
- **THEN** the response SHALL NOT include any navbar HTML

---

### Requirement: Top navigation bar
The system SHALL render a persistent top navigation bar on all app pages. On large screens it SHALL contain: the application name, icon+label navigation links for Home, Clients, Budgets, Invoices, and Settings — each with its section brand color when active — plus the language dropdown and sign-out icon. On small screens the top bar SHALL contain only the application name, the language dropdown, and the sign-out icon.

#### Scenario: Navbar is visible on all app pages
- **WHEN** the user is on any page inside `(web-routes)/`
- **THEN** a navigation bar SHALL be visible at the top of the page

#### Scenario: Desktop navbar shows icon and label per section
- **WHEN** the viewport is at or above the `md` breakpoint
- **THEN** each nav item SHALL display its Lucide icon alongside its text label

#### Scenario: Mobile navbar hides section nav links
- **WHEN** the viewport is below the `md` breakpoint
- **THEN** the section nav links SHALL NOT be visible in the top bar

#### Scenario: Active nav item uses section brand color
- **WHEN** the user is on a page belonging to a section (e.g., `/budgets/*`)
- **THEN** the corresponding nav item SHALL be styled with that section's brand color (e.g., blue for budgets)

---

### Requirement: Mobile bottom tab bar
The system SHALL render a fixed bottom navigation bar on small screens (below `md` breakpoint) containing five icon-only tabs: Home, Clients, Budgets, Invoices, and Settings. The active tab SHALL be highlighted with its section brand color; inactive tabs SHALL use `slate-400`. The main content area SHALL have sufficient bottom padding to not be obscured by the bottom bar.

#### Scenario: Bottom tab bar is visible on mobile
- **WHEN** the viewport is below the `md` breakpoint
- **THEN** a fixed bottom tab bar SHALL be visible with five icon tabs

#### Scenario: Bottom tab bar is hidden on desktop
- **WHEN** the viewport is at or above the `md` breakpoint
- **THEN** the fixed bottom tab bar SHALL NOT be rendered

#### Scenario: Active bottom tab uses section color
- **WHEN** the user is on `/clients` or any `/clients/*` route
- **THEN** the Clients bottom tab icon SHALL be styled with the client amber color

#### Scenario: Tapping a bottom tab navigates to the section
- **WHEN** the user taps the Budgets bottom tab
- **THEN** the system SHALL navigate to `/budgets`

---

### Requirement: Language toggle dropdown
The system SHALL provide a `<LanguageToggle>` client component in `src/presentation/components/LanguageToggle.tsx` that renders a Globe icon followed by the current locale code and a dropdown chevron. On interaction it SHALL display a dropdown listing all supported locales. On selection it SHALL update the react-i18next language in memory and write the `locale` cookie. On large screens the toggle SHALL display the Globe icon and the current locale code; on small screens the Globe icon alone MAY be used if space is constrained.

#### Scenario: Toggle shows Globe icon and current locale on desktop
- **WHEN** the active locale is `es` and the viewport is `md` or above
- **THEN** the toggle SHALL display a Globe icon and the text `ES`

#### Scenario: Dropdown opens on click
- **WHEN** the user clicks the language toggle
- **THEN** a dropdown SHALL appear listing `CA`, `ES`, and `EN`

#### Scenario: User can switch locale via dropdown
- **WHEN** the user selects `ca` from the dropdown
- **THEN** the UI text SHALL switch to Catalan without a full page reload

---

### Requirement: Sign-out control
The system SHALL provide a `<SignOutButton>` client component in `src/presentation/components/SignOutButton.tsx` that renders a `LogOut` Lucide icon styled in red. On click it SHALL sign the user out and redirect to `/login`. No visible text label is required.

#### Scenario: Sign-out renders as a red icon
- **WHEN** the sign-out control is rendered
- **THEN** it SHALL display a `LogOut` icon in `red-500` with no text label visible

#### Scenario: Clicking sign-out redirects to login
- **WHEN** the user clicks the sign-out icon
- **THEN** the session SHALL be invalidated and the user SHALL be redirected to `/login`

---

### Requirement: Main navigation menu
The system SHALL display navigation to all available features via both the top bar (desktop) and the bottom tab bar (mobile). The nav items SHALL cover: Home (`/`), Clients (`/clients`), Budgets (`/budgets`), Invoices (`/invoices`), and Settings (`/settings/catalog`).

#### Scenario: Budgets nav item navigates to budgets list
- **WHEN** the user activates the Budgets nav item (top or bottom)
- **THEN** the system SHALL navigate to `/budgets`

#### Scenario: Invoices nav item navigates to invoices list
- **WHEN** the user activates the Invoices nav item (top or bottom)
- **THEN** the system SHALL navigate to `/invoices`

#### Scenario: Settings nav item navigates to settings
- **WHEN** the user activates the Settings nav item (top or bottom)
- **THEN** the system SHALL navigate to `/settings/catalog`

## REMOVED Requirements

### Requirement: Quick action buttons
**Reason**: Removed from the nav shell. Quick-action buttons (New Budget / New Invoice) are adequately surfaced on the home page dashboard and within each section's list page. A persistent nav-level shortcut adds clutter on the now-compact mobile nav.
**Migration**: Users reach the new-document forms from the dashboard quick-action cards or the section "New" buttons on list pages.
