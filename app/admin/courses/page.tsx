import { redirect } from "next/navigation";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import CourseManager from "@/components/admin/CourseManager";
import { BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Courses — Admin",
};

export default async function CoursesPage() {
  const user = await getCurrentUser();
  if (!user || !isAdmin(user)) redirect("/dashboard");

  const supabase = createClient();

  let courses: any[] = [];
  try {
    const { data } = await supabase
      .from("courses")
      .select(`
        id, title, slug, category, price, published,
        course_modules(count),
        lessons(count)
      `)
      .order("created_at", { ascending: false });

    courses = (data ?? []).map((c: any) => ({
      ...c,
      module_count: c.course_modules?.[0]?.count ?? 0,
      lesson_count: c.lessons?.[0]?.count ?? 0,
    }));
  } catch {
    courses = [];
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 lg:mt-0 mt-[52px]">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Manage Courses</h1>
          <p className="text-sm text-slate-500">Create, edit, and publish courses.</p>
        </div>
      </div>
      <CourseManager initialCourses={courses} />
    </div>
  );
}
