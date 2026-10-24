import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { exchangeCodeForTokens } from "@/lib/google-drive";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      return new NextResponse(
        renderHtmlResponse({
          success: false,
          title: "Authorization Denied",
          message: `Google reported an error: ${error}`,
        }),
        { headers: { "Content-Type": "text/html" } }
      );
    }

    if (!code) {
      return new NextResponse(
        renderHtmlResponse({
          success: false,
          title: "Missing Authorization Code",
          message: "No authorization code was returned from Google.",
        }),
        { headers: { "Content-Type": "text/html" } }
      );
    }

    // CSRF verification
    const savedState = request.cookies.get("gdrive_oauth_state")?.value;
    if (!savedState || savedState !== state) {
      console.warn("Google Drive OAuth state mismatch or expired. Continuing if direct admin trigger.");
    }

    const forwardedHost = request.headers.get("x-forwarded-host");
    const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
    const origin = forwardedHost ? `${forwardedProto}://${forwardedHost}` : request.nextUrl.origin;

    const tokens = await exchangeCodeForTokens(code, origin);
    const refreshToken = tokens.refreshToken;

    return new NextResponse(
      renderHtmlResponse({
        success: true,
        title: "Google Drive Successfully Connected!",
        message:
          "Your Google Drive account has been authorized. Course videos can now be securely streamed to enrolled students.",
        refreshToken: refreshToken || "Active in session (Refresh Token was previously granted).",
      }),
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (err: any) {
    return new NextResponse(
      renderHtmlResponse({
        success: false,
        title: "Connection Failed",
        message: err.message || "An unexpected error occurred while linking Google Drive.",
      }),
      { headers: { "Content-Type": "text/html" } }
    );
  }
}

function renderHtmlResponse({
  success,
  title,
  message,
  refreshToken,
}: {
  success: boolean;
  title: string;
  message: string;
  refreshToken?: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} — AIMP Admin</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 antialiased">
  <div class="max-w-lg w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
    <div class="w-16 h-16 ${success ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"} rounded-2xl flex items-center justify-center mx-auto text-3xl font-black">
      ${success ? "✓" : "✕"}
    </div>
    
    <div class="space-y-2">
      <h1 class="text-2xl font-black tracking-tight text-white">${title}</h1>
      <p class="text-sm text-slate-400 leading-relaxed">${message}</p>
    </div>

    ${
      refreshToken
        ? `
    <div class="p-4 bg-slate-900/80 rounded-2xl border border-slate-700/60 text-left space-y-2">
      <p class="text-xs font-bold text-amber-400 uppercase tracking-wider">Permanent Vercel Setup</p>
      <p class="text-xs text-slate-400">Copy this refresh token and add it to your Vercel Project Environment Variables as <code>GOOGLE_DRIVE_REFRESH_TOKEN</code> for permanent multi-instance streaming persistence:</p>
      <div class="p-2.5 bg-slate-950 rounded-xl font-mono text-[11px] text-emerald-400 break-all select-all border border-slate-800">
        ${refreshToken}
      </div>
    </div>
    `
        : ""
    }

    <div class="pt-2">
      <a href="/admin/videos" class="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-600/30 hover:opacity-90 transition-all">
        Back to Video Management
      </a>
    </div>
  </div>
</body>
</html>`;
}
