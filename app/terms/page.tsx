import Link from "next/link";
import { ShieldCheck, FileText } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions — EdTech LMS",
  description: "Read the Terms & Conditions governing access to and use of EdTech online learning platform.",
};

export default function TermsPage() {
  const lastUpdated = "October 2026";

  const sections = [
    { title: "1. Introduction", content: "Welcome to EdTech ('Platform'). These Terms & Conditions ('Terms') govern your access to and use of our online learning website, courses, materials, and services. By accessing or using the Platform, you agree to be bound by these Terms." },
    { title: "2. Acceptance of Terms", content: "By registering an account, purchasing a course, or accessing any educational content on EdTech, you confirm that you have read, understood, and agreed to comply with these Terms and our Privacy Policy." },
    { title: "3. Account Registration", content: "To access certain features, you must create a user profile using a valid email address. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account." },
    { title: "4. Course Enrollment", content: "Course enrollments provide you with non-exclusive, non-transferable access to the enrolled course content for educational purposes only. Courses may not be shared, resold, or redistributed." },
    { title: "5. Payments", content: "All course prices are displayed in Indian Rupees (INR). Payments must be made using the manual UPI payment options provided at checkout. Prices are subject to change without prior notice." },
    { title: "6. Payment Verification", content: "For manual UPI payments, students must submit a valid Unique Transaction Reference (UTR) number and a clear payment screenshot. Course access is granted after administrative verification of the transaction." },
    { title: "7. Course Access", content: "Enrolled students receive lifetime or specified-period access to online video lectures, code notebooks, and learning materials, subject to compliance with these Terms." },
    { title: "8. Educational Content", content: "All course curricula, lectures, code snippets, project briefs, and assessments are provided for instructional purposes only. We continuously update content to match evolving technology standards." },
    { title: "9. User Responsibilities", content: "You agree to use the Platform respectfully, refrain from unauthorized content distribution, submit original work for project assignments, and maintain professional conduct." },
    { title: "10. Project Submissions", content: "When submitting project assignments via GitHub or live demo URLs, you warrant that the code represents your own work or properly attributed open-source libraries." },
    { title: "11. Assessments", content: "Knowledge assessment scores are calculated automatically based on project evaluation criteria. Passing thresholds (e.g., 70%) are required to earn certificates and advance along learning paths." },
    { title: "12. Certificates", content: "Shareable digital certificates are issued upon 100% course completion and passing required assessments. Certificates verify completion of platform coursework." },
    { title: "13. Intellectual Property", content: "All content, logos, course videos, documentation, and source code provided by EdTech are protected by copyright laws and remain the exclusive property of EdTech and its instructors." },
    { title: "14. Prohibited Activities", content: "You may not scrape, copy, modify, decompile, or attempt to compromise Platform security, nor share login credentials with third parties." },
    { title: "15. Account Suspension/Termination", content: "We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent payment submissions, or compromise platform integrity." },
    { title: "16. Refund & Cancellation Policy", content: "[Configure refund policy here — e.g. Course fees are eligible for refund requests submitted within 7 days of purchase, provided less than 20% of video lectures have been completed. Admin verification applies.]" },
    { title: "17. Third-Party Services", content: "Our Platform may integrate with third-party tools such as Supabase, GitHub, and video hosting providers. Use of these services is governed by their respective terms." },
    { title: "18. Limitation of Liability", content: "EdTech provides educational content 'as is'. While we strive for accuracy, we are not liable for indirect, incidental, or consequential damages resulting from Platform use." },
    { title: "19. Changes to Terms", content: "We reserve the right to update these Terms at any time. Material changes will be posted on this page with an updated revision date." },
    { title: "20. Contact Information", content: "If you have questions regarding these Terms & Conditions, please contact us at anwarshaik7288@gmail.com or call 939066xxxx." },
  ];

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-brand-blue font-extrabold text-xs uppercase tracking-wider">
            <FileText className="w-4 h-4" /> Legal Document
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Terms & Conditions</h1>
          <p className="text-xs text-slate-500 font-semibold">
            Last updated: <span className="text-slate-800">{lastUpdated}</span>
          </p>
        </div>

        {/* Legal Sections Container */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-8 text-sm text-slate-700 leading-relaxed">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-2 border-b border-slate-100 pb-6 last:border-0 last:pb-0">
              <h2 className="text-base font-black text-slate-900">{sec.title}</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{sec.content}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
