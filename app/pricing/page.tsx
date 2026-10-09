import Link from "next/link";
import { INITIAL_COURSES } from "@/lib/data";
import { ArrowRight, CheckCircle2, ShieldCheck, HelpCircle, BookOpen } from "lucide-react";
import FAQ from "@/components/FAQ";
import HowEnrollmentWorks from "@/components/HowEnrollmentWorks";

export const metadata = {
  title: "Pricing Programs — AIMP",
  description: "Simple, transparent pricing for all 5 Data & AI engineering pathways.",
};

export default async function PricingPage() {
  let courses = INITIAL_COURSES;
  
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = createClient();
    const { data } = await supabase.from("courses").select("*").eq("published", true);
    if (data && data.length > 0) {
      courses = data;
    }
  } catch {
    courses = INITIAL_COURSES;
  }

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen space-y-16">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center px-4 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-brand-blue text-xs font-black uppercase tracking-wider">
          <BookOpen className="w-4 h-4" /> Transparent Pricing
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Invest in Your Career Growth
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto">
          One-time payment per course with lifetime access to video lectures, hands-on portfolio projects, live Q&A, and verified certificates.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {courses.map((course) => {
            const discount = Math.round(
              ((course.original_price - course.price) / course.original_price) * 100
            );
            return (
              <div
                key={course.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-lg hover:shadow-2xl hover:border-brand-blue/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-blue-50 text-brand-blue">
                    {course.category}
                  </span>
                  
                  <h3 className="text-lg font-black text-slate-900">{course.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{course.description}</p>

                  <div className="pt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-slate-900">
                        ₹{course.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        ₹{course.original_price.toLocaleString("en-IN")}
                      </span>
                    </div>
                    {discount > 0 && (
                      <span className="inline-block mt-1 text-[11px] font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                        Save {discount}% OFF
                      </span>
                    )}
                  </div>

                  <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{course.duration} HD Video Lessons</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Portfolio Projects & Code</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Verified AIMP Certificate</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Manual UPI QR Payment</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <Link
                    href={`/payment/${course.id}`}
                    className="w-full py-3 px-4 bg-gradient-to-r from-brand-blue to-brand-indigo text-white text-xs font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1"
                  >
                    Enroll Now <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* How Enrollment Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HowEnrollmentWorks showCardWrapper={false} />
      </div>

      {/* Feature Comparison Guarantee Banner */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-r from-slate-900 to-brand-navy text-white p-8 rounded-3xl border border-white/10 text-center space-y-4">
          <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-2xl font-black">100% Satisfaction & Verified Credentials</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            All plans include full access to video lectures, downloadable GitHub code repositories, live mentor support, and instant certificate generation.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQ />

    </div>
  );
}
