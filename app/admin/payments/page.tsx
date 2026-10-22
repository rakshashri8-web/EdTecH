import { redirect } from "next/navigation";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import PaymentApprovalTable from "@/components/admin/PaymentApprovalTable";
import { CreditCard } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Payment Approvals — Admin",
};

export default async function PaymentsPage() {
  const user = await getCurrentUser();
  if (!user || !isAdmin(user)) redirect("/dashboard");

  const supabase = createClient();

  let enrollments: any[] = [];
  try {
    const { data } = await supabase
      .from("enrollments")
      .select("*, course:courses(title), approver:profiles!approved_by(full_name)")
      .order("created_at", { ascending: false });
    enrollments = data ?? [];
  } catch {
    enrollments = [];
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 lg:mt-0 mt-[52px]">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-blue-50 text-brand-blue">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Payment Approvals</h1>
          <p className="text-sm text-slate-500">Review and approve or reject student payment submissions.</p>
        </div>
      </div>
      <PaymentApprovalTable initialEnrollments={enrollments} />
    </div>
  );
}
