import Link from "next/link";
import { INSTRUCTOR_INFO } from "@/lib/data";
import { BookOpen, CheckCircle2, ArrowRight, Target, Sparkles, Code2, Award, UserCheck, Layers } from "lucide-react";

export const metadata = {
  title: "About Us — EdTech LMS",
  description: "Learn about EdTech, our mission, 5-step practical learning approach, program areas, and lead mentor Shaik Anwar.",
};

export default function AboutPage() {
  const offers = [
    "Structured courses",
    "Practical hands-on learning",
    "Real-world projects",
    "Project-based assessments",
    "AI & Data Science learning",
    "Learning roadmap",
    "Certificates",
    "Interview preparation",
  ];

  const learningSteps = [
    { title: "Learn", desc: "Interactive video lessons & code notebooks" },
    { title: "Practice", desc: "Hands-on exercises & real datasets" },
    { title: "Build", desc: "Full-stack portfolio capstone projects" },
    { title: "Submit", desc: "GitHub repository & live demo URL" },
    { title: "Get Assessed", desc: "7-section knowledge evaluation suite" },
    { title: "Complete", desc: "Pass threshold & unlock next stage" },
    { title: "Certificate", desc: "Verified digital credential" },
  ];

  const programAreas = [
    "Data Analytics",
    "Data Science",
    "AI / ML Engineering",
    "Generative AI & LLM Engineering",
    "RAG, LangChain & Agentic AI",
  ];

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* HERO */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-brand-navy text-white p-8 sm:p-14 rounded-3xl shadow-2xl border border-white/10 text-center space-y-4">
          <span className="px-4 py-1.5 bg-brand-blue/20 text-brand-blue text-xs font-black rounded-full uppercase tracking-wider border border-brand-blue/30 inline-block">
            About EdTech
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Empowering Job-Ready AI & Data Engineers
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            EdTech is an online learning platform focused on practical technology and AI education. We bridge the gap between academic theory and real-world engineering through hands-on project implementation and rigorous assessments.
          </p>
        </div>

        {/* MISSION */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-brand-blue font-extrabold text-xs uppercase tracking-wider">
            <Target className="w-4 h-4" /> Our Mission
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            From Core Fundamentals to Industry-Oriented Mastery
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-4xl">
            Our mission is to help learners move from foundational concepts to practical, industry-oriented skills through structured learning pathways, hands-on portfolio projects, and objective knowledge assessments.
          </p>
        </div>

        {/* WHAT WE OFFER */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-purple-600 uppercase tracking-wider">Platform Features</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">What We Offer</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {offers.map((item, idx) => (
              <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-slate-800">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* LEARNING APPROACH FLOW */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-black text-brand-blue uppercase tracking-wider">Proven Methodology</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Our Learning Approach</h2>
            <p className="text-xs text-slate-500">Every module follows a rigorous 7-stage learning and verification cycle.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {learningSteps.map((step, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2 relative">
                <span className="w-6 h-6 rounded-full bg-brand-blue text-white text-xs font-bold inline-flex items-center justify-center">
                  {idx + 1}
                </span>
                <h3 className="text-xs font-black text-slate-900">{step.title}</h3>
                <p className="text-[10px] text-slate-500 leading-tight">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PROGRAM AREAS */}
        <div className="bg-slate-900 text-white p-8 sm:p-12 rounded-3xl border border-white/10 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">Curriculum Focus</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Core Program Areas</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {programAreas.map((area, idx) => (
              <span key={idx} className="px-4 py-2 bg-white/10 text-white text-xs sm:text-sm font-bold rounded-xl border border-white/15">
                ⚡ {area}
              </span>
            ))}
          </div>
        </div>

        {/* INSTRUCTOR INFORMATION */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-8">
          <img
            src={INSTRUCTOR_INFO.avatar}
            alt={INSTRUCTOR_INFO.name}
            className="w-24 h-24 rounded-3xl object-cover border-2 border-brand-blue shadow-md shrink-0"
          />
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Lead Mentor</span>
            <h2 className="text-2xl font-black text-slate-900">{INSTRUCTOR_INFO.name}</h2>
            <p className="text-sm font-bold text-brand-blue">{INSTRUCTOR_INFO.role}</p>
            <p className="text-xs text-slate-600 max-w-xl leading-relaxed">{INSTRUCTOR_INFO.bio}</p>
          </div>
        </div>

        {/* CTA BUTTON */}
        <div className="text-center pt-4">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-blue to-brand-indigo text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl hover:shadow-2xl transition-all"
          >
            Explore Courses →
          </Link>
        </div>

      </div>
    </div>
  );
}
