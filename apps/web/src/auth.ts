import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { allowedEmails } from "@/lib/allowed-emails";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google({ authorization: { params: { prompt: "select_account" } } })],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    signIn({ user }) {
      if (!user.email) return false;
      return allowedEmails.includes(user.email);
    },
  },
});
