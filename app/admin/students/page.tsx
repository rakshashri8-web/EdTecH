import { redirect } from "next/navigation";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import StudentTable from "@/components/admin/StudentTable";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Students — Admin",
};

export default async function StudentsPage() {
  const user = await getCurrentUser();
  if (!user || !isAdmin(user)) redirect("/dashboard");

  const supabase = createClient();

  let students: any[] = [];
  try {
    const { data } = await supabase
      .from("profiles")
      .select("*, enrollments(id, course_id, status, created_at, course:courses(title))")
      .eq("role", "student")
      .order("created_at", { ascending: false });
    students = data ?? [];
  } catch {
    students = [];
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 lg:mt-0 mt-[52px]">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-purple-50 text-brand-purple">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Manage Students</h1>
          <p className="text-sm text-slate-500">
            {students.length} registered student{students.length !== 1 ? "s" : ""}.
          </p>
        </div>
      </div>
      <StudentTable students={students} />
    </div>
  );
}
