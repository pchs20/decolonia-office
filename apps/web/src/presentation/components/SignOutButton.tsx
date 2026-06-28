'use client';

import { signOut } from "next-auth/react";
import { useTranslation } from "react-i18next";

export function SignOutButton() {
  const { t } = useTranslation();
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-sm text-gray-600 hover:text-gray-900"
    >
      {t('nav.signOut')}
    </button>
  );
}
