"use client";

import { useState } from "react";
import { Search, ChevronDown, ChevronUp, Users } from "lucide-react";

interface Enrollment {
  id: string;
  course_id: string;
  status: string;
  created_at: string;
  course?: { title: string } | null;
}

interface Student {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  role: string;
  created_at: string;
  enrollments?: Enrollment[];
}

interface StudentTableProps {
  students: Student[];
}

export default function StudentTable({ students }: StudentTableProps) {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      !q ||
      (s.full_name ?? "").toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      (s.phone ?? "").includes(q)
    );
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Enrollments</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
              {filtered.length > 0 ? (
                filtered.map((student) => (
                  <>
                    <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{student.full_name ?? "—"}</p>
                        <p className="text-slate-400 text-[11px]">{student.email}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{student.phone ?? "—"}</td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(student.created_at).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-blue-50 text-brand-blue rounded-full text-xs font-black">
                          {student.enrollments?.length ?? 0} courses
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => toggleExpand(student.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors"
                        >
                          {expandedId === student.id ? (
                            <><ChevronUp className="w-3.5 h-3.5" /> Hide</>
                          ) : (
                            <><ChevronDown className="w-3.5 h-3.5" /> View</>
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedId === student.id && (
                      <tr key={`${student.id}-expanded`}>
                        <td colSpan={5} className="px-8 pb-5 bg-slate-50/50">
                          <div className="mt-3 border border-slate-200 rounded-2xl overflow-hidden">
                            {student.enrollments && student.enrollments.length > 0 ? (
                              <table className="w-full text-xs">
                                <thead className="bg-slate-100 text-slate-500">
                                  <tr>
                                    <th className="px-4 py-2 text-left font-black">Course</th>
                                    <th className="px-4 py-2 text-left font-black">Status</th>
                                    <th className="px-4 py-2 text-left font-black">Enrolled On</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                  {student.enrollments.map((enr) => (
                                    <tr key={enr.id}>
                                      <td className="px-4 py-2.5 font-bold text-slate-800">
                                        {enr.course?.title ?? enr.course_id}
                                      </td>
                                      <td className="px-4 py-2.5">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black capitalize ${
                                          enr.status === "approved"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : enr.status === "rejected"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-amber-100 text-amber-700"
                                        }`}>
                                          {enr.status}
                                        </span>
                                      </td>
                                      <td className="px-4 py-2.5 text-slate-400">
                                        {new Date(enr.created_at).toLocaleDateString("en-IN")}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <p className="text-center py-6 text-slate-400 font-bold">No enrollments yet.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400 font-bold">
                    No students found.
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
