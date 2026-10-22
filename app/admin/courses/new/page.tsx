import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import CourseForm from "@/components/admin/CourseForm";
import { ArrowLeft, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "New Course — Admin",
};

export default async function NewCoursePage() {
  const user = await getCurrentUser();
  if (!user || !isAdmin(user)) redirect("/dashboard");

  return (
    <div className="p-6 lg:p-8 space-y-6 lg:mt-0 mt-[52px]">
      <div className="flex items-center gap-3">
        <Link href="/admin/courses" className="p-2 text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Create New Course</h1>
          <p className="text-sm text-slate-500">Fill in the details below to create a course.</p>
        </div>
      </div>
      <CourseForm />
    </div>
  );
}
