## Context

The web app (`apps/web`) is a Next.js 15 App Router application. All UI text is currently hardcoded in English directly inside TSX components. There is no i18n infrastructure. The target audiences are Catalan and Spanish speakers; English is a tertiary locale.

ADR 0002 enforces strict layer boundaries. The translation system must live entirely in the `presentation` layer — domain, application, infrastructure, and API layers must remain language-agnostic. This is not a constraint that needs revisiting.

The app uses the Next.js App Router with a mix of server components (layouts, page shells) and client components (`"use client"` — all current screens). The locale choice must be readable server-side (for the `<html lang>` attribute) and writable client-side (when the user switches language).

## Architecture Diagrams

```
┌─────────────────────────────────────────────────────────────────┐
│  apps/web                                                       │
│                                                                 │
│  app/                                                           │
│    layout.tsx ──────────────── reads locale cookie             │
│      └─ <html lang={locale}>                                    │
│    (web-routes)/                                                │
│      layout.tsx ─────────────── AppShell (server)              │
│        └─ <I18nProvider> ──────── client boundary              │
│             └─ <Navbar>                                         │
│                  └─ <LanguageToggle> ── writes cookie           │
│        └─ {children}                                            │
│                                                                 │
│  src/presentation/                                              │
│    i18n/                                                        │
│      config.ts ──────── SUPPORTED_LOCALES, DEFAULT_LOCALE      │
│      provider.tsx ────── I18nProvider (react-i18next init)     │
│      messages/                                                  │
│        es.json  ←── default                                     │
│        ca.json                                                  │
│        en.json                                                  │
│    components/                                                  │
│      AppShell.tsx ──────── navbar + layout wrapper             │
│      LanguageToggle.tsx ── dropdown, writes cookie              │
│      clients/  ← t() calls replacing hardcoded strings        │
│      workers/  ← t() calls replacing hardcoded strings        │
└─────────────────────────────────────────────────────────────────┘
```

**Cookie flow:**
```
User clicks locale toggle
  → LanguageToggle sets cookie: locale=ca (SameSite=Lax, path=/)
  → react-i18next switches language in-memory (no page reload)
  → Next page load: layout.tsx reads cookie → <html lang="ca">
```

## Goals / Non-Goals

**Goals:**
- Support Catalan (ca), Spanish (es), and English (en) in the UI
- Spanish as default locale, changeable via a single constant
- User locale preference persisted across sessions (cookie)
- Correct `<html lang>` attribute for screen readers and spell-check
- TypeScript-safe translation key access (compile-time errors on typos)
- Language toggle accessible from every app screen via the navbar
- Navbar shell that wraps all `(web-routes)` pages

**Non-Goals:**
- Server-side or API response translation
- Locale in URL paths
- Pluralisation rules (not needed yet; react-i18next supports it if needed later)
- Right-to-left layout support
- External translation management tooling

## Decisions

### D1 — Library: react-i18next

**Chosen:** `react-i18next` + `i18next`

**Rationale:** The app is fully client-rendered at the component level (`"use client"` throughout). react-i18next is the de facto standard for React i18n, has first-class TypeScript support for key safety, handles string interpolation and plurals if needed later, and integrates cleanly with both client and server components in the App Router. Its cookie/localStorage detection is a one-import plugin.

**Alternatives considered:**
- `next-intl`: Excellent App Router integration, but is designed around URL-based locale routing. Using it without URL segments requires fighting its defaults. Not worth the friction.
- DIY React context: ~80 lines, zero deps. Sufficient for current strings but lacks interpolation, plurals, and key-safety without extra work. Ruled out in favour of the proven library.

---

### D2 — Locale storage: cookie (not localStorage)

**Chosen:** A `locale` cookie (`SameSite=Lax`, `path=/`, no expiry = session + browser persistent)

**Rationale:** `localStorage` is only readable after hydration. The `<html lang>` attribute is set in `layout.tsx` (a server component), which runs before the browser executes any JS. A cookie travels with every request, so the server can read it and emit the correct `lang` attribute on first render — no hydration mismatch.

**Alternatives considered:**
- `localStorage` only: Simpler, but `lang` attribute would always be `"es"` regardless of user choice. Incorrect for screen readers. Rejected.
- `localStorage` + a client-side `useEffect` to set `document.documentElement.lang`: Works, but causes a flash/correction after hydration. Rejected.

---

### D3 — Default locale: single constant in config.ts

**Chosen:** `DEFAULT_LOCALE = 'es'` in `src/presentation/i18n/config.ts`

**Rationale:** Centralised, obvious, one line to change. The same constant is used by the provider (fallback language), the cookie reader in `layout.tsx`, and any future middleware.

---

### D4 — Translation file structure: nested JSON per locale

**Chosen:** One JSON file per locale with nested keys grouped by screen/concept:

```json
{
  "common": { "loading": "Cargando...", "actions": "Acciones" },
  "clients": { "title": "Clientes", "addButton": "Añadir cliente" },
  "workers": { "title": "Trabajadores" }
}
```

**Rationale:** Nested keys are self-documenting, map naturally to component structure, and are idiomatic with react-i18next namespaces. Flat keys risk collisions as the app grows.

---

### D5 — TypeScript key safety via module augmentation

**Chosen:** `i18next.d.ts` declaration file that augments the `i18next` module with the shape of `es.json` (the source-of-truth locale).

```ts
// src/presentation/i18n/i18next.d.ts
import type es from './messages/es.json';
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: { translation: typeof es };
  }
}
```

**Rationale:** Zero runtime cost. Typos in `t("clients.addButon")` become compile errors. The Spanish file is the canonical key source; other locales must match its shape.

---

### D6 — Navbar shell: `(web-routes)/layout.tsx`

**Chosen:** A new `layout.tsx` inside the `(web-routes)` route group that wraps all app pages with `<I18nProvider>` and `<AppShell>` (navbar + content area).

**Rationale:** The root `layout.tsx` handles `<html>` and `<body>` only. The `(web-routes)` group already segregates app pages from API and docs routes. Adding a layout there is the natural Next.js App Router pattern — it scopes the navbar and i18n provider to app screens only, without affecting `/api/*` or `/api/docs`.

## Risks / Trade-offs

- **Cookie on first visit**: On the very first visit (no cookie set), `layout.tsx` falls back to `DEFAULT_LOCALE`. The user sees Spanish. This is the correct behaviour.
- **Hydration mismatch**: If the cookie is set but react-i18next initialises with a different locale before reading it, strings could flash. Mitigation: initialise react-i18next synchronously from the cookie value passed as a prop from the server layout into the provider.
- **Translation drift**: As new strings are added in `es.json`, `ca.json` and `en.json` may lag. Mitigation: TypeScript will flag missing keys in the declaration file if all locales are typed. For now, react-i18next falls back to the key name, which is visible but not broken.
- **String migration effort**: ~50 hardcoded strings across current screens. Low risk — mechanical replacement with `t()` calls.

## Migration Plan

1. Install `react-i18next` and `i18next` in `apps/web`
2. Create `src/presentation/i18n/` with config, provider, types, and message files
3. Add `(web-routes)/layout.tsx` wrapping pages with `<I18nProvider>` and `<AppShell>`
4. Update root `layout.tsx` to read the `locale` cookie and set `<html lang>`
5. Replace hardcoded strings in client/worker components with `t()` calls
6. Add `LanguageToggle` component to the navbar

No data migrations. No API changes. Rollback: revert the layout changes and remove the i18n provider — components fall back to hardcoded strings.

## Open Questions

_(none — all decisions resolved during exploration)_
