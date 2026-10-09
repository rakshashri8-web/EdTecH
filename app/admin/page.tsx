import { redirect } from "next/navigation";
import AdminTable from "@/components/AdminTable";
import { getCurrentUser } from "@/lib/auth";
import { INITIAL_COURSES } from "@/lib/data";
import { Enrollment } from "@/lib/types";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Panel — AIMP",
  description: "Manage enrollments, approve UPI payments, and configure courses.",
};

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Verify admin role (allow admin or fallback user)
  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  let enrollments: Enrollment[] = [];

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = createClient();

    const { data: dbEnrollments } = await supabase
      .from("enrollments")
      .select("*, course:courses(*)")
      .order("created_at", { ascending: false });

    if (dbEnrollments && dbEnrollments.length > 0) {
      enrollments = dbEnrollments;
    }
  } catch {
    // Fallback if DB table not yet created
  }

  // Fallback demo enrollments for admin panel testing
  if (enrollments.length === 0) {
    enrollments = [
      {
        id: "demo-enrollment-1",
        user_id: "user-101",
        course_id: INITIAL_COURSES[0].id,
        name: "Rahul Sharma",
        phone: "+91 9876543210",
        email: "rahul.sharma@example.com",
        amount: INITIAL_COURSES[0].price,
        utr: "427819203847",
        screenshot_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop",
        status: "pending",
        created_at: new Date().toISOString(),
        approved_at: null,
        course: INITIAL_COURSES[0],
      },
      {
        id: "demo-enrollment-2",
        user_id: "user-102",
        course_id: INITIAL_COURSES[3].id,
        name: "Priya Patel",
        phone: "+91 9812345678",
        email: "priya.patel@example.com",
        amount: INITIAL_COURSES[3].price,
        utr: "982371920311",
        screenshot_url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop",
        status: "approved",
        created_at: new Date().toISOString(),
        approved_at: new Date().toISOString(),
        course: INITIAL_COURSES[3],
      }
    ];
  }

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" /> Administrative Operations
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Admin Approval & Revenue Panel
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Signed in as Admin ({user.email}). Review UTR submissions and inspect payment screenshots.
            </p>
          </div>
        </div>

        {/* Admin Enrollment Table */}
        <AdminTable initialEnrollments={enrollments} />

      </div>
    </div>
  );
}
