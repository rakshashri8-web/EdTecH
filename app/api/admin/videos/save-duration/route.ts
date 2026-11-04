import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { detectVideoDuration } from "@/lib/video-duration";

/**
 * POST /api/admin/videos/save-duration
 *
 * Detects video duration from Google Drive or YouTube, then saves
 * the result (duration + status) permanently to the lesson_videos table.
 *
 * Body: { lesson_id: string, video_url: string }
 *
 * Returns: { duration, durationSeconds, status, source, lesson_id }
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { lesson_id, video_url } = body;

    if (!lesson_id || !video_url) {
      return NextResponse.json(
        { error: "lesson_id and video_url are required" },
        { status: 400 }
      );
    }

    // Detect duration via Google Drive API or YouTube
    const result = await detectVideoDuration(video_url.trim());

    const supabase = createClient();

    if (result.status === "ready" && result.duration) {
      // Duration successfully detected — persist permanently
      const payload: any = {
        lesson_id,
        video_url: video_url.trim(),
        duration: result.duration,
        video_processing_status: "completed",
        video_processed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error: upsertErr } = await supabase
        .from("lesson_videos")
        .upsert(payload, { onConflict: "lesson_id" });

      if (upsertErr) {
        // If new columns don't exist yet (migration pending), save only the basics
        const fallback: any = {
          lesson_id,
          video_url: video_url.trim(),
          duration: result.duration,
          updated_at: new Date().toISOString(),
        };
        await supabase
          .from("lesson_videos")
          .upsert(fallback, { onConflict: "lesson_id" });
      }

      // Also update the lessons table if the lesson_id looks like a UUID
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(lesson_id);
      if (isUuid) {
        await supabase
          .from("lessons")
          .update({ duration: result.duration })
          .eq("id", lesson_id);
      }

      return NextResponse.json({ ...result, lesson_id });
    } else if (result.status === "processing") {
      // Drive hasn't processed the video metadata yet — mark as processing (don't save "Processing video..." as duration)
      const payload: any = {
        lesson_id,
        video_url: video_url.trim(),
        duration: null,
        video_processing_status: "processing",
        updated_at: new Date().toISOString(),
      };

      const { error: upsertErr } = await supabase
        .from("lesson_videos")
        .upsert(payload, { onConflict: "lesson_id" });

      if (upsertErr) {
        const fallback: any = {
          lesson_id,
          video_url: video_url.trim(),
          duration: "",
          updated_at: new Date().toISOString(),
        };
        await supabase
          .from("lesson_videos")
          .upsert(fallback, { onConflict: "lesson_id" });
      }

      return NextResponse.json({ ...result, duration: "", lesson_id });
    } else {
      // Error or empty — mark as unavailable
      const payload: any = {
        lesson_id,
        video_url: video_url.trim(),
        duration: null,
        video_processing_status: "unavailable",
        updated_at: new Date().toISOString(),
      };

      const { error: upsertErr } = await supabase
        .from("lesson_videos")
        .upsert(payload, { onConflict: "lesson_id" });

      if (upsertErr) {
        await supabase
          .from("lesson_videos")
          .upsert({ lesson_id, video_url: video_url.trim(), duration: "", updated_at: new Date().toISOString() }, { onConflict: "lesson_id" });
      }

      return NextResponse.json({ ...result, duration: "", lesson_id });
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to detect and save duration" },
      { status: 500 }
    );
  }
}
