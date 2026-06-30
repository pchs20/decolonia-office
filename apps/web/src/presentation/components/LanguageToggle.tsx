'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import { SUPPORTED_LOCALES, LOCALE_COOKIE, type Locale } from '@/presentation/i18n/config';

const LOCALE_LABELS: Record<Locale, string> = {
  ca: 'CA',
  es: 'ES',
  en: 'EN',
};

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const current = i18n.language as Locale;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleChange = (locale: Locale) => {
    void i18n.changeLanguage(locale);
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; SameSite=Lax`;
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-1 px-2 py-1.5 rounded text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Globe size={16} />
        <span className="hidden sm:inline">{LOCALE_LABELS[current] ?? current.toUpperCase()}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-1 w-20 bg-white border border-gray-200 rounded shadow-md z-50 py-1"
        >
          {SUPPORTED_LOCALES.map(locale => (
            <li key={locale}>
              <button
                role="option"
                aria-selected={current === locale}
                onClick={() => handleChange(locale)}
                className={`w-full text-left px-3 py-1.5 text-sm ${
                  current === locale
                    ? 'font-semibold text-gray-900 bg-gray-50'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {LOCALE_LABELS[locale]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
