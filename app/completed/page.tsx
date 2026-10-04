import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { INITIAL_COURSES } from "@/lib/data";
import { Certificate, Course } from "@/lib/types";
import { Award, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Completed Courses & Certificates — EdTech LMS",
  description: "View your completed courses and download verified EdTech certificates.",
};

export default async function CompletedPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  let certificates: (Certificate & { course?: Course })[] = [];

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = createClient();

    // Query actual certificates issued for this authenticated student
    const { data: certData } = await supabase
      .from("certificates")
      .select("*, course:courses(*)")
      .eq("user_id", user.id)
      .order("issued_at", { ascending: false });

    if (certData && certData.length > 0) {
      certificates = certData;
    }
  } catch {
    // Graceful error handling if tables not yet populated
  }

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-brand-purple text-xs font-black uppercase tracking-wider">
            <Award className="w-4 h-4" /> Verified Credentials
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Completed Courses & Certificates
          </h1>
          <p className="text-sm text-slate-600">
            Congratulations on completing your program requirements! Download and share your credentials.
          </p>
        </div>

        {/* Certificates Grid */}
        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert) => {
              const c = cert.course || INITIAL_COURSES[0];
              return (
                <div
                  key={cert.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden flex flex-col justify-between p-6 space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 100% Completed
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(cert.issued_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-slate-900">{c.title}</h3>
                    <p className="text-xs text-slate-500">Instructor: {c.instructor_name}</p>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-600">
                      ID: {cert.certificate_number}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <Link
                      href={`/certificates/${cert.id}`}
                      className="w-full py-3 px-4 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Award className="w-4 h-4" /> View & Download Certificate
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="max-w-md mx-auto text-center py-16 px-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <Award className="w-16 h-16 text-slate-300 mx-auto" />
            <h3 className="text-lg font-black text-slate-900">
              No Completed Courses Yet
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Complete 100% of your course lessons in the LMS Player to earn your verified digital certificate.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 bg-brand-blue text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-blue-700 transition-colors"
            >
              Go to Student Dashboard
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
