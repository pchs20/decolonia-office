import "./globals.css";
import type { Metadata } from "next";
import type { Viewport } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, SUPPORTED_LOCALES, type Locale } from "@/presentation/i18n/config";

export const metadata: Metadata = {
  title: "Decolonia Office",
  description: "Manage client information, budgets, invoices, and work documents.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb"
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale: Locale =
    (SUPPORTED_LOCALES as readonly string[]).includes(localeCookie ?? "")
      ? (localeCookie as Locale)
      : DEFAULT_LOCALE;

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
