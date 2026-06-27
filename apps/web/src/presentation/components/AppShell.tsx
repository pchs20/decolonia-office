'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from '@/presentation/components/LanguageToggle';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
            {t('nav.appName')}
          </Link>
          <Link
            href="/clients"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            {t('nav.clients')}
          </Link>
          <Link
            href="/workers"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            {t('nav.workers')}
          </Link>
          <Link
            href="/budgets"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            {t('nav.budgets')}
          </Link>
          <Link
            href="/invoices"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            {t('nav.invoices')}
          </Link>
          <Link
            href="/settings/catalog"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            {t('nav.settings')}
          </Link>
        </div>
        <LanguageToggle />
      </nav>
      <main>{children}</main>
    </div>
  );
}
