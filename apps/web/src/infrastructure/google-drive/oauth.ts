import { google } from "googleapis";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export interface GoogleDriveOAuthCredentials {
  accessToken?: string;
  refreshToken: string;
  expiresAt?: number;
  googleSubject: string;
}

export class GoogleDriveAuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GoogleDriveAuthorizationError";
  }
}

export async function getGoogleDriveOAuthCredentials(
  request: NextRequest
): Promise<GoogleDriveOAuthCredentials> {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET
  });
  const refreshToken = typeof token?.googleRefreshToken === "string"
    ? token.googleRefreshToken
    : undefined;

  if (!refreshToken) {
    throw new GoogleDriveAuthorizationError("Google Drive access has not been granted. Authorize Drive access and try again.");
  }

  const googleSubject = typeof token?.googleSubject === "string" ? token.googleSubject : token?.sub;
  if (!googleSubject) {
    throw new GoogleDriveAuthorizationError("Google subject is missing. Authorize Drive access again.");
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
    const refreshed = await oauth.getAccessToken();
    accessToken = refreshed.token ?? undefined;
    refreshedExpiresAt = oauth.credentials.expiry_date ?? undefined;
    if (!accessToken) {
      throw new GoogleDriveAuthorizationError("Google Drive access token could not be refreshed. Authorize Drive again.");
    }
  }

  return { accessToken, refreshToken, expiresAt: refreshedExpiresAt, googleSubject };
}