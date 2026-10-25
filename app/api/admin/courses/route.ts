import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from("courses")
      .select(`
        id, title, slug, category, price, original_price, published, difficulty, duration,
        thumbnail, instructor_name, instructor_role, description, created_at,
        course_modules(count),
        lessons(count)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const courses = (data ?? []).map((c: any) => ({
      ...c,
      price: 3999,
      original_price: 3999,
      module_count: c.course_modules?.[0]?.count ?? 0,
      lesson_count: c.lessons?.[0]?.count ?? 0,
    }));

    return NextResponse.json(courses);
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
    const { title, slug, description, category, price, original_price, difficulty, duration, thumbnail, instructor_name, instructor_role, published } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from("courses")
      .insert({
        title,
        slug,
        description: description ?? "",
        category: category ?? "Data",
        price: price ?? 0,
        original_price: original_price ?? 0,
        difficulty: difficulty ?? "Beginner",
        duration: duration ?? "",
        thumbnail: thumbnail ?? "",
        instructor_name: instructor_name ?? "",
        instructor_role: instructor_role ?? "",
        published: published ?? false,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    console.error("Course POST error:", err);
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
      return NextResponse.json({ error: "Course ID required" }, { status: 400 });
    }

    // Remove server-only fields
    delete updates.course_modules;
    delete updates.lessons;
    delete updates.module_count;
    delete updates.lesson_count;
    delete updates.created_at;

    const supabase = createClient();

    const { data, error } = await supabase
      .from("courses")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Course PATCH error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
