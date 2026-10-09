import Link from "next/link";
import { Compass, BookOpen, Layers, Home, Phone, ArrowRight, HelpCircle } from "lucide-react";

export const metadata = {
  title: "404 — Page Not Found | AIMP",
  description: "The page you are looking for does not exist or has been moved.",
};

export default function NotFound() {
  const popularCourses = [
    { title: "Data Analyst Program", slug: "data-analyst", level: "Beginner" },
    { title: "Data Science Specialization", slug: "data-science", level: "Intermediate" },
    { title: "AI / ML Engineer Track", slug: "ai-ml-engineer", level: "Advanced" },
    { title: "Generative AI & LLM Engineering", slug: "genai-engineer", level: "Advanced" },
    { title: "Agentic AI & Multi-Agent Systems", slug: "agentic-ai-engineer", level: "Expert" },
  ];

  return (
    <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center px-4 py-16 sm:py-24">
      <div className="max-w-3xl w-full text-center space-y-10">
        
        {/* Error Badge & Icon */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-black uppercase tracking-wider">
            <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: "10s" }} />
            Error 404 • Page Not Found
          </div>

          <h1 className="text-6xl sm:text-8xl font-black text-slate-900 tracking-tight">
            4<span className="text-brand-blue">0</span>4
          </h1>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
            Looks like you took an uncharted path
          </h2>

          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
            The page you are looking for might have been moved, renamed, or no longer exists. Let&apos;s get you back on track with your learning journey.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white font-extrabold text-sm rounded-xl shadow-lg shadow-brand-blue/20 hover:bg-blue-700 transition-all hover:shadow-xl"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>

          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-800 border border-slate-200 font-extrabold text-sm rounded-xl shadow-sm hover:bg-slate-100 transition-all"
          >
            <BookOpen className="w-4 h-4 text-brand-blue" />
            Browse Courses
          </Link>

          <Link
            href="/learning-path"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-extrabold text-sm rounded-xl shadow-md hover:bg-purple-700 transition-all"
          >
            <Layers className="w-4 h-4" />
            5-Stage Path
          </Link>
        </div>

        {/* Popular Courses Navigation Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm text-left space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Popular Career Programs
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              Fast-track your job readiness
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {popularCourses.map((course) => (
              <Link
                key={course.slug}
                href={`/courses/${course.slug}`}
                className="group p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/60 hover:border-brand-blue/40 transition-all flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-brand-blue transition-colors">
                    {course.title}
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {course.level} Level
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        {/* Need Help Footer */}
        <div className="pt-2 text-xs text-slate-500 flex items-center justify-center gap-4">
          <span>Need assistance?</span>
          <Link href="/contact" className="font-extrabold text-brand-blue hover:underline inline-flex items-center gap-1">
            <Phone className="w-3.5 h-3.5" /> Contact Support
          </Link>
          <span>•</span>
          <Link href="/faq" className="font-extrabold text-slate-700 hover:underline inline-flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> FAQs
          </Link>
        </div>

      </div>
    </div>
  );
}
