import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { extractDriveFileId, streamGoogleDriveVideo } from "@/lib/google-drive";
import { INITIAL_COURSES } from "@/lib/data";

export async function GET(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const { lessonId } = params;
    if (!lessonId) {
      return NextResponse.json({ error: "Lesson ID is required." }, { status: 400 });
    }

    const supabase = createClient();

    // 1. Fetch lesson record from Supabase (if UUID) or fallback to initial courses
    let lesson: {
      id: string;
      course_id: string;
      title: string;
      video_url: string;
      is_preview?: boolean;
      published?: boolean;
    } | null = null;

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(lessonId);
    if (isUuid) {
      try {
        const { data: dbLesson } = await supabase
          .from("lessons")
          .select("id, course_id, title, video_url, is_preview, published")
          .eq("id", lessonId)
          .maybeSingle();

        if (dbLesson) {
          lesson = dbLesson;
        }
      } catch {}
    }

    if (!lesson) {
      // Check INITIAL_COURSES catalog
      for (const course of INITIAL_COURSES) {
        for (const mod of course.modules || []) {
          const found = (mod.lessons || []).find((l) => l.id === lessonId);
          if (found) {
            lesson = {
              id: found.id,
              course_id: course.id,
              title: found.title,
              video_url: found.video_url,
              is_preview: !!found.is_preview,
              published: true,
            };
            break;
          }
        }
        if (lesson) break;
      }
    }

    // Check if there is an updated video URL override in lesson_videos table
    try {
      const { data: override } = await supabase
        .from("lesson_videos")
        .select("video_url")
        .eq("lesson_id", lessonId)
        .maybeSingle();

      if (override?.video_url && lesson) {
        lesson.video_url = override.video_url;
      }
    } catch {}

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
    }

    // 2. Authorization check
    let authorized = false;

    if (lesson.is_preview) {
      // Preview lessons are free for all visitors to watch
      authorized = true;
    } else {
      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json(
          { error: "Authentication required to stream this paid course lesson." },
          { status: 401 }
        );
      }

      if (isAdmin(user)) {
        // Admin & Super Admin have full access
        authorized = true;
      } else {
        // Verify approved enrollment for this course
        const { data: enrollment } = await supabase
          .from("enrollments")
          .select("status")
          .eq("user_id", user.id)
          .eq("course_id", lesson.course_id)
          .maybeSingle();

        if (enrollment && enrollment.status === "approved") {
          authorized = true;
        }
      }
    }

    if (!authorized) {
      return NextResponse.json(
        { error: "Access denied. You must be enrolled with an approved payment to view this video." },
        { status: 403 }
      );
    }

    // 3. Extract Google Drive file ID
    const fileId = extractDriveFileId(lesson.video_url);

    if (!fileId) {
      return NextResponse.json(
        { error: "This lesson is not configured with a valid Google Drive video." },
        { status: 400 }
      );
    }

    // 4. Stream from Google Drive
    const rangeHeader = request.headers.get("range");
    const driveRes = await streamGoogleDriveVideo(fileId, rangeHeader);

    // Forward streaming headers
    const headers = new Headers();
    headers.set("Content-Type", driveRes.headers.get("content-type") || "video/mp4");
    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate");

    const contentRange = driveRes.headers.get("content-range");
    if (contentRange) {
      headers.set("Content-Range", contentRange);
    }

    const contentLength = driveRes.headers.get("content-length");
    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    return new NextResponse(driveRes.body, {
      status: driveRes.status,
      headers,
    });
  } catch (err: any) {
    console.error("Video stream proxy error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to stream video from Google Drive." },
      { status: 500 }
    );
  }
}
