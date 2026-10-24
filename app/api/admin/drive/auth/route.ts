import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { getGoogleDriveAuthUrl } from "@/lib/google-drive";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  try {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
    const origin = forwardedHost ? `${forwardedProto}://${forwardedHost}` : request.nextUrl.origin;

    const user = await getCurrentUser();

    if (!user) {
      // Not logged in: redirect to login and then return here
      return NextResponse.redirect(
        `${origin}/login?redirectTo=${encodeURIComponent("/api/admin/drive/auth")}`
      );
    }

    if (!isAdmin(user)) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Admin Access Required</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
          <div class="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 text-center space-y-4">
            <div class="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">!</div>
            <h1 class="text-xl font-black">Admin Access Required</h1>
            <p class="text-sm text-slate-400">
              You are currently logged in as <span class="text-white font-bold">${user.email}</span>, which does not have administrator privileges.
            </p>
            <div class="pt-2">
              <a href="/login?redirectTo=${encodeURIComponent("/api/admin/drive/auth")}" class="inline-block px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg hover:opacity-90">
                Switch to Admin Account
              </a>
            </div>
          </div>
        </body>
        </html>`,
        { headers: { "Content-Type": "text/html" }, status: 403 }
      );
    }

    const stateToken = crypto.randomBytes(24).toString("hex");
    const authUrl = getGoogleDriveAuthUrl(origin, stateToken);

    const response = NextResponse.redirect(authUrl);
    response.cookies.set("gdrive_oauth_state", stateToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 15, // 15 minutes
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
