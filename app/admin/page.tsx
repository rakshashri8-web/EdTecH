import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  Users,
  CreditCard,
  BookOpen,
  Video,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard — AIMP",
  description: "Admin portal overview and stats.",
};

async function getStats() {
  try {
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

    const { data: recentPending } = await supabase
      .from("enrollments")
      .select("*, course:courses(title)")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(5);

    return {
      totalStudents: totalStudents ?? 0,
      pendingPayments: pendingPayments ?? 0,
      totalCourses: totalCourses ?? 0,
      publishedCourses: publishedCourses ?? 0,
      totalLessons: totalLessons ?? 0,
      approvedEnrollments: approvedEnrollments ?? 0,
      rejectedEnrollments: rejectedEnrollments ?? 0,
      recentPending: recentPending ?? [],
    };
  } catch {
    return {
      totalStudents: 0,
      pendingPayments: 0,
      totalCourses: 0,
      publishedCourses: 0,
      totalLessons: 0,
      approvedEnrollments: 0,
      rejectedEnrollments: 0,
      recentPending: [],
    };
  }
}

export default async function AdminDashboard() {
  const user = await getCurrentUser();

  if (!user || !isAdmin(user)) {
    redirect("/dashboard");
  }

  const stats = await getStats();

  const statCards = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "bg-blue-50 text-brand-blue",
      textColor: "text-brand-blue",
    },
    {
      label: "Pending Approvals",
      value: stats.pendingPayments,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
      textColor: "text-amber-600",
      urgent: stats.pendingPayments > 0,
    },
    {
      label: "Total Courses",
      value: stats.totalCourses,
      icon: BookOpen,
      color: "bg-purple-50 text-brand-purple",
      textColor: "text-brand-purple",
    },
    {
      label: "Published Courses",
      value: stats.publishedCourses,
      icon: TrendingUp,
      color: "bg-emerald-50 text-emerald-600",
      textColor: "text-emerald-600",
    },
    {
      label: "Total Lessons",
      value: stats.totalLessons,
      icon: Video,
      color: "bg-indigo-50 text-indigo-600",
      textColor: "text-indigo-600",
    },
    {
      label: "Approved / Rejected",
      value: `${stats.approvedEnrollments} / ${stats.rejectedEnrollments}`,
      icon: CheckCircle2,
      color: "bg-slate-50 text-slate-600",
      textColor: "text-slate-700",
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 lg:mt-0 mt-[52px]">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-black text-slate-900">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 mt-1">
          Welcome back, <span className="font-bold text-slate-700">{user.full_name}</span>. Here&apos;s what&apos;s happening.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`bg-white rounded-3xl border border-slate-200 shadow-sm p-5 ${
                card.urgent ? "ring-2 ring-amber-400/50" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-bold">{card.label}</p>
                  <p className={`text-2xl font-black mt-1 ${card.textColor}`}>{card.value}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              {card.urgent && (
                <p className="text-[11px] text-amber-600 font-bold mt-2 animate-pulse">⚡ Needs attention</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Pending Payments */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand-blue" />
            <h2 className="text-base font-black text-slate-900">Recent Pending Approvals</h2>
          </div>
          <Link
            href="/admin/payments"
            className="flex items-center gap-1 text-xs font-bold text-brand-blue hover:underline"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {stats.recentPending.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-3">Student</th>
                  <th className="px-6 py-3">Course</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">UTR</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
                {stats.recentPending.map((enrollment: any) => (
                  <tr key={enrollment.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{enrollment.name}</p>
                      <p className="text-slate-400 text-[11px]">{enrollment.email}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">
                      {enrollment.course?.title ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-emerald-700 font-bold">
                      ₹{enrollment.amount?.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600">{enrollment.utr}</td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(enrollment.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href="/admin/payments"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold hover:bg-amber-200 transition-colors"
                      >
                        Review <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-500">No pending approvals — all caught up!</p>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Payment Approvals", href: "/admin/payments", icon: CreditCard, color: "text-brand-blue" },
          { label: "Manage Students", href: "/admin/students", icon: Users, color: "text-brand-purple" },
          { label: "Manage Courses", href: "/admin/courses", icon: BookOpen, color: "text-emerald-600" },
          { label: "Manage Videos", href: "/admin/videos", icon: Video, color: "text-indigo-600" },
        ].map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col items-center gap-2 hover:border-brand-blue/40 hover:shadow-md transition-all group"
            >
              <div className={`p-3 rounded-xl bg-slate-50 ${link.color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-slate-700 text-center">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
