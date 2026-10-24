/**
 * Google Drive Video Storage Integration
 * Secure server-side service for managing course video storage and streaming from Google Drive.
 */

let cachedAccessToken: { token: string; expiresAt: number } | null = null;
let runtimeRefreshToken: string | null = null;

export function setRuntimeRefreshToken(token: string) {
  runtimeRefreshToken = token;
}

export function getStoredRefreshToken(): string | null {
  return process.env.GOOGLE_DRIVE_REFRESH_TOKEN || runtimeRefreshToken || null;
}

export async function getGoogleDriveRefreshTokenAsync(): Promise<string | null> {
  if (process.env.GOOGLE_DRIVE_REFRESH_TOKEN) return process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
  if (runtimeRefreshToken) return runtimeRefreshToken;

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = createClient();
    const { data } = await supabase
      .from("lesson_videos")
      .select("video_url")
      .eq("lesson_id", "SYSTEM_GOOGLE_DRIVE_REFRESH_TOKEN")
      .maybeSingle();

    if (data?.video_url) {
      runtimeRefreshToken = data.video_url;
      return data.video_url;
    }
  } catch {}

  return null;
}

/**
 * Extracts a Google Drive file ID from various formats:
 * - Bare file ID: e.g. "1a2b3c4d5e6f7g8h9i0j_kLmNoP"
 * - gdrive://FILE_ID
 * - https://drive.google.com/file/d/FILE_ID/view...
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 */
export function extractDriveFileId(input?: string | null): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // 1. gdrive:// prefix
  if (trimmed.startsWith("gdrive://")) {
    return trimmed.replace("gdrive://", "").trim();
  }

  // 2. /file/d/FILE_ID/ pattern
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]{25,})/);
  if (fileDMatch) return fileDMatch[1];

  // 3. ?id=FILE_ID pattern
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{25,})/);
  if (idParamMatch) return idParamMatch[1];

  // 4. Direct bare file ID (typically 28 to 44 characters)
  if (/^[a-zA-Z0-9_-]{25,50}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

export function isGoogleDriveUrl(url?: string | null): boolean {
  if (!url) return false;
  return (
    url.startsWith("gdrive://") ||
    url.includes("drive.google.com") ||
    /^[a-zA-Z0-9_-]{25,50}$/.test(url.trim())
  );
}

export function getRedirectUri(origin?: string): string {
  if (process.env.GOOGLE_DRIVE_REDIRECT_URI) {
    if (origin && (origin.includes("localhost") || origin.includes("127.0.0.1"))) {
      return `${origin}/api/admin/drive/callback`;
    }
    return process.env.GOOGLE_DRIVE_REDIRECT_URI;
  }
  if (origin && (origin.includes("localhost") || origin.includes("127.0.0.1"))) {
    return `${origin}/api/admin/drive/callback`;
  }
  return "https://edtech-eight-chi.vercel.app/api/admin/drive/callback";
}

/**
 * Generate Google Drive OAuth Authorization URL for one-time Drive linking.
 * Scopes: readonly access to Google Drive files or drive.file
 */
export function getGoogleDriveAuthUrl(origin?: string, stateToken?: string): string {
  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
  if (!clientId) {
    throw new Error("GOOGLE_DRIVE_CLIENT_ID is not configured in environment variables.");
  }

  const redirectUri = getRedirectUri(origin);
  const scope = encodeURIComponent(
    "https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file"
  );
  const state = stateToken ? encodeURIComponent(stateToken) : "";

  return (
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${encodeURIComponent(clientId)}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=${scope}&` +
    `access_type=offline&` +
    `prompt=consent` +
    (state ? `&state=${state}` : "")
  );
}

/**
 * Exchange authorization code for initial access and refresh tokens.
 */
export async function exchangeCodeForTokens(code: string, origin?: string) {
  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
  const redirectUri = getRedirectUri(origin);

  if (!clientId || !clientSecret) {
    throw new Error("Google Drive OAuth client ID and client secret must be set.");
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error_description || data.error || "Failed to exchange authorization code");
  }

  if (data.refresh_token) {
    setRuntimeRefreshToken(data.refresh_token);
  }

  return {
    accessToken: data.access_token as string,
    refreshToken: (data.refresh_token as string) || null,
    expiresIn: (data.expires_in as number) || 3600,
  };
}

/**
 * Get an active access token, refreshing automatically if expired.
 */
export async function getGoogleDriveAccessToken(): Promise<string> {
  // Return cached token if still valid (with 60-second safety window)
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now() + 60000) {
    return cachedAccessToken.token;
  }

  const refreshToken = await getGoogleDriveRefreshTokenAsync();
  if (!refreshToken) {
    throw new Error(
      "Google Drive is not linked yet. Please visit the Admin Portal and click 'Connect Google Drive' to complete one-time authorization."
    );
  }

  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Google Drive OAuth client ID and secret must be configured in environment variables.");
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error_description || data.error || "Failed to refresh Google Drive access token");
  }

  cachedAccessToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
  };

  return data.access_token;
}

/**
 * Fetch video stream from Google Drive with HTTP Range support for scrubbing & seeking.
 */
export async function streamGoogleDriveVideo(
  fileId: string,
  rangeHeader?: string | null
): Promise<Response> {
  const accessToken = await getGoogleDriveAccessToken();

  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
  };

  if (rangeHeader) {
    headers["Range"] = rangeHeader;
  }

  const driveUrl = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`;

  const driveRes = await fetch(driveUrl, {
    method: "GET",
    headers,
  });

  if (!driveRes.ok && driveRes.status !== 206) {
    const errorText = await driveRes.text();
    let parsedMessage = errorText;
    try {
      const parsed = JSON.parse(errorText);
      parsedMessage = parsed.error?.message || errorText;
    } catch {
      // Use raw text
    }

    if (driveRes.status === 404) {
      throw new Error(`Google Drive video file was not found (File ID: ${fileId}). Please check file permissions or ID.`);
    }
    if (driveRes.status === 403) {
      throw new Error(`Google Drive API access denied: ${parsedMessage}`);
    }
    throw new Error(`Google Drive stream error (${driveRes.status}): ${parsedMessage}`);
  }

  return driveRes;
}
