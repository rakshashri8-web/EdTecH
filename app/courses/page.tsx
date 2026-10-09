import CourseGrid from "@/components/CourseGrid";
import { INITIAL_COURSES } from "@/lib/data";
import { BookOpen } from "lucide-react";

export const metadata = {
  title: "All Courses — AIMP",
  description: "Browse industry-focused courses in Data Analytics, Data Science, AI/ML, GenAI, and Agentic AI.",
};

export default async function CoursesPage() {
  let courses = INITIAL_COURSES;
  
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = createClient();
    const { data } = await supabase.from("courses").select("*").eq("published", true);
    if (data && data.length > 0) {
      courses = data;
    }
  } catch {
    courses = INITIAL_COURSES;
  }

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Title Header */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-brand-blue text-xs font-black uppercase tracking-wider">
            <BookOpen className="w-4 h-4" /> Course Catalog
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Explore All Programs
          </h1>
          <p className="text-sm text-slate-600">
            Choose your learning pathway. Prices are fetched dynamically from Supabase.
          </p>
        </div>

        {/* Course Grid Component */}
        <CourseGrid courses={courses} />

      </div>
    </div>
  );
}
