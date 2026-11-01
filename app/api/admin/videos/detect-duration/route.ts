import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { detectVideoDuration, formatDuration } from "@/lib/video-duration";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = request.nextUrl.searchParams.get("url");
    if (!url) {
      return NextResponse.json({ duration: "", status: "empty" });
    }

    const result = await detectVideoDuration(url);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to detect duration", status: "error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { url, seconds } = body;

    if (seconds !== undefined && !isNaN(Number(seconds))) {
      const formatted = formatDuration(Number(seconds));
      return NextResponse.json({
        duration: formatted,
        durationSeconds: Math.round(Number(seconds)),
        status: "ready",
        source: "client",
      });
    }

    if (!url) {
      return NextResponse.json({ duration: "", status: "empty" });
    }

    const result = await detectVideoDuration(url);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to detect duration", status: "error" },
      { status: 500 }
    );
  }
}
