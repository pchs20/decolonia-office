## 1. Install Dependencies

- [x] 1.1 Add `react-i18next` and `i18next` to `apps/web/package.json` and install

## 2. i18n Infrastructure

- [x] 2.1 Create `src/presentation/i18n/config.ts` with `SUPPORTED_LOCALES` and `DEFAULT_LOCALE = 'es'`
- [x] 2.2 Create `src/presentation/i18n/messages/es.json` with all UI strings for clients, workers, and common strings (source-of-truth locale)
- [x] 2.3 Create `src/presentation/i18n/messages/ca.json` with Catalan translations matching the shape of `es.json`
- [x] 2.4 Create `src/presentation/i18n/messages/en.json` with English translations matching the shape of `es.json`
- [x] 2.5 Create `src/presentation/i18n/i18next.d.ts` — module augmentation typing `resources` with the shape of `es.json` for compile-time key safety
- [x] 2.6 Create `src/presentation/i18n/provider.tsx` — `I18nProvider` client component that initialises react-i18next from the `locale` cookie value (falling back to `DEFAULT_LOCALE`)

## 3. Navigation Shell

- [x] 3.1 Create `src/presentation/components/LanguageToggle.tsx` — dropdown client component that reads current locale, renders `CA / ES / EN` options, switches react-i18next language in memory, and writes the `locale` cookie on selection
- [x] 3.2 Create `src/presentation/components/AppShell.tsx` — layout wrapper with a top navbar containing the app name, links to `/clients` and `/workers`, and the `<LanguageToggle>`
- [x] 3.3 Create `app/(web-routes)/layout.tsx` wrapping children with `<I18nProvider>` and `<AppShell>`

## 4. Root Layout: Dynamic `lang` Attribute

- [x] 4.1 Update `app/layout.tsx` to read the `locale` cookie from request headers and set `<html lang={locale}>`, falling back to `DEFAULT_LOCALE`

## 5. Migrate Hardcoded Strings

- [x] 5.1 Migrate `src/presentation/components/clients/ClientListPage.tsx` — replace all hardcoded strings with `t()` calls
- [x] 5.2 Migrate `src/presentation/components/clients/ClientDetailPage.tsx` — replace all hardcoded strings with `t()` calls
- [x] 5.3 Migrate `src/presentation/components/clients/ClientForm.tsx` — replace all hardcoded strings with `t()` calls
- [x] 5.4 Migrate `src/presentation/components/workers/WorkerListPage.tsx` — replace all hardcoded strings with `t()` calls
- [x] 5.5 Migrate `src/presentation/components/workers/WorkerDetailPage.tsx` — replace all hardcoded strings with `t()` calls
- [x] 5.6 Migrate `src/presentation/components/workers/WorkerForm.tsx` — replace all hardcoded strings with `t()` calls
- [x] 5.7 Migrate `src/presentation/components/profiles/ProfileCommonFields.tsx` — replace all hardcoded strings with `t()` calls
- [x] 5.8 Migrate `src/presentation/components/profiles/ProfileAddressFields.tsx` — replace all hardcoded strings with `t()` calls

## 6. Verify

- [x] 6.1 Confirm TypeScript compiles with no errors (`pnpm check`)
- [x] 6.2 Manually verify all three locales render correctly on the clients and workers screens
- [x] 6.3 Verify the `locale` cookie is written on toggle and the `<html lang>` attribute updates on next page load
