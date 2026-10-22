"use client";

import { useState } from "react";
import { ShieldCheck, UserX, UserPlus, Search, Loader2, Crown } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface Admin {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
  created_at: string;
}

interface AdminManagerProps {
  admins: Admin[];
  currentUserId: string;
}

export default function AdminManager({ admins: initialAdmins, currentUserId }: AdminManagerProps) {
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [grantEmail, setGrantEmail] = useState("");
  const [granting, setGranting] = useState(false);
  const [grantError, setGrantError] = useState("");
  const [grantSuccess, setGrantSuccess] = useState("");
  const [revokeTarget, setRevokeTarget] = useState<Admin | null>(null);
  const [search, setSearch] = useState("");

  const filtered = admins.filter((a) => {
    const q = search.toLowerCase();
    return !q || (a.full_name ?? "").toLowerCase().includes(q) || a.email.toLowerCase().includes(q);
  });

  const handleGrant = async () => {
    if (!grantEmail.trim()) return;
    setGranting(true);
    setGrantError("");
    setGrantSuccess("");
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: grantEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to grant admin role");
      setGrantSuccess(`✓ Admin role granted to ${grantEmail}`);
      setGrantEmail("");
      if (data.user) {
        setAdmins((prev) => {
          const exists = prev.some((a) => a.id === data.user.id);
          return exists
            ? prev.map((a) => (a.id === data.user.id ? { ...a, role: "admin" } : a))
            : [...prev, { ...data.user, role: "admin" }];
        });
      }
    } catch (err: any) {
      setGrantError(err.message);
    } finally {
      setGranting(false);
    }
  };

  const handleRevoke = async (admin: Admin) => {
    try {
      const res = await fetch("/api/admin/admins", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: admin.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to revoke admin role");
      setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setRevokeTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Grant Admin */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <UserPlus className="w-5 h-5 text-brand-blue" />
          <h2 className="text-base font-black text-slate-900">Grant Admin Access</h2>
        </div>
        <p className="text-sm text-slate-500">Enter the email of an existing student to promote them to admin role.</p>
        <div className="flex gap-3">
          <input
            type="email"
            value={grantEmail}
            onChange={(e) => setGrantEmail(e.target.value)}
            placeholder="student@example.com"
            className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
            onKeyDown={(e) => e.key === "Enter" && handleGrant()}
          />
          <button
            onClick={handleGrant}
            disabled={granting || !grantEmail.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {granting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            Grant Admin
          </button>
        </div>
        {grantError && <p className="text-sm text-red-600 font-bold">{grantError}</p>}
        {grantSuccess && <p className="text-sm text-emerald-600 font-bold">{grantSuccess}</p>}
      </div>

      {/* Admin List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <h2 className="text-base font-black text-slate-900">Current Admins ({admins.length})</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search admins..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Admin</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Added</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
              {filtered.map((admin) => {
                const isCurrentUser = admin.id === currentUserId;
                const isSuperAdmin = admin.role === "super_admin";
                return (
                  <tr key={admin.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${isSuperAdmin ? "bg-purple-100 text-brand-purple" : "bg-blue-100 text-brand-blue"}`}>
                          {(admin.full_name ?? admin.email)[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{admin.full_name ?? "—"}</p>
                          <p className="text-slate-400 text-[11px]">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black ${
                        isSuperAdmin ? "bg-purple-100 text-brand-purple" : "bg-blue-100 text-brand-blue"
                      }`}>
                        {isSuperAdmin && <Crown className="w-3 h-3" />}
                        {admin.role.replace("_", " ")}
                        {isCurrentUser && <span className="ml-1 opacity-60">(you)</span>}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(admin.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {(isCurrentUser || isSuperAdmin) ? (
                        <span className="text-xs text-slate-300 font-bold">Protected</span>
                      ) : (
                        <button
                          onClick={() => setRevokeTarget(admin)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                        >
                          <UserX className="w-3.5 h-3.5" /> Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400 font-bold">No admins found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {revokeTarget && (
        <ConfirmDialog
          isOpen={!!revokeTarget}
          title="Revoke Admin Access"
          message={`Are you sure you want to revoke admin access from ${revokeTarget.full_name ?? revokeTarget.email}? They will be downgraded to student role.`}
          variant="danger"
          onConfirm={() => handleRevoke(revokeTarget)}
          onCancel={() => setRevokeTarget(null)}
        />
      )}
    </div>
  );
}
