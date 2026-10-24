import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isAdmin } from "@/lib/auth";

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

    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("module_id", moduleId)
      .order("order", { ascending: true });

    if (!error && data && data.length > 0) {
      return NextResponse.json(data);
    }

    // Fallback to initial courses lessons
    const { INITIAL_COURSES } = await import("@/lib/data");
    for (const c of INITIAL_COURSES) {
      const mod = c.modules?.find((m) => m.id === moduleId);
      if (mod && mod.lessons) {
        return NextResponse.json(
          mod.lessons.map((l) => ({
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
          }))
        );
      }
    }

    return NextResponse.json([]);
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
    const { module_id, course_id, title, description, video_url, duration, order, is_preview, published } = body;

    if (!module_id || !title) {
      return NextResponse.json({ error: "module_id and title required" }, { status: 400 });
    }

    const supabase = createClient();

    const { data, error } = await supabase
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

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
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

    const supabase = createClient();

    const { data: updated, error } = await supabase
      .from("lessons")
      .update(updates)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (updated) {
      return NextResponse.json(updated);
    }

    // If row didn't exist in DB yet (from INITIAL_COURSES), insert it with updates
    const { INITIAL_COURSES } = await import("@/lib/data");
    let initialLesson: any = null;
    for (const c of INITIAL_COURSES) {
      for (const m of c.modules || []) {
        const found = m.lessons?.find((l) => l.id === id);
        if (found) {
          initialLesson = found;
          break;
        }
      }
      if (initialLesson) break;
    }

    const { data: inserted, error: insErr } = await supabase
      .from("lessons")
      .upsert({
        id,
        module_id: initialLesson?.module_id,
        course_id: initialLesson?.course_id,
        title: initialLesson?.title || "Lesson",
        description: initialLesson?.description || "",
        video_url: initialLesson?.video_url || "",
        duration: initialLesson?.duration || "",
        order: initialLesson?.order || 1,
        is_preview: initialLesson?.is_preview || false,
        published: true,
        ...updates,
      })
      .select()
      .single();

    if (insErr) throw insErr;
    return NextResponse.json(inserted);
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

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
