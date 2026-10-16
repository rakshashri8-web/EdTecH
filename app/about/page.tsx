import Link from "next/link";
import Image from "next/image";
import { INSTRUCTOR_INFO } from "@/lib/data";
import { BookOpen, CheckCircle2, ArrowRight, Target, Sparkles, Code2, Award, UserCheck, Layers, MessageSquare } from "lucide-react";
import { getWhatsAppLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";

export const metadata = {
  title: "About Us — AIMP",
  description: "Learn about AIMP, our mission, 5-step practical learning approach, program areas, and lead mentor Shaik Anwar.",
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
            About AIMP
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Empowering Job-Ready AI & Data Engineers
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            AIMP is an online learning platform focused on practical technology and AI education. We bridge the gap between academic theory and real-world engineering through hands-on project implementation and rigorous assessments.
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
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-10 relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Portrait Image Frame */}
          <div className="relative w-48 sm:w-56 md:w-60 aspect-[3/4] rounded-2xl overflow-hidden shrink-0 shadow-lg border-2 border-slate-200/80 bg-slate-100">
            <Image
              src="/images/shaik-anwar.jpg"
              alt="Shaik Anwar - Senior Data Scientist and Founder at AIMP"
              fill
              sizes="(max-width: 768px) 224px, 240px"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2.5 inset-x-2.5 bg-slate-950/80 backdrop-blur-md rounded-xl p-2 text-center text-white border border-white/10">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">Lead Mentor</span>
              <span className="text-xs font-black block truncate">Shaik Anwar</span>
            </div>
          </div>

          {/* Bio & Credentials Details */}
          <div className="space-y-4 text-center md:text-left flex-1 min-w-0">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-black uppercase tracking-wider border border-blue-200/60">
                <UserCheck className="w-3.5 h-3.5" /> Program Director & Lead Mentor
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{INSTRUCTOR_INFO.name}</h2>
              <p className="text-sm sm:text-base font-bold text-brand-blue mt-0.5">{INSTRUCTOR_INFO.role} • {INSTRUCTOR_INFO.program}</p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">{INSTRUCTOR_INFO.bio}</p>

            {/* Credentials Badges */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
              <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-brand-blue" /> 10+ Years Industry Experience
              </span>
              <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" /> 10,000+ Students Mentored
              </span>
              <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-emerald-600" /> Hands-on Project Mentorship
              </span>
            </div>

            <div className="pt-2">
              <a
                href={getWhatsAppLink(WHATSAPP_MESSAGES.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] font-bold text-xs rounded-xl border border-[#25D366]/30 transition-colors shadow-xs"
              >
                <MessageSquare className="w-4 h-4 text-[#25D366]" />
                Connect with Mentor on WhatsApp
              </a>
            </div>
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
