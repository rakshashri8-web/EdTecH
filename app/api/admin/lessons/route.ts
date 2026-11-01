import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { detectVideoDuration } from "@/lib/video-duration";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const moduleId = request.nextUrl.searchParams.get("module_id");
    if (!moduleId) {
      return NextResponse.json({ error: "module_id required" }, { status: 400 });
    }

    const supabase = createClient();

    const isUuidModule = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(moduleId);
    let lessonsList: any[] = [];

    if (isUuidModule) {
      try {
        const { data } = await supabase
          .from("lessons")
          .select("*")
          .eq("module_id", moduleId)
          .order("order", { ascending: true });
        if (data && data.length > 0) {
          lessonsList = data;
        }
      } catch {}
    }

    if (lessonsList.length === 0) {
      // Fallback to initial courses lessons
      const { INITIAL_COURSES } = await import("@/lib/data");
      for (const c of INITIAL_COURSES) {
        const mod = c.modules?.find((m) => m.id === moduleId);
        if (mod && mod.lessons) {
          lessonsList = mod.lessons.map((l) => ({
            id: l.id,
            module_id: l.module_id,
            course_id: l.course_id,
            title: l.title,
            description: l.description,
            video_url: l.video_url,
            duration: l.duration,
            order: l.order,
            is_preview: l.is_preview,
            published: true,
          }));
          break;
        }
      }
    }

    // Merge video and duration overrides from lesson_videos table
    let overrides: any[] = [];
    try {
      const { data, error } = await supabase
        .from("lesson_videos")
        .select("lesson_id, video_url, duration");
      if (!error && data) {
        overrides = data;
      } else {
        const { data: fallbackData } = await supabase
          .from("lesson_videos")
          .select("lesson_id, video_url");
        overrides = fallbackData || [];
      }
    } catch {}

    const overridesMap = new Map<string, { video_url?: string; duration?: string }>();
    if (overrides && overrides.length > 0) {
      for (const o of overrides) {
        if (o.lesson_id && !o.lesson_id.startsWith("SYSTEM_")) {
          overridesMap.set(o.lesson_id, {
            video_url: o.video_url,
            duration: o.duration,
          });
        }
      }
    }

    // Sanitize and map lessons:
    // 1. If an override exists in lesson_videos, use it.
    // 2. Prevent automatic Rickroll placeholder URLs (dQw4w9WgXcQ).
    // 3. If video_url is empty, do not show hardcoded fake durations.
    lessonsList = lessonsList.map((l) => {
      const override = overridesMap.get(l.id);
      let videoUrl = (override?.video_url ?? l.video_url ?? "").trim();
      let duration = (override?.duration ?? l.duration ?? "").trim();

      // Filter out dummy rickroll placeholder
      if (videoUrl.includes("dQw4w9WgXcQ")) {
        videoUrl = "";
        duration = "";
      }

      // If no video is present, ensure duration is cleared so fake duration is not shown
      if (!videoUrl) {
        duration = "";
      }

      return {
        ...l,
        video_url: videoUrl,
        duration: duration,
      };
    });

    return NextResponse.json(lessonsList);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    let { module_id, course_id, title, description, video_url, duration, order, is_preview, published } = body;

    if (!module_id || !title) {
      return NextResponse.json({ error: "module_id and title required" }, { status: 400 });
    }

    video_url = (video_url || "").trim();
    if (video_url && (!duration || duration === "Processing video...")) {
      const detected = await detectVideoDuration(video_url);
      if (detected.duration) {
        duration = detected.duration;
      }
    } else if (!video_url) {
      duration = "";
    }

    const supabase = createClient();

    const isUuidModule = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(module_id);
    let insertedLesson: any = null;

    if (isUuidModule) {
      try {
        const { data } = await supabase
          .from("lessons")
          .insert({
            module_id,
            course_id: course_id ?? null,
            title,
            description: description ?? null,
            video_url: video_url ?? "",
            duration: duration ?? "",
            order: order ?? 1,
            is_preview: is_preview ?? false,
            published: published ?? true,
          })
          .select()
          .single();
        if (data) insertedLesson = data;
      } catch (e) {
        console.warn("DB insert failed, attempting lesson_videos fallback:", e);
      }
    }

    if (!insertedLesson) {
      const customId = `${module_id}-les-${Date.now()}`;
      if (video_url) {
        const lvPayload: any = {
          lesson_id: customId,
          video_url,
          duration: duration ?? "",
          updated_at: new Date().toISOString(),
        };
        const { error: lvErr } = await supabase.from("lesson_videos").upsert(lvPayload, { onConflict: "lesson_id" });
        if (lvErr && lvErr.code === "42703") {
          delete lvPayload.duration;
          await supabase.from("lesson_videos").upsert(lvPayload, { onConflict: "lesson_id" });
        }
      }
      insertedLesson = {
        id: customId,
        module_id,
        course_id: course_id ?? null,
        title,
        description: description ?? null,
        video_url: video_url ?? "",
        duration: duration ?? "",
        order: order ?? 1,
        is_preview: is_preview ?? false,
        published: published ?? true,
      };
    }

    return NextResponse.json(insertedLesson, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Lesson ID required" }, { status: 400 });
    }

    // Video URL & Duration handling
    if (updates.video_url !== undefined) {
      updates.video_url = (updates.video_url || "").trim();

      if (!updates.video_url) {
        // Video explicitly removed
        updates.video_url = "";
        updates.duration = "";
      } else if (!updates.duration || updates.duration === "Processing video...") {
        // Auto-detect duration when a video is linked or replaced
        const detected = await detectVideoDuration(updates.video_url);
        if (detected.duration) {
          updates.duration = detected.duration;
        }
      }
    }

    const supabase = createClient();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

    // 1. If this is a valid UUID, try updating the lessons table
    if (isUuid) {
      try {
        const { data: updated, error } = await supabase
          .from("lessons")
          .update(updates)
          .eq("id", id)
          .select()
          .maybeSingle();

        if (updated) {
          return NextResponse.json(updated);
        }
      } catch (e) {
        console.warn("DB update failed, attempting lesson_videos override fallback:", e);
      }
    }

    // 2. Save video URL and duration override to lesson_videos table
    if (updates.video_url !== undefined || updates.duration !== undefined) {
      const lvPayload: any = {
        lesson_id: id,
        video_url: updates.video_url ?? "",
        duration: updates.duration ?? "",
        updated_at: new Date().toISOString(),
      };

      const { error: lvErr } = await supabase
        .from("lesson_videos")
        .upsert(lvPayload, { onConflict: "lesson_id" });

      if (lvErr && lvErr.code === "42703") {
        // Column duration does not exist yet in lesson_videos table, fallback without duration column
        delete lvPayload.duration;
        await supabase
          .from("lesson_videos")
          .upsert(lvPayload, { onConflict: "lesson_id" });
      }
    }

    return NextResponse.json({
      id,
      ...updates,
      success: true,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Lesson ID required" }, { status: 400 });
    }

    const supabase = createClient();

    const { error } = await supabase.from("lessons").delete().eq("id", id);
    // Also remove from lesson_videos table if present
    await supabase.from("lesson_videos").delete().eq("lesson_id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
