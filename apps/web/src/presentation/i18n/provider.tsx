'use client';

import { type ReactNode, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import { DEFAULT_LOCALE, LOCALE_COOKIE, SUPPORTED_LOCALES, type Locale } from './config';
import es from './messages/es.json';
import ca from './messages/ca.json';
import en from './messages/en.json';

function getInitialLocale(): Locale {
  if (typeof document === 'undefined') return DEFAULT_LOCALE;
  const match = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${LOCALE_COOKIE}=`));
  const value = match?.split('=')[1];
  return (SUPPORTED_LOCALES as readonly string[]).includes(value ?? '')
    ? (value as Locale)
    : DEFAULT_LOCALE;
}

const i18nInstance = i18n.createInstance();

void i18nInstance.use(initReactI18next).init({
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  resources: {
    es: { translation: es },
    ca: { translation: ca },
    en: { translation: en },
  },
  interpolation: { escapeValue: false },
});

interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const locale = initialLocale ?? getInitialLocale();

  useEffect(() => {
    if (i18nInstance.language !== locale) {
      void i18nInstance.changeLanguage(locale);
    }
  }, [locale]);

  // Synchronously set on first render to avoid flash
  if (i18nInstance.language !== locale) {
    void i18nInstance.changeLanguage(locale);
  }

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
}
