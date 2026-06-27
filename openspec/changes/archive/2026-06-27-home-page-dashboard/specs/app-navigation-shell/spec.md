## MODIFIED Requirements

### Requirement: App navigation shell layout
The system SHALL provide a `(web-routes)/layout.tsx` server component that wraps all app route pages (clients, workers, budgets, invoices, settings, and the home page dashboard) with an `<I18nProvider>` and an `<AppShell>` component containing a top navigation bar. The root route (`/`) SHALL resolve inside this group. This layout SHALL NOT apply to `/api/*` or `/api/docs` routes.

#### Scenario: Shell wraps app pages including the home page
- **WHEN** the user navigates to any route inside `(web-routes)/`, including `/`
- **THEN** the page SHALL render inside the navbar shell

#### Scenario: Shell does not wrap API routes
- **WHEN** a request is made to `/api/health` or `/api/docs`
- **THEN** the response SHALL NOT include any navbar HTML
