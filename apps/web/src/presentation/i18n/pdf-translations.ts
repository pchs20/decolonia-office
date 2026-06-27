import esMessages from './messages/es.json';
import caMessages from './messages/ca.json';
import enMessages from './messages/en.json';
import { type Locale, DEFAULT_LOCALE, SUPPORTED_LOCALES } from './config';

const messages = { es: esMessages, ca: caMessages, en: enMessages };

export type PdfLabels = typeof esMessages.pdf;

export function getPdfLabels(locale?: string | null): PdfLabels {
  const safeLocale: Locale = (SUPPORTED_LOCALES as readonly string[]).includes(locale ?? '')
    ? (locale as Locale)
    : DEFAULT_LOCALE;
  return messages[safeLocale].pdf;
}
