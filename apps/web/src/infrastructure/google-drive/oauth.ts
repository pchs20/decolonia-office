import { google } from "googleapis";
import { NextRequest } from "next/server";
import { readSessionToken } from "@/lib/session-token";

export interface GoogleDriveOAuthCredentials {
  accessToken?: string;
  refreshToken: string;
  expiresAt?: number;
  googleSubject: string;
}

export class GoogleDriveAuthorizationError extends Error {
  constructor(
    message: string,
    public readonly reason: "missing_refresh_token" | "missing_subject" | "refresh_failed"
  ) {
    super(message);
    this.name = "GoogleDriveAuthorizationError";
  }
}

export async function getGoogleDriveOAuthCredentials(
  request: NextRequest
): Promise<GoogleDriveOAuthCredentials> {
  const token = await readSessionToken(request);
  const refreshToken = typeof token?.googleRefreshToken === "string"
    ? token.googleRefreshToken
    : undefined;

  if (!refreshToken) {
    throw new GoogleDriveAuthorizationError("Google Drive access has not been granted. Authorize Drive access and try again.", "missing_refresh_token");
  }

  const googleSubject = typeof token?.googleSubject === "string" ? token.googleSubject : token?.sub;
  if (!googleSubject) {
    throw new GoogleDriveAuthorizationError("Google subject is missing. Authorize Drive access again.", "missing_subject");
  }

  const expiresAt = typeof token?.googleAccessTokenExpiresAt === "number"
    ? token.googleAccessTokenExpiresAt * 1000
    : undefined;
  let accessToken = typeof token?.googleAccessToken === "string" ? token.googleAccessToken : undefined;
  let refreshedExpiresAt = expiresAt;

  if (!accessToken || !expiresAt || expiresAt <= Date.now() + 60_000) {
    const oauth = new google.auth.OAuth2(
      process.env.AUTH_GOOGLE_ID,
      process.env.AUTH_GOOGLE_SECRET
    );
    oauth.setCredentials({ access_token: accessToken, refresh_token: refreshToken });
    let refreshed: { token?: string | null };
    try {
      refreshed = await oauth.getAccessToken();
    } catch {
      throw new GoogleDriveAuthorizationError("Google Drive authorization must be granted again.", "refresh_failed");
    }
    accessToken = refreshed.token ?? undefined;
    refreshedExpiresAt = oauth.credentials.expiry_date ?? undefined;
    if (!accessToken) {
      throw new GoogleDriveAuthorizationError("Google Drive access token could not be refreshed. Authorize Drive again.", "refresh_failed");
    }
  }

  return { accessToken, refreshToken, expiresAt: refreshedExpiresAt, googleSubject };
}