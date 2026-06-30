'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Home, Users, FilePen, ReceiptEuro, Settings } from 'lucide-react';
import { LanguageToggle } from '@/presentation/components/LanguageToggle';
import { SignOutButton } from '@/presentation/components/SignOutButton';

const NAV_ITEMS = [
  { href: '/',                label: 'nav.home',     Icon: Home,        colorClass: 'text-gray-700',    match: (p: string) => p === '/' },
  { href: '/clients',         label: 'nav.clients',  Icon: Users,       colorClass: 'text-clients',     match: (p: string) => p.startsWith('/clients') },
  { href: '/budgets',         label: 'nav.budgets',  Icon: FilePen,     colorClass: 'text-budgets',     match: (p: string) => p.startsWith('/budgets') },
  { href: '/invoices',        label: 'nav.invoices', Icon: ReceiptEuro, colorClass: 'text-invoices',    match: (p: string) => p.startsWith('/invoices') },
  { href: '/settings/catalog',label: 'nav.settings', Icon: Settings,    colorClass: 'text-settings',    match: (p: string) => p.startsWith('/settings') },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top nav ── */}
      <nav className="bg-white border-b px-4 py-2 flex items-center justify-between sticky top-0 z-40">
        {/* Brand */}
        <Link href="/" className="font-semibold text-gray-900 hover:text-gray-700 transition-colors shrink-0">
          {t('nav.appName')}
        </Link>

        {/* Desktop section links (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-1 mx-4">
          {NAV_ITEMS.map(({ href, label, Icon, colorClass, match }) => {
            const active = match(pathname);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm font-medium transition-colors ${
                  active
                    ? `${colorClass} bg-gray-100`
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Icon size={16} className={active ? colorClass : ''} />
                {t(label)}
              </Link>
            );
          })}
        </div>

        {/* Right controls (always visible) */}
        <div className="flex items-center gap-1 shrink-0">
          <LanguageToggle />
          <SignOutButton />
        </div>
      </nav>

      {/* ── Main content ── */}
      <main className="pb-20 md:pb-0">{children}</main>

      {/* ── Mobile bottom tab bar (hidden on md+) ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t flex md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {NAV_ITEMS.map(({ href, label, Icon, colorClass, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center justify-center py-2 gap-0.5 text-xs font-medium transition-colors ${
                active ? colorClass : 'text-slate-400 hover:text-slate-600'
              }`}
              aria-label={t(label)}
            >
              <Icon size={22} />
              <span className="sr-only">{t(label)}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
