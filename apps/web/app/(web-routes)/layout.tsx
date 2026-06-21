import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { I18nProvider } from '@/presentation/i18n/provider';
import { AppShell } from '@/presentation/components/AppShell';
import { DEFAULT_LOCALE, LOCALE_COOKIE, SUPPORTED_LOCALES, type Locale } from '@/presentation/i18n/config';

export default async function WebRoutesLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  const initialLocale: Locale =
    (SUPPORTED_LOCALES as readonly string[]).includes(localeCookie ?? '')
      ? (localeCookie as Locale)
      : DEFAULT_LOCALE;

  return (
    <I18nProvider initialLocale={initialLocale}>
      <AppShell>{children}</AppShell>
    </I18nProvider>
  );
}
