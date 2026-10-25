import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courseId = request.nextUrl.searchParams.get("course_id");
    if (!courseId) {
      return NextResponse.json({ error: "course_id required" }, { status: 400 });
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from("course_modules")
      .select("*")
      .eq("course_id", courseId)
      .order("order", { ascending: true });

    if (!error && data && data.length > 0) {
      return NextResponse.json(data);
    }

    let dbCourseTitle = "";
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(courseId);
    if (isUuid) {
      try {
        const { data: dbCourse } = await supabase.from("courses").select("title, slug").eq("id", courseId).maybeSingle();
        if (dbCourse) dbCourseTitle = dbCourse.title;
      } catch {}
    }

    // Fallback to initial courses
    const { INITIAL_COURSES } = await import("@/lib/data");
    const course = INITIAL_COURSES.find((c) =>
      c.id === courseId ||
      c.slug === courseId ||
      (dbCourseTitle && c.title.toLowerCase() === dbCourseTitle.toLowerCase())
    );
    if (course && course.modules) {
      return NextResponse.json(
        course.modules.map((m) => ({
          id: m.id,
          course_id: m.course_id,
          title: m.title,
          description: m.description,
          order: m.order,
        }))
      );
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
    const { course_id, title, description, order } = body;

    if (!course_id || !title) {
      return NextResponse.json({ error: "course_id and title required" }, { status: 400 });
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from("course_modules")
      .insert({ course_id, title, description: description ?? null, order: order ?? 1 })
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
      return NextResponse.json({ error: "Module ID required" }, { status: 400 });
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from("course_modules")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
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
      return NextResponse.json({ error: "Module ID required" }, { status: 400 });
    }

    const supabase = createClient();

    const { error } = await supabase.from("course_modules").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
