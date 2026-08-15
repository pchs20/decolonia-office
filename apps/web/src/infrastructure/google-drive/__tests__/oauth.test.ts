import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { google } from "googleapis";
import {
  GoogleDriveAuthorizationError,
  getGoogleDriveOAuthCredentials
} from "@/infrastructure/google-drive/oauth";
import { getGoogleDriveConfig } from "@/infrastructure/google-drive/config";

jest.mock("next-auth/jwt", () => ({ getToken: jest.fn() }));
jest.mock("googleapis", () => ({
  google: {
    auth: { OAuth2: jest.fn() }
  }
}));

const mockedGetToken = getToken as jest.MockedFunction<typeof getToken>;
const mockedOAuth2 = google.auth.OAuth2 as unknown as jest.Mock;

describe("Google Drive OAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GOOGLE_DRIVE_SHARED_FOLDER_ID = "shared-folder";
  });

  it("requires a shared folder ID in server configuration", () => {
    expect(getGoogleDriveConfig({ refreshToken: "refresh" }).sharedFolderId).toBe("shared-folder");
  });

  it("refreshes an expired access token without exposing provider credentials", async () => {
    mockedGetToken.mockResolvedValue({
      googleAccessToken: "expired",
      googleRefreshToken: "refresh",
      googleAccessTokenExpiresAt: Math.floor(Date.now() / 1000) - 60,
      googleSubject: "google-subject"
    } as never);
    const oauth = {
      credentials: { expiry_date: Date.now() + 3_600_000 },
      setCredentials: jest.fn(),
      getAccessToken: jest.fn().mockResolvedValue({ token: "fresh" })
    };
    mockedOAuth2.mockImplementation(() => oauth);

    const credentials = await getGoogleDriveOAuthCredentials(
      new NextRequest("http://localhost/api/backup/cloud")
    );

    expect(credentials.accessToken).toBe("fresh");
    expect(credentials.refreshToken).toBe("refresh");
    expect(credentials.googleSubject).toBe("google-subject");
    expect(oauth.setCredentials).toHaveBeenCalledWith({
      access_token: "expired",
      refresh_token: "refresh"
    });
  });

  it("rejects missing Drive authorization", async () => {
    mockedGetToken.mockResolvedValue({} as never);

    await expect(
      getGoogleDriveOAuthCredentials(new NextRequest("http://localhost/api/backup/cloud"))
    ).rejects.toBeInstanceOf(GoogleDriveAuthorizationError);
  });
});
