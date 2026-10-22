"use client";

import { useState } from "react";
import { Eye, CheckCircle2, XCircle, Search, Clock, User, CreditCard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface Enrollment {
  id: string;
  name: string;
  email: string;
  phone: string;
  amount: number;
  utr: string;
  screenshot_url: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  approved_at: string | null;
  approved_by?: string | null;
  rejection_reason?: string | null;
  course?: { title: string } | null;
  approver?: { full_name: string } | null;
}

interface PaymentApprovalTableProps {
  initialEnrollments: Enrollment[];
}

type FilterTab = "all" | "pending" | "approved" | "rejected";

export default function PaymentApprovalTable({ initialEnrollments }: PaymentApprovalTableProps) {
  const supabase = createClient();
  const [enrollments, setEnrollments] = useState<Enrollment[]>(initialEnrollments);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    enrollmentId: string;
    action: "approve" | "reject";
  } | null>(null);

  const filtered = enrollments.filter((e) => {
    const matchesFilter = filter === "all" || e.status === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.utr.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: enrollments.length,
    pending: enrollments.filter((e) => e.status === "pending").length,
    approved: enrollments.filter((e) => e.status === "approved").length,
    rejected: enrollments.filter((e) => e.status === "rejected").length,
  };

  const handleViewScreenshot = async (url: string) => {
    if (!url) return;
    if (url.startsWith("http://") || url.startsWith("https://")) {
      const parts = url.split("payment-screenshots/");
      if (parts.length > 1) {
        const { data } = await supabase.storage
          .from("payment-screenshots")
          .createSignedUrl(parts[1], 3600);
        setSelectedScreenshot(data?.signedUrl || url);
        return;
      }
      setSelectedScreenshot(url);
      return;
    }
    const { data } = await supabase.storage
      .from("payment-screenshots")
      .createSignedUrl(url, 3600);
    setSelectedScreenshot(data?.signedUrl || url);
  };

  const handleAction = async (enrollmentId: string, action: "approve" | "reject", reason?: string) => {
    setProcessingId(enrollmentId);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollmentId, action, reason }),
      });
      if (!res.ok) throw new Error(await res.text());

      setEnrollments((prev) =>
        prev.map((e) =>
          e.id === enrollmentId
            ? {
                ...e,
                status: action === "approve" ? "approved" : "rejected",
                approved_at: action === "approve" ? new Date().toISOString() : null,
                rejection_reason: reason ?? null,
              }
            : e
        )
      );
    } catch (err) {
      console.error("Error updating enrollment:", err);
      alert("Failed to update enrollment status.");
    } finally {
      setProcessingId(null);
      setConfirmDialog(null);
    }
  };

  const tabLabels: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div className="space-y-6">
      {/* Filter Tabs + Search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {tabLabels.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filter === key
                  ? "bg-brand-blue text-white shadow"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {label}
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                filter === key ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
              }`}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, email, UTR..."
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
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">UTR</th>
                <th className="px-6 py-4">Screenshot</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
              {filtered.length > 0 ? (
                filtered.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{e.name}</p>
                      <p className="text-slate-400 text-[11px]">{e.email}</p>
                      <p className="text-slate-400 text-[11px]">{e.phone}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700 max-w-[160px]">
                      {e.course?.title ?? "—"}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-700">
                      ₹{e.amount?.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600">{e.utr}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewScreenshot(e.screenshot_url)}
                        className="inline-flex items-center gap-1 text-brand-blue font-bold hover:underline"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black capitalize ${
                        e.status === "approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : e.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700 animate-pulse"
                      }`}>
                        {e.status === "approved" && <CheckCircle2 className="w-3 h-3" />}
                        {e.status === "rejected" && <XCircle className="w-3 h-3" />}
                        {e.status === "pending" && <Clock className="w-3 h-3" />}
                        {e.status}
                      </span>
                      {e.status === "approved" && e.approved_at && (
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(e.approved_at).toLocaleDateString("en-IN")}
                        </p>
                      )}
                      {e.status === "rejected" && e.rejection_reason && (
                        <p className="text-[10px] text-red-400 mt-0.5 max-w-[120px] truncate" title={e.rejection_reason}>
                          Reason: {e.rejection_reason}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(e.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {e.status === "pending" ? (
                        <>
                          <button
                            disabled={processingId === e.id}
                            onClick={() => setConfirmDialog({ open: true, enrollmentId: e.id, action: "approve" })}
                            className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-xs hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            disabled={processingId === e.id}
                            onClick={() => setConfirmDialog({ open: true, enrollmentId: e.id, action: "reject" })}
                            className="px-3 py-1.5 bg-red-100 text-red-700 font-bold rounded-lg text-xs hover:bg-red-200 disabled:opacity-50 transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-300 text-[11px] font-bold">No action</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400 font-bold">
                    No enrollments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screenshot Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-slate-900 text-base">Payment Screenshot</h3>
              <button onClick={() => setSelectedScreenshot(null)} className="text-slate-400 hover:text-slate-700 font-bold text-sm">
                ✕ Close
              </button>
            </div>
            <div className="rounded-2xl border bg-slate-100 flex items-center justify-center overflow-hidden">
              <img
                src={selectedScreenshot}
                alt="Payment Screenshot"
                className="w-full object-contain max-h-[60vh]"
                onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog?.open && (
        <ConfirmDialog
          isOpen={confirmDialog.open}
          title={confirmDialog.action === "approve" ? "Approve Payment" : "Reject Payment"}
          message={
            confirmDialog.action === "approve"
              ? "Are you sure you want to approve this payment? This will grant course access to the student."
              : "Are you sure you want to reject this payment? Please provide a reason."
          }
          variant={confirmDialog.action === "approve" ? "info" : "danger"}
          requireReason={confirmDialog.action === "reject"}
          onConfirm={(reason) => handleAction(confirmDialog.enrollmentId, confirmDialog.action, reason)}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </div>
  );
}
