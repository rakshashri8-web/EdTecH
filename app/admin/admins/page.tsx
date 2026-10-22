import { redirect } from "next/navigation";
import { getCurrentUser, isSuperAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import AdminManager from "@/components/admin/AdminManager";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Admins — Super Admin",
};

export default async function AdminsPage() {
  const user = await getCurrentUser();
  if (!user || !isSuperAdmin(user)) redirect("/admin");

  const supabase = createClient();

  let admins: any[] = [];
  try {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, email, role, created_at")
      .in("role", ["admin", "super_admin"])
      .order("created_at", { ascending: true });
    admins = data ?? [];
  } catch {
    admins = [];
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 lg:mt-0 mt-[52px]">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-purple-50 text-brand-purple">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Manage Admins</h1>
          <p className="text-sm text-slate-500">Super Admin only — grant or revoke admin access.</p>
        </div>
      </div>
      <AdminManager admins={admins} currentUserId={user.id} />
    </div>
  );
}
