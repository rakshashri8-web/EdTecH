"use client";

import { useState } from "react";
import { CourseModule } from "@/lib/types";
import { ChevronDown, ChevronUp, PlayCircle, Lock, Clock, Eye } from "lucide-react";

interface CurriculumAccordionProps {
  modules: CourseModule[];
}

export default function CurriculumAccordion({ modules }: CurriculumAccordionProps) {
  const [openModuleIds, setOpenModuleIds] = useState<string[]>(
    modules.length > 0 ? [modules[0].id] : []
  );

  const toggleModule = (id: string) => {
    setOpenModuleIds((prev) =>
      prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      {modules.map((mod, idx) => {
        const isOpen = openModuleIds.includes(mod.id);
        const lessonCount = mod.lessons?.length || 0;

        return (
          <div
            key={mod.id}
            className="border border-slate-200/80 rounded-2xl bg-white overflow-hidden shadow-sm transition-all duration-200"
          >
            {/* Module Header Button */}
            <button
              onClick={() => toggleModule(mod.id)}
              className="w-full px-6 py-4 flex items-center justify-between text-left bg-slate-50/70 hover:bg-slate-100/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-brand-blue/10 text-brand-blue text-xs font-black flex items-center justify-center">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900">
                    {mod.title}
                  </h4>
                  {mod.description && (
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {mod.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                  {lessonCount} {lessonCount === 1 ? "Lesson" : "Lessons"}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </button>

            {/* Expanded Lessons List */}
            {isOpen && (
              <div className="divide-y divide-slate-100 px-6 py-2">
                {mod.lessons && mod.lessons.length > 0 ? (
                  mod.lessons.map((lesson, lIdx) => (
                    <div
                      key={lesson.id}
                      className="py-3.5 flex items-center justify-between text-xs sm:text-sm font-medium text-slate-700 hover:text-brand-blue transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <PlayCircle className="w-4 h-4 text-brand-blue shrink-0" />
                        <span className="font-semibold">{lesson.title}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        {lesson.is_preview ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                            <Eye className="w-3 h-3" /> Preview
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
                            <Lock className="w-3 h-3" /> Enrolled
                          </span>
                        )}
                        <span className="text-xs text-slate-400 font-normal flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {lesson.duration}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-4 text-xs text-slate-400 italic">
                    Lessons will be unlocked upon enrollment.
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
