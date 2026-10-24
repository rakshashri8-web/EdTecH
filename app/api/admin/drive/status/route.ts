import { NextResponse } from "next/server";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { getStoredRefreshToken, getGoogleDriveAccessToken } from "@/lib/google-drive";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) {
      return NextResponse.json({
        connected: false,
        message: "Google Drive is not linked yet. Click 'Connect Google Drive' to authorize course video streaming.",
      });
    }

    // Test token retrieval
    try {
      await getGoogleDriveAccessToken();
      return NextResponse.json({
        connected: true,
        message: "Google Drive is actively connected and ready for streaming.",
      });
    } catch (tokenErr: any) {
      return NextResponse.json({
        connected: false,
        error: tokenErr.message || "Failed to validate Google Drive credentials.",
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
