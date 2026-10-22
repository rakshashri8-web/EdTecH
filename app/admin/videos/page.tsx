import { redirect } from "next/navigation";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import LessonManager from "@/components/admin/LessonManager";
import { Video } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Videos — Admin",
};

export default async function VideosPage() {
  const user = await getCurrentUser();
  if (!user || !isAdmin(user)) redirect("/dashboard");

  const supabase = createClient();

  let courses: any[] = [];
  try {
    const { data } = await supabase
      .from("courses")
      .select("id, title")
      .order("title", { ascending: true });
    courses = data ?? [];
  } catch {
    courses = [];
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 lg:mt-0 mt-[52px]">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
          <Video className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Manage Videos & Lessons</h1>
          <p className="text-sm text-slate-500">Add, edit, and organize lessons within course modules.</p>
        </div>
      </div>
      <LessonManager courses={courses} />
    </div>
  );
}
