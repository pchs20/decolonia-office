## Why

The application UI is entirely in hardcoded English, but the primary users are Catalan and Spanish speakers. The app needs to be available in Catalan, Spanish, and English so that it feels native to its audience and can be used comfortably by all staff.

## What Changes

- Add `react-i18next` as the i18n library with TypeScript key safety
- Add flat JSON translation files for `es` (Spanish, default), `ca` (Catalan), and `en` (English)
- Add a locale configuration constant (`DEFAULT_LOCALE = 'es'`) as the single place to change the default
- Store the user's locale choice in a cookie (enabling correct server-side `<html lang>` rendering)
- Introduce a persistent app navigation shell (`(web-routes)/layout.tsx`) with a top navbar
- Add a language dropdown toggle in the navbar (`ca · es · en`)
- Migrate all hardcoded UI strings in existing client and worker screens to translation keys

## Capabilities

### New Capabilities

- `ui-i18n`: React-i18next setup, locale JSON files (es/ca/en), TypeScript key safety, locale provider, cookie-based persistence, and default locale configuration — all scoped to `src/presentation/i18n/`
- `app-navigation-shell`: Persistent navbar layout wrapping all app routes (`(web-routes)/layout.tsx`), including the language toggle dropdown

### Modified Capabilities

_(none — existing specs do not cover UI text or navigation shell requirements)_

## Impact

- **New dependency**: `react-i18next`, `i18next`, `i18next-browser-languagedetector` in `apps/web`
- **New files**: `apps/web/src/presentation/i18n/` (config, provider, hook, types), `apps/web/src/presentation/i18n/messages/{es,ca,en}.json`
- **New files**: `apps/web/app/(web-routes)/layout.tsx`, `apps/web/src/presentation/components/LanguageToggle.tsx`
- **Modified files**: `apps/web/app/layout.tsx` (dynamic `lang` attr from cookie), all existing presentation components (strings → `t()` calls)
- **No API changes**, no database changes, no breaking changes
