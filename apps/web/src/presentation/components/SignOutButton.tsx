'use client';

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="p-1.5 rounded text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
      aria-label="Sign out"
    >
      <LogOut size={18} />
    </button>
  );
}
