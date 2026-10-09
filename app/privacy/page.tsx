import Link from "next/link";
import { ShieldCheck, Lock, Eye, Database, FileText, CheckCircle2, Mail, Phone, ArrowRight, UserCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — AIMP",
  description: "Learn how AIMP collects, uses, and safeguards your personal data, payment information, and course progress.",
};

export default function PrivacyPage() {
  const lastUpdated = "October 2026";

  const keyHighlights = [
    {
      icon: Lock,
      title: "Bank-Grade Encryption",
      desc: "All database traffic, payment records, and user profiles are secured with SSL/TLS encryption.",
    },
    {
      icon: Eye,
      title: "Zero Third-Party Selling",
      desc: "We never sell, rent, or trade your personal contact or learning data to advertising brokers.",
    },
    {
      icon: Database,
      title: "Row-Level Security (RLS)",
      desc: "Strict database isolation ensures students can only view and modify their own authorized records.",
    },
    {
      icon: UserCheck,
      title: "You Own Your Data",
      desc: "Request a copy of your records or delete your profile and learning submissions at any time.",
    },
  ];

  const sections = [
    {
      id: "intro",
      title: "1. Introduction & Overview",
      content: (
        <>
          <p>
            Welcome to AIMP (&quot;we,&quot; &quot;our,&quot; or &quot;the Platform&quot;), an industry-focused online learning management platform dedicated to practical engineering education in Data Analytics, Data Science, Machine Learning, Generative AI, and Agentic AI systems.
          </p>
          <p className="mt-2">
            This Privacy Policy describes our practices regarding the collection, use, processing, and disclosure of your personal data when you visit our website, register for an account, enroll in courses, submit project assignments, or interact with our learning management services. By accessing or using the Platform, you acknowledge that you have read and understood this Privacy Policy.
          </p>
        </>
      ),
    },
    {
      id: "data-collection",
      title: "2. Information We Collect",
      content: (
        <>
          <p>We collect information you provide directly to us, as well as information generated automatically through your use of the Platform:</p>
          <ul className="list-disc list-inside mt-2 space-y-1.5 text-slate-600 pl-2">
            <li><strong className="text-slate-800">Account Credentials:</strong> Full name, email address, phone number, and avatar image provided during registration or OAuth sign-in (e.g. Google Sign-In).</li>
            <li><strong className="text-slate-800">Enrollment & Manual Payment Data:</strong> Enrolled course IDs, Unique Transaction Reference (UTR) numbers, payment amounts, and transaction dates.</li>
            <li><strong className="text-slate-800">Payment Verification Screenshots:</strong> Transaction screenshot image files uploaded by you to verify manual UPI payments.</li>
            <li><strong className="text-slate-800">Learning & Academic Progress:</strong> Video lesson completion status, modules completed, timestamps, and overall curriculum completion percentages.</li>
            <li><strong className="text-slate-800">Project Submissions & Assessments:</strong> GitHub repository URLs, live project deployment links, code explanations, and 7-section project assessment quiz scores.</li>
            <li><strong className="text-slate-800">Support & Inquiries:</strong> Communications sent via our contact form, email, or WhatsApp, including subject lines and inquiry details.</li>
          </ul>
        </>
      ),
    },
    {
      id: "data-usage",
      title: "3. How We Use Your Information",
      content: (
        <>
          <p>We use the collected information for the following legitimate business and educational purposes:</p>
          <ul className="list-disc list-inside mt-2 space-y-1.5 text-slate-600 pl-2">
            <li>Providing, maintaining, and improving our LMS learning platform and course streaming.</li>
            <li>Processing course enrollments and verifying manual UPI payments against bank records.</li>
            <li>Granting course unlocks and lesson access upon confirmed enrollment approval.</li>
            <li>Tracking individual lesson progress and calculating course completion metrics.</li>
            <li>Generating and issuing tamper-proof, verifiable digital certificates of completion.</li>
            <li>Evaluating project understanding through interactive assessment grading algorithms.</li>
            <li>Sending essential service notifications, administrative confirmations, and support responses.</li>
            <li>Detecting, preventing, and addressing fraud, policy violations, and unauthorized platform access.</li>
          </ul>
        </>
      ),
    },
    {
      id: "auth-security",
      title: "4. Authentication & Account Security",
      content: (
        <>
          <p>
            User authentication on AIMP is powered by Supabase Auth with enterprise-level security standards. We support email/password sign-in and OAuth 2.0 social login (Google Sign-In).
          </p>
          <p className="mt-2">
            Passwords are never stored in plain text; they are cryptographically salted and hashed using industry-standard algorithms. Session cookies and JWT authentication tokens are encrypted and transmitted exclusively over secure HTTPS channels.
          </p>
        </>
      ),
    },
    {
      id: "payment-verification",
      title: "5. Manual UPI Payments & Screenshot Privacy",
      content: (
        <>
          <p>
            We process payments through direct manual UPI transactions. When you submit payment details, you provide a 12-digit UPI UTR reference number and an optional payment confirmation screenshot.
          </p>
          <p className="mt-2">
            Payment screenshots are stored in private Supabase Storage buckets protected by Row Level Security policies. These files are accessible only to the uploading student and authorized platform administrators for the sole purpose of verifying the payment. Screenshots are never published publicly or shared with third parties.
          </p>
        </>
      ),
    },
    {
      id: "academic-records",
      title: "6. Progress Tracking & Certificate Verification",
      content: (
        <>
          <p>
            When you complete a course, the Platform generates a unique digital Certificate ID (e.g., <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-slate-800">AIMP-DATA-ANALYST-XXXXXX</code>).
          </p>
          <p className="mt-2">
            To enable legitimate credential verification by prospective employers, public certificate verification lookups expose only minimal academic confirmation data: the student&apos;s name, course title, certificate number, and issue date. Private contact details, payment records, and account credentials are never exposed via certificate verification endpoints.
          </p>
        </>
      ),
    },
    {
      id: "infrastructure",
      title: "7. Data Storage & PostgreSQL Security",
      content: (
        <>
          <p>
            Our core databases run on managed PostgreSQL instances provided by Supabase. Every table—including <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">profiles</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">enrollments</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">payments</code>, and <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">lesson_progress</code>—is strictly guarded with Row Level Security (RLS) policies and PostgreSQL anti-tampering triggers.
          </p>
          <p className="mt-2">
            These database-level security rules guarantee that students cannot escalate their roles to administrator, alter other students&apos; data, or forge approved enrollment states.
          </p>
        </>
      ),
    },
    {
      id: "retention",
      title: "8. Data Retention & Deletion",
      content: (
        <>
          <p>
            We retain personal information for as long as your account remains active or as necessary to provide educational access, maintain historical certificate validity records, and comply with legal or tax obligations.
          </p>
          <p className="mt-2">
            If you wish to terminate your account and delete your personal data, you may submit a request to our data protection team at <strong className="text-slate-900">anwarshaik7288@gmail.com</strong>. Upon receiving your verified request, we will permanently remove your personal identification and enrollment files within 30 business days, retaining only non-identifiable aggregated audit records where required by law.
          </p>
        </>
      ),
    },
    {
      id: "user-rights",
      title: "9. Your Privacy Rights",
      content: (
        <>
          <p>Depending on your jurisdiction, you have the following rights regarding your personal information:</p>
          <ul className="list-disc list-inside mt-2 space-y-1.5 text-slate-600 pl-2">
            <li><strong className="text-slate-800">Right of Access:</strong> You can review the personal information associated with your account from your profile dashboard.</li>
            <li><strong className="text-slate-800">Right to Rectification:</strong> You can update or correct incomplete or inaccurate personal information.</li>
            <li><strong className="text-slate-800">Right to Erasure:</strong> You can request the permanent deletion of your profile and uploaded files.</li>
            <li><strong className="text-slate-800">Right to Data Portability:</strong> You can request an electronic copy of your course progress and submission records.</li>
            <li><strong className="text-slate-800">Right to Withdraw Consent:</strong> You may revoke consent for non-essential communications at any time.</li>
          </ul>
        </>
      ),
    },
    {
      id: "cookies",
      title: "10. Cookies & Local Storage",
      content: (
        <>
          <p>
            We use strictly necessary first-party cookies and local storage tokens to manage user sessions, maintain authentication state across pages, and prevent Cross-Site Request Forgery (CSRF).
          </p>
          <p className="mt-2">
            We do not use invasive third-party cross-site advertising cookies or behavioral tracking pixels. You can configure your browser to reject cookies, though doing so may prevent you from logging in or maintaining an active learning session.
          </p>
        </>
      ),
    },
    {
      id: "updates",
      title: "11. Updates to This Privacy Policy",
      content: (
        <>
          <p>
            We may periodically revise this Privacy Policy to reflect enhancements to our platform features, curriculum offerings, or evolving legal standards.
          </p>
          <p className="mt-2">
            When material changes are published, we will update the &quot;Last updated&quot; date at the top of this page. For significant modifications impacting your rights, we will provide additional notice, such as an email announcement or dashboard banner.
          </p>
        </>
      ),
    },
    {
      id: "contact",
      title: "12. Contact & Data Protection Officer",
      content: (
        <>
          <p>
            If you have questions, feedback, or concerns regarding our privacy practices or wish to exercise your data rights, please contact our administrative team:
          </p>
          <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm">
            <p><strong className="text-slate-900">Program Director & Data Officer:</strong> Shaik Anwar</p>
            <p><strong className="text-slate-900">Email:</strong> <a href="mailto:anwarshaik7288@gmail.com" className="text-brand-blue font-semibold hover:underline">anwarshaik7288@gmail.com</a></p>
            <p><strong className="text-slate-900">Phone Support:</strong> +91 939066xxxx</p>
            <p><strong className="text-slate-900">Platform:</strong> Analytics with Annu / AIMP</p>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-brand-navy text-white p-8 sm:p-12 rounded-3xl shadow-xl border border-white/10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4" /> Privacy & Data Governance
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Your trust is our highest priority. This policy outlines our commitment to transparency, data minimization, and securing your personal and academic information.
          </p>
          <div className="pt-2 text-xs text-slate-400 font-semibold flex items-center gap-2">
            <span>Last revised:</span>
            <span className="text-white font-bold">{lastUpdated}</span>
            <span>•</span>
            <span>Applies to all registered students, visitors, and certificate holders</span>
          </div>
        </div>

        {/* 4-Card Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {keyHighlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Main Privacy Document Content */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-10 text-sm text-slate-700 leading-relaxed">
          {sections.map((sec) => (
            <section key={sec.id} id={sec.id} className="space-y-3 border-b border-slate-100 pb-8 last:border-0 last:pb-0 scroll-mt-24">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {sec.title}
              </h2>
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {sec.content}
              </div>
            </section>
          ))}
        </div>

        {/* Bottom Contact / Legal Support Callout */}
        <div className="bg-gradient-to-r from-brand-blue to-brand-indigo text-white p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-1">
            <h3 className="text-xl font-black">Have questions about your data?</h3>
            <p className="text-xs sm:text-sm text-blue-100">
              Our support team is available to assist you with data requests and privacy inquiries.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="px-5 py-2.5 bg-white text-slate-900 font-extrabold text-xs rounded-xl shadow hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5"
            >
              Contact Support <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/terms"
              className="px-5 py-2.5 bg-blue-700/60 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
