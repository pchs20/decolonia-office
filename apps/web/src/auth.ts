import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { allowedEmails } from "@/lib/allowed-emails";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "consent select_account",
          access_type: "offline",
          scope: "openid email profile https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets"
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    signIn({ user }) {
      if (!user.email) return false;
      return allowedEmails.includes(user.email);
    },
    jwt({ token, account }) {
      if (account?.provider === "google") {
        if (account.access_token) token.googleAccessToken = account.access_token;
        if (account.refresh_token) token.googleRefreshToken = account.refresh_token;
        if (account.expires_at) token.googleAccessTokenExpiresAt = account.expires_at;
        if (account.providerAccountId) token.googleSubject = account.providerAccountId;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && typeof token.googleSubject === "string") {
        session.user.id = token.googleSubject;
      }
      return session;
    }
  },
});
