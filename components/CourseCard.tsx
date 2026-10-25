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

const COURSE_IMAGES: Record<string, string> = {
  "data-analyst": "/images/courses/data_analyst_493x266(2).png",
  "course-1": "/images/courses/data_analyst_493x266(2).png",
  "data-science": "/images/courses/data_science_493x266(2).png",
  "course-2": "/images/courses/data_science_493x266(2).png",
  "ai-ml-engineer": "/images/courses/ai_ml_493x266(2).png",
  "ai-ml": "/images/courses/ai_ml_493x266(2).png",
  "course-3": "/images/courses/ai_ml_493x266(2).png",
  "genai-engineer": "/images/courses/gen_ai_493x266(2).png",
  "generative-ai-engineer": "/images/courses/gen_ai_493x266(2).png",
  "course-4": "/images/courses/gen_ai_493x266(2).png",
  "agentic-ai-engineer": "/images/courses/agentic_ai_493x266(2).png",
  "course-5": "/images/courses/agentic_ai_493x266(2).png",
};

export default function CourseCard({ course }: CourseCardProps) {
  const imageSrc = COURSE_IMAGES[course.slug] || COURSE_IMAGES[course.id] || course.thumbnail || "/images/courses/data_analyst_493x266(2).png";

  const modulesCount = course.modules_count || course.modules?.length || 10;
  const courseProjectsCount = PROJECTS_LIST.filter(p => p.course_slug === course.slug).length;
  const projectsCount = courseProjectsCount > 0 ? courseProjectsCount : (course.projects_count || 2);
  const techList = course.technologies && course.technologies.length > 0
    ? course.technologies.slice(0, 4)
    : ["Python", "SQL", "Power BI", "AI"];

  const currentPrice = 3999;

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-lg shadow-slate-100 hover:shadow-2xl hover:shadow-brand-blue/15 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Thumbnail Image Header with exact 493x266 dimensions */}
      <Link href={`/courses/${course.slug}`} className="relative aspect-[493/266] w-full overflow-hidden bg-slate-900 block group/img">
        <img
          src={imageSrc}
          alt={course.title}
          width={493}
          height={266}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Pill */}
        <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-white font-extrabold text-[11px] px-3 py-1 rounded-full shadow-md border border-white/20">
          {course.category}
        </span>
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
