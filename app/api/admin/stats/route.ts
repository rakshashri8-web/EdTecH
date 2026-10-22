import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient();

    const [
      { count: totalStudents },
      { count: pendingPayments },
      { count: totalCourses },
      { count: publishedCourses },
      { count: totalLessons },
      { count: approvedEnrollments },
      { count: rejectedEnrollments },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
      supabase.from("enrollments").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("courses").select("*", { count: "exact", head: true }),
      supabase.from("courses").select("*", { count: "exact", head: true }).eq("published", true),
      supabase.from("lessons").select("*", { count: "exact", head: true }),
      supabase.from("enrollments").select("*", { count: "exact", head: true }).eq("status", "approved"),
      supabase.from("enrollments").select("*", { count: "exact", head: true }).eq("status", "rejected"),
    ]);

    return NextResponse.json({
      totalStudents: totalStudents ?? 0,
      pendingPayments: pendingPayments ?? 0,
      totalCourses: totalCourses ?? 0,
      publishedCourses: publishedCourses ?? 0,
      totalLessons: totalLessons ?? 0,
      approvedEnrollments: approvedEnrollments ?? 0,
      rejectedEnrollments: rejectedEnrollments ?? 0,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
