export const SUPPORTED_LOCALES = ['ca', 'es', 'en'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

// Change this single constant to update the default locale
export const DEFAULT_LOCALE: Locale = 'es';

export const LOCALE_COOKIE = 'locale';
