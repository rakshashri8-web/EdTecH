import { notFound } from "next/navigation";
import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import { INITIAL_COURSES } from "@/lib/data";
import { Award, BookOpen, Download, Printer, ShieldCheck, ArrowLeft } from "lucide-react";

interface CertificatePageProps {
  params: {
    id: string;
  };
}

export default async function CertificateDetailPage({ params }: CertificatePageProps) {
  const { id } = params;

  let certData = null;
  let studentName = "Student Learner";
  let courseTitle = "Data Science & Artificial Intelligence Program";
  let issueDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  let certId = `EDTECH-CERT-${id.slice(0, 8).toUpperCase()}`;

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = createClient();

    const { data: dbCert } = await supabase
      .from("certificates")
      .select("*, course:courses(*), profile:profiles(*)")
      .eq("id", id)
      .single();

    if (dbCert) {
      certData = dbCert;
      studentName = dbCert.profile?.full_name || dbCert.profile?.email || "Student Learner";
      courseTitle = dbCert.course?.title || courseTitle;
      issueDate = new Date(dbCert.issued_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      certId = dbCert.certificate_number || certId;
    }
  } catch {
    // Fallback display
  }

  return (
    <div className="py-12 bg-slate-900 min-h-screen flex flex-col items-center justify-center p-4">
      
      {/* Top Action Bar */}
      <div className="max-w-4xl w-full flex items-center justify-between mb-6 text-white">
        <Link
          href="/completed"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Completed Courses
        </Link>
        
        <div className="flex items-center gap-3">
          <PrintButton />
        </div>
      </div>

      {/* Official Certificate Border Container */}
      <div className="max-w-4xl w-full bg-white text-slate-900 p-8 sm:p-14 rounded-3xl border-8 border-double border-slate-200 shadow-2xl space-y-8 relative overflow-hidden text-center">
        
        {/* Background Seal Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
          <BookOpen className="w-[500px] h-[500px] text-slate-900" />
        </div>

        {/* Certificate Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-brand-blue text-xs font-black uppercase tracking-widest border border-blue-100">
            <ShieldCheck className="w-4 h-4" /> Official Verified Credential
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
            Certificate of Completion
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            EdTech LMS Professional Development Program
          </p>
        </div>

        {/* Certificate Recipient Text */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm text-slate-500 font-medium">This is to certify that</p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-blue underline decoration-brand-blue/30 underline-offset-8">
            {studentName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
            has successfully completed all required coursework, hands-on portfolio projects, and lesson assessments for the professional program:
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 pt-1">
            {courseTitle}
          </h3>
        </div>

        {/* Signatures & Issue Date Footer */}
        <div className="pt-10 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-6 items-end text-left">
          
          <div>
            <span className="block text-[11px] font-extrabold uppercase text-slate-400">Issued On</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800">{issueDate}</span>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple text-white flex items-center justify-center mx-auto mb-2 shadow-lg">
              <Award className="w-8 h-8" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Seal</span>
          </div>

          <div className="text-right">
            <span className="block text-[11px] font-extrabold uppercase text-slate-400">Lead Instructor</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 block">Shaik Anwar</span>
            <span className="text-[10px] text-slate-500">Senior Data Scientist</span>
          </div>

        </div>

        {/* Certificate ID */}
        <div className="pt-2 text-center border-t border-slate-100">
          <span className="text-[11px] font-mono text-slate-400 font-bold">
            Certificate ID: {certId}
          </span>
        </div>

      </div>

    </div>
  );
}
