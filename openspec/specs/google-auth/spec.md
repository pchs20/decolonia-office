# Google Auth

## Purpose

Define requirements for protecting the application with Google OAuth authentication, accessible only to an email-based allowlist of users.

## Requirements

### Requirement: Google OAuth login
The system SHALL provide a `/login` page with a Google OAuth sign-in button that initiates the OAuth 2.0 authorisation code flow via Auth.js v5.

#### Scenario: Unauthenticated user visits a protected route
- **WHEN** an unauthenticated user navigates to any route except `/login`
- **THEN** the system redirects them to `/login`

#### Scenario: User signs in with Google
- **WHEN** a user on `/login` clicks "Sign in with Google" and completes Google OAuth
- **THEN** the system sets a signed HTTP-only JWT session cookie and redirects the user to the originally requested route (or `/` if none)

#### Scenario: Unauthorised Google account is rejected
- **WHEN** a user completes Google OAuth but their email is not in `ALLOWED_EMAILS`
- **THEN** the system denies the sign-in and the user remains on the login page with an error indicator

### Requirement: Route protection via middleware
The system SHALL enforce authentication on all routes via a Next.js middleware that runs before every request (excluding `/login`, `/api/auth/**`, and Next.js internals).

#### Scenario: Authenticated user accesses a web route
- **WHEN** an authenticated, allowlisted user requests any `(web-routes)` page
- **THEN** the request passes through and the page is rendered normally

#### Scenario: Unauthenticated request to a web route
- **WHEN** an unauthenticated request arrives at any route outside `/login` and `/api/auth/**`
- **THEN** the middleware redirects to `/login`

#### Scenario: Unauthenticated request to an API route
- **WHEN** an unauthenticated request arrives at any `/api/**` path (excluding `/api/auth/**`)
- **THEN** the middleware returns HTTP 401 with body `{ "error": "Unauthorized" }`

#### Scenario: Authenticated but non-allowlisted request to an API route
- **WHEN** an authenticated user whose email is not in `ALLOWED_EMAILS` makes a request to `/api/**`
- **THEN** the middleware returns HTTP 403 with body `{ "error": "Forbidden" }`

#### Scenario: Authenticated request to an API route
- **WHEN** an authenticated, allowlisted user makes a request to `/api/**`
- **THEN** the request passes through and the handler executes normally

### Requirement: Email-based allowlist via environment variable
The system SHALL restrict sign-in to a configurable list of email addresses defined in the `ALLOWED_EMAILS` environment variable.

#### Scenario: Allowlist is read from environment
- **WHEN** the application starts
- **THEN** `ALLOWED_EMAILS` is parsed as a comma-separated list of email addresses (whitespace-trimmed)

#### Scenario: Allowlist controls sign-in access
- **WHEN** a Google-authenticated user's email is present in the parsed allowlist
- **THEN** sign-in succeeds and a session is established

#### Scenario: User not on allowlist cannot sign in
- **WHEN** a Google-authenticated user's email is absent from the parsed allowlist
- **THEN** sign-in is denied and no session is established

### Requirement: Session persistence via JWT cookie
The system SHALL maintain authenticated sessions using a signed, HTTP-only JWT cookie managed by Auth.js.

#### Scenario: Session cookie is set after successful login
- **WHEN** a user successfully signs in via Google OAuth
- **THEN** a signed, HTTP-only, `SameSite=Lax` session cookie is set in the browser

#### Scenario: Session persists across page navigations
- **WHEN** an authenticated user navigates between pages
- **THEN** the session cookie is sent with each request and the user remains authenticated without re-authenticating

#### Scenario: Signing out clears the session
- **WHEN** a user signs out
- **THEN** the session cookie is cleared and the user is redirected to `/login`
