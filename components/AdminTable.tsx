"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Enrollment } from "@/lib/types";
import { CheckCircle2, XCircle, Eye, Search, Clock, ShieldCheck, DollarSign, Users, BookOpen, MessageSquare, Mail } from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

interface AdminTableProps {
  initialEnrollments: Enrollment[];
}

export default function AdminTable({ initialEnrollments }: AdminTableProps) {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<"enrollments" | "contact">("enrollments");
  const [enrollments, setEnrollments] = useState<Enrollment[]>(initialEnrollments);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await supabase
          .from("contact_messages")
          .select("*")
          .order("created_at", { ascending: false });
        if (data) {
          setContactMessages(data);
        }
      } catch (err) {
        console.error("Error fetching contact messages:", err);
      }
    };

    fetchMessages();
  }, [supabase]);

  // Compute Metrics
  const totalStudents = new Set(enrollments.map((e) => e.user_id)).size;
  const totalEnrollments = enrollments.length;
  const pendingCount = enrollments.filter((e) => e.status === "pending").length;
  const approvedCount = enrollments.filter((e) => e.status === "approved").length;
  const totalRevenue = enrollments
    .filter((e) => e.status === "approved")
    .reduce((sum, e) => sum + e.amount, 0);

  const filteredEnrollments = enrollments.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.utr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.course?.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || e.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewScreenshot = async (rawUrlOrPath: string) => {
    if (!rawUrlOrPath) return;

    if (rawUrlOrPath.startsWith("http://") || rawUrlOrPath.startsWith("https://")) {
      // Try to extract object path if it's a Supabase storage URL
      const parts = rawUrlOrPath.split("payment-screenshots/");
      if (parts.length > 1) {
        const objectPath = parts[1];
        const { data } = await supabase.storage
          .from("payment-screenshots")
          .createSignedUrl(objectPath, 3600);
        setSelectedScreenshot(data?.signedUrl || rawUrlOrPath);
        return;
      }
      setSelectedScreenshot(rawUrlOrPath);
      return;
    }

    // Treat rawUrlOrPath as bucket object path (e.g. user_id/timestamp.ext)
    const { data, error } = await supabase.storage
      .from("payment-screenshots")
      .createSignedUrl(rawUrlOrPath, 3600);

    if (error || !data?.signedUrl) {
      console.warn("Could not generate signed URL:", error);
      setSelectedScreenshot(rawUrlOrPath);
    } else {
      setSelectedScreenshot(data.signedUrl);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: "approved" | "rejected") => {
    if (!window.confirm(`Are you sure you want to mark this enrollment as ${newStatus}?`)) {
      return;
    }

    setProcessingId(id);

    try {
      // Update enrollments status
      const { error: enrollErr } = await supabase
        .from("enrollments")
        .update({
          status: newStatus,
          approved_at: newStatus === "approved" ? new Date().toISOString() : null,
        })
        .eq("id", id);

      if (enrollErr) throw enrollErr;

      // Also update payments table status
      try {
        await supabase
          .from("payments")
          .update({
            status: newStatus === "approved" ? "completed" : "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("enrollment_id", id);
      } catch (payErr) {
        console.warn("Payment status update note:", payErr);
      }

      setEnrollments((prev) =>
        prev.map((e) =>
          e.id === id
            ? { ...e, status: newStatus, approved_at: newStatus === "approved" ? new Date().toISOString() : null }
            : e
        )
      );

      setProcessingId(null);
      router.refresh();
    } catch (err) {
      console.error("Error updating enrollment:", err);
      alert("Failed to update status. Make sure you have admin rights.");
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Tab Controls */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("enrollments")}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === "enrollments"
              ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Enrollments & UPI Payments ({pendingCount} Pending)
        </button>
        <button
          onClick={() => setActiveTab("contact")}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === "contact"
              ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Contact Form Messages ({contactMessages.length})
        </button>
      </div>

      {activeTab === "enrollments" ? (
        <>
          {/* Top Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-brand-blue">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-bold block">Total Students</span>
                  <span className="text-xl font-black text-slate-900">{totalStudents}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-50 text-brand-purple">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-bold block">Enrollments</span>
                  <span className="text-xl font-black text-slate-900">{totalEnrollments}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-bold block">Pending Approval</span>
                  <span className="text-xl font-black text-amber-600">{pendingCount}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-bold block">Approved</span>
                  <span className="text-xl font-black text-emerald-600">{approvedCount}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-bold block">Total Revenue</span>
                  <span className="text-xl font-black text-slate-900">₹{totalRevenue.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by student, email, UTR, course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>

            {/* Status Filters */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {["all", "pending", "approved", "rejected"].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold capitalize transition-all ${
                    filterStatus === st
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

          </div>

          {/* Enrollments Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                    <th className="py-4 px-6">Student</th>
                    <th className="py-4 px-6">Course</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6">UTR Ref</th>
                    <th className="py-4 px-6">Screenshot</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {filteredEnrollments.length > 0 ? (
                    filteredEnrollments.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6">
                          <p className="font-bold text-slate-900">{item.name}</p>
                          <p className="text-[11px] text-slate-400">{item.email}</p>
                          <p className="text-[11px] text-slate-400">{item.phone}</p>
                        </td>

                        <td className="py-4 px-6 font-extrabold text-slate-900">
                          {item.course?.title || "EdTech Course"}
                        </td>

                        <td className="py-4 px-6 font-bold text-emerald-700">
                          ₹{item.amount.toLocaleString("en-IN")}
                        </td>

                        <td className="py-4 px-6 font-mono text-slate-800">
                          {item.utr}
                        </td>

                        <td className="py-4 px-6">
                          <button
                            onClick={() => handleViewScreenshot(item.screenshot_url)}
                            className="inline-flex items-center gap-1 text-brand-blue font-bold hover:underline"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                        </td>

                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black capitalize ${
                            item.status === "approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : item.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800 animate-pulse"
                          }`}>
                            {item.status}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right space-x-2">
                          {item.status !== "approved" && (
                            <button
                              onClick={() => handleUpdateStatus(item.id, "approved")}
                              disabled={processingId === item.id}
                              className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-xs hover:bg-emerald-700 transition-colors"
                            >
                              Approve
                            </button>
                          )}
                          {item.status !== "rejected" && (
                            <button
                              onClick={() => handleUpdateStatus(item.id, "rejected")}
                              disabled={processingId === item.id}
                              className="px-3 py-1.5 bg-red-100 text-red-700 font-bold rounded-lg text-xs hover:bg-red-200 transition-colors"
                            >
                              Reject
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 font-bold">
                        No enrollments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Contact Messages View */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900">Student & Visitor Contact Enquiries</h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {contactMessages.length} Messages Received
            </span>
          </div>

          {contactMessages.length > 0 ? (
            <div className="space-y-4">
              {contactMessages.map((msg) => (
                <div key={msg.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-200/60 pb-3">
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{msg.name}</h4>
                      <p className="text-xs text-slate-500">{msg.email} {msg.phone ? `• ${msg.phone}` : ""}</p>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      {new Date(msg.created_at).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-brand-blue block mb-1">Subject: {msg.subject}</span>
                    <p className="text-xs text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                      {msg.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400 font-bold">
              No contact messages received yet. Submit test messages via the /contact page.
            </div>
          )}
        </div>
      )}

      {/* Screenshot Modal Viewer */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Payment Screenshot</h3>
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕ Close
              </button>
            </div>
            <div className="aspect-auto max-h-[60vh] overflow-hidden rounded-2xl border bg-slate-100 flex items-center justify-center">
              <img
                src={selectedScreenshot}
                alt="Uploaded Payment Screenshot"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <p className="text-xs text-slate-400 p-8 text-center">
                If screenshot preview does not render, verify storage permissions or URL: {selectedScreenshot}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

