"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Edit, Eye, EyeOff, BookOpen } from "lucide-react";

interface Course {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  published: boolean;
  lesson_count?: number;
  module_count?: number;
}

interface CourseManagerProps {
  initialCourses: Course[];
}

export default function CourseManager({ initialCourses }: CourseManagerProps) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [toggling, setToggling] = useState<string | null>(null);

  const handleTogglePublished = async (course: Course) => {
    setToggling(course.id);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: course.id, published: !course.published }),
      });
      if (!res.ok) throw new Error(await res.text());
      setCourses((prev) =>
        prev.map((c) => (c.id === course.id ? { ...c, published: !c.published } : c))
      );
    } catch (err) {
      console.error("Toggle publish error:", err);
      alert("Failed to update course visibility.");
    } finally {
      setToggling(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Course */}
      <div className="flex justify-end">
        <Link
          href="/admin/courses/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-md shadow-brand-blue/20"
        >
          <Plus className="w-4 h-4" /> Add Course
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Modules</th>
                <th className="px-6 py-4">Lessons</th>
                <th className="px-6 py-4">Published</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 max-w-[200px] truncate">{course.title}</p>
                      <p className="text-slate-400 text-[11px] font-mono">{course.slug}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-purple-50 text-brand-purple rounded-full text-[11px] font-black">
                        {course.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-700">
                      ₹{course.price.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{course.module_count ?? 0}</td>
                    <td className="px-6 py-4 text-slate-600">{course.lesson_count ?? 0}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublished(course)}
                        disabled={toggling === course.id}
                        title={course.published ? "Click to unpublish" : "Click to publish"}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black transition-all disabled:opacity-50 ${
                          course.published
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {course.published ? (
                          <><Eye className="w-3.5 h-3.5" /> Published</>
                        ) : (
                          <><EyeOff className="w-3.5 h-3.5" /> Draft</>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/courses/${course.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <BookOpen className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 font-bold text-sm">No courses yet.</p>
                    <Link
                      href="/admin/courses/new"
                      className="mt-3 inline-flex items-center gap-1 text-brand-blue font-bold text-xs hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" /> Create your first course
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
