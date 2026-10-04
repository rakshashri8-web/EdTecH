"use client";

import { useState } from "react";
import Link from "next/link";
import { LEARNING_STAGES } from "@/lib/data";
import { CheckCircle2, ArrowRight, Code, Database, Brain, Sparkles, Bot, Layers } from "lucide-react";

export default function LearningJourney() {
  const [activeStageId, setActiveStageId] = useState<number>(1);

  const activeStage = LEARNING_STAGES.find((stage) => stage.id === activeStageId) || LEARNING_STAGES[0];

  const stageIcons = [
    <Code key="1" className="w-6 h-6 text-blue-600" />,
    <Database key="2" className="w-6 h-6 text-purple-600" />,
    <Brain key="3" className="w-6 h-6 text-indigo-600" />,
    <Sparkles key="4" className="w-6 h-6 text-emerald-600" />,
    <Bot key="5" className="w-6 h-6 text-amber-600" />
  ];

  return (
    <section id="learning-path" className="py-20 bg-slate-50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-brand-blue text-xs font-black uppercase tracking-wider mb-3">
            <Layers className="w-4 h-4" />
            5-Stage Career Roadmap
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Your Step-by-Step Learning Journey
          </h2>
          <p className="mt-3 text-base text-slate-600">
            A structured, 5-stage progressive pathway taking you from programming basics to autonomous agentic AI development.
          </p>
        </div>

        {/* 5 Stage Step Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {LEARNING_STAGES.map((stage, idx) => {
            const isActive = stage.id === activeStageId;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className={`p-4 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between ${
                  isActive
                    ? "bg-white border-brand-blue shadow-lg shadow-brand-blue/10 scale-[1.02] ring-2 ring-brand-blue/20"
                    : "bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${isActive ? "bg-blue-50" : "bg-slate-100"}`}>
                    {stageIcons[idx]}
                  </div>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${isActive ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-500"}`}>
                    Stage {stage.id}
                  </span>
                </div>
                <div>
                  <h3 className={`text-sm font-black line-clamp-1 ${isActive ? "text-brand-blue" : "text-slate-800"}`}>
                    {stage.title.split("—")[1] || stage.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{stage.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Details Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl shadow-slate-200/50 transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Stage Left Summary */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-block px-3 py-1 bg-brand-blue/10 text-brand-blue text-xs font-extrabold rounded-lg">
                Stage {activeStage.id} of 5
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {activeStage.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {activeStage.description}
              </p>

              {/* Related Courses Chips */}
              <div className="pt-2">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                  Mapped LMS Courses
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeStage.relatedCourses.map((cName) => (
                    <span
                      key={cName}
                      className="px-3 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-full border border-slate-200"
                    >
                      {cName}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hands-On Projects */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                  Featured Projects
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeStage.projects.map((pName) => (
                    <span
                      key={pName}
                      className="px-3 py-1 bg-purple-50 text-purple-700 font-bold text-xs rounded-full border border-purple-200"
                    >
                      💻 {pName}
                    </span>
                  ))}
                </div>
              </div>

              {/* Explore Curriculum Button */}
              <div className="pt-4">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-extrabold text-white bg-brand-blue rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-brand-blue/20"
                >
                  Explore Stage Curriculum
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>

            {/* Stage Right Topics Grid */}
            <div className="lg:col-span-7 bg-slate-50 rounded-2xl p-6 border border-slate-200/80">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Topics & Modules Covered
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeStage.topics.map((topic, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-white rounded-xl border border-slate-200/60 shadow-sm flex items-start gap-3 hover:border-brand-blue/40 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-50 text-brand-blue text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-700 leading-snug">
                      {topic}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
