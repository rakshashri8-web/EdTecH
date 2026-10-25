"use client";

import Link from "next/link";
import { Course } from "@/lib/types";
import { PROJECTS_LIST } from "@/lib/data";
import { 
  Star, 
  ArrowRight, 
  BookOpen, 
  Rocket, 
  CheckCircle2, 
  BarChart3, 
  Database, 
  Cpu, 
  Sparkles, 
  Workflow 
} from "lucide-react";

interface CourseCardProps {
  course: Course;
}

const getCourseTheme = (slug: string, title: string) => {
  const s = (slug || "").toLowerCase();
  const t = (title || "").toLowerCase();

  if (s.includes("analyst") || t.includes("analyst")) {
    return {
      badge: "Analytics & BI",
      icon: BarChart3,
      accentBg: "bg-blue-600",
      accentText: "text-blue-600",
      lightBg: "bg-blue-50 text-blue-700 border-blue-200/60",
    };
  }
  if (s.includes("science") || t.includes("science")) {
    return {
      badge: "Statistics & ML",
      icon: Database,
      accentBg: "bg-indigo-600",
      accentText: "text-indigo-600",
      lightBg: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
    };
  }
  if (s.includes("ai-ml") || t.includes("machine learning") || t.includes("ai / ml")) {
    return {
      badge: "Neural Networks & AI",
      icon: Cpu,
      accentBg: "bg-violet-600",
      accentText: "text-violet-600",
      lightBg: "bg-violet-50 text-violet-700 border-violet-200/60",
    };
  }
  if (s.includes("genai") || s.includes("generative") || t.includes("generative")) {
    return {
      badge: "Generative AI & LLMs",
      icon: Sparkles,
      accentBg: "bg-cyan-600",
      accentText: "text-cyan-600",
      lightBg: "bg-cyan-50 text-cyan-700 border-cyan-200/60",
    };
  }
  if (s.includes("agentic") || t.includes("agentic") || t.includes("agent")) {
    return {
      badge: "Multi-Agent Systems",
      icon: Workflow,
      accentBg: "bg-emerald-600",
      accentText: "text-emerald-600",
      lightBg: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    };
  }

  return {
    badge: "Industry Program",
    icon: Sparkles,
    accentBg: "bg-brand-blue",
    accentText: "text-brand-blue",
    lightBg: "bg-blue-50 text-brand-blue border-blue-200/60",
  };
};

export default function CourseCard({ course }: CourseCardProps) {
  const theme = getCourseTheme(course.slug, course.title);
  const IconComponent = theme.icon;

  const modulesCount = course.modules_count || course.modules?.length || 10;
  const courseProjectsCount = PROJECTS_LIST.filter(p => p.course_slug === course.slug).length;
  const projectsCount = courseProjectsCount > 0 ? courseProjectsCount : (course.projects_count || 2);
  const techList = course.technologies && course.technologies.length > 0
    ? course.technologies.slice(0, 4)
    : ["Python", "SQL", "Power BI", "AI"];

  const currentPrice = 3999;

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-lg shadow-slate-100 hover:shadow-2xl hover:shadow-brand-blue/15 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Thumbnail Image Header */}
      <Link href={`/courses/${course.slug}`} className="relative h-52 w-full overflow-hidden bg-slate-900 block">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
        
        {/* Course Specific Thematic Icon Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-lg text-white">
          <div className={`p-1 rounded-lg ${theme.accentBg} text-white`}>
            <IconComponent className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-extrabold tracking-wide">
            {theme.badge}
          </span>
        </div>

        {/* Category Pill */}
        <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-slate-900 font-extrabold text-[11px] px-3 py-1.5 rounded-xl shadow-md border border-white/40">
          {course.category}
        </span>

        {/* Rating Floating Tag */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-amber-400 border border-white/10 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>4.9 ★</span>
          <span className="text-slate-300 font-normal">| 120+ Student Reviews</span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Difficulty Badge & Curriculum Pill (No duration) */}
          <div className="flex items-center justify-between text-xs font-semibold mb-2.5">
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-brand-blue font-extrabold text-[11px] tracking-wide border border-blue-100/70 inline-flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
              {course.difficulty} Level
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              {modulesCount} Modules • {projectsCount} Projects
            </span>
          </div>

          {/* Course Title */}
          <Link href={`/courses/${course.slug}`}>
            <h3 className="text-lg font-black text-slate-900 group-hover:text-brand-blue transition-colors line-clamp-1">
              {course.title}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {course.description}
          </p>

          {/* Modules & Real Projects Counts */}
          <div className="mt-3.5 flex items-center gap-3 text-xs font-bold text-slate-600 bg-slate-50/90 p-2.5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-brand-blue" />
              <span>{modulesCount} Modules</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1.5">
              <Rocket className="w-3.5 h-3.5 text-purple-600" />
              <span>{projectsCount} Capstone Projects</span>
            </div>
          </div>

          {/* Technology Badges */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {techList.map((tech) => (
              <span
                key={tech}
                className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-brand-blue border border-blue-100/60"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Action Controls */}
        <div className="pt-3.5 border-t border-slate-100 space-y-3">
          
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                ₹{currentPrice.toLocaleString("en-IN")}
              </span>
              <span className="ml-2 text-[11px] font-semibold text-slate-400">
                All-Inclusive
              </span>
            </div>
            <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Lifetime Access
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href={`/courses/${course.slug}`}
              className="py-2.5 text-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors block"
            >
              View Syllabus
            </Link>
            <Link
              href={`/payment/${course.id}`}
              className="py-2.5 text-center text-xs font-extrabold text-white bg-gradient-to-r from-brand-blue to-brand-indigo hover:shadow-lg hover:shadow-brand-blue/25 rounded-xl transition-all flex items-center justify-center gap-1 group/btn"
            >
              Enroll for ₹3,999
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
