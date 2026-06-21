'use client';

import { useTranslation } from 'react-i18next';
import { SUPPORTED_LOCALES, LOCALE_COOKIE, type Locale } from '@/presentation/i18n/config';

const LOCALE_LABELS: Record<Locale, string> = {
  ca: 'CA',
  es: 'ES',
  en: 'EN',
};

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const current = i18n.language as Locale;

  const handleChange = (locale: Locale) => {
    void i18n.changeLanguage(locale);
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; SameSite=Lax`;
  };

  return (
    <div className="flex items-center gap-1">
      {SUPPORTED_LOCALES.map(locale => (
        <button
          key={locale}
          onClick={() => handleChange(locale)}
          className={`px-2 py-1 text-sm rounded font-medium ${
            current === locale
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          aria-pressed={current === locale}
        >
          {LOCALE_LABELS[locale]}
        </button>
      ))}
    </div>
  );
}
