"use client";

import Link from "next/link";
import { Course } from "@/lib/types";
import { PROJECTS_LIST } from "@/lib/data";
import { Star, Clock, ArrowRight, BookOpen, Rocket, CheckCircle2 } from "lucide-react";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const hasValidPrice = typeof course.price === "number" && course.price > 0;
  const hasOriginalPrice = typeof course.original_price === "number" && course.original_price > course.price;
  
  const discountPercent = hasValidPrice && hasOriginalPrice
    ? Math.round(((course.original_price - course.price) / course.original_price) * 100)
    : 0;

  const modulesCount = course.modules_count || course.modules?.length || 10;
  const courseProjectsCount = PROJECTS_LIST.filter(p => p.course_slug === course.slug).length;
  const projectsCount = courseProjectsCount > 0 ? courseProjectsCount : (course.projects_count || 2);
  const techList = course.technologies && course.technologies.length > 0
    ? course.technologies.slice(0, 4)
    : ["Python", "SQL", "Power BI", "AI"];

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-lg shadow-slate-100 hover:shadow-2xl hover:shadow-brand-blue/15 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Thumbnail Image Header */}
      <Link href={`/courses/${course.slug}`} className="relative h-48 w-full overflow-hidden bg-slate-900 block">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-lg shadow-md uppercase tracking-wider">
            {discountPercent}% OFF
          </span>
        )}

        {/* Category Pill */}
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-900 font-extrabold text-[11px] px-3 py-1 rounded-full shadow-sm">
          {course.category}
        </span>

        {/* Rating Floating Tag */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-amber-400 border border-white/10">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>4.9 ★</span>
          <span className="text-slate-300 font-normal">| 120+ Reviews</span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Difficulty & Duration Pills */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold">
              {course.difficulty}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {course.duration}
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
          <div className="mt-3 flex items-center gap-4 text-xs font-bold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-brand-blue" />
              <span>{modulesCount} Modules</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Rocket className="w-3.5 h-3.5 text-purple-600" />
              <span>{projectsCount} Projects</span>
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
        <div className="pt-3 border-t border-slate-100 space-y-3">
          
          <div className="flex items-baseline justify-between">
            {hasValidPrice ? (
              <div>
                <span className="text-xl font-black text-slate-900">
                  ₹{course.price.toLocaleString("en-IN")}
                </span>
                {hasOriginalPrice && (
                  <span className="ml-2 text-xs font-medium text-slate-400 line-through">
                    ₹{course.original_price.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs font-bold text-slate-400 italic">Price not configured</span>
            )}
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Full Access
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/courses/${course.slug}`}
              className="py-2.5 text-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors block"
            >
              View Details
            </Link>
            <Link
              href={`/payment/${course.id}`}
              className="py-2.5 text-center text-xs font-extrabold text-white bg-gradient-to-r from-brand-blue to-brand-indigo hover:shadow-md hover:shadow-brand-blue/20 rounded-xl transition-all flex items-center justify-center gap-1"
            >
              Enroll Now
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}

