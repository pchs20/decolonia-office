export interface GoogleDriveConfig {
  accessToken?: string;
  refreshToken: string;
  expiresAt?: number;
  sharedFolderId: string;
}

export type GoogleDriveOAuthConfig = Omit<GoogleDriveConfig, "sharedFolderId">;

export function getGoogleDriveConfig(credentials: GoogleDriveOAuthConfig): GoogleDriveConfig {
  const sharedFolderId = process.env.GOOGLE_DRIVE_SHARED_FOLDER_ID?.trim();
  if (!credentials.refreshToken) {
    throw new Error("Google Drive refresh token is missing. Sign in again to authorize Drive access.");
  }
  if (!sharedFolderId) {
    throw new Error("GOOGLE_DRIVE_SHARED_FOLDER_ID is not configured.");
  }

  return { ...credentials, sharedFolderId };
}
