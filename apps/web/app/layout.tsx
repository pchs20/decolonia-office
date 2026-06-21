import "./globals.css";
import type { Metadata } from "next";
import type { Viewport } from "next";
import type { ReactNode } from "react";

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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
