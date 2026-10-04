"use client";

import { useState } from "react";
import Link from "next/link";
import { LEARNING_STAGES, PROJECTS_LIST } from "@/lib/data";
import { CheckCircle2, ArrowRight, Code, Database, Brain, Sparkles, Bot, Layers, Wrench, Target, Trophy, HelpCircle } from "lucide-react";

export default function LearningPathPage() {
  const [selectedStageId, setSelectedStageId] = useState<number>(1);

  const activeStage = LEARNING_STAGES.find((s) => s.id === selectedStageId) || LEARNING_STAGES[0];

  const stageIcons = [
    <Code key="1" className="w-6 h-6 text-blue-600" />,
    <Database key="2" className="w-6 h-6 text-purple-600" />,
    <Brain key="3" className="w-6 h-6 text-indigo-600" />,
    <Sparkles key="4" className="w-6 h-6 text-emerald-600" />,
    <Bot key="5" className="w-6 h-6 text-amber-600" />
  ];

  const stageProjects = PROJECTS_LIST.slice((selectedStageId - 1) * 2, selectedStageId * 2);

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-brand-blue text-xs font-black uppercase tracking-wider">
            <Layers className="w-4 h-4" /> 5-Stage Progressive Roadmap
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Complete Career Learning Path
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Follow our battle-tested 5-stage roadmap from foundational Python & Data Analysis to autonomous Agentic AI systems.
          </p>
        </div>

        {/* 5-Stage Sequence Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {LEARNING_STAGES.map((stage, idx) => {
            const isSelected = stage.id === selectedStageId;
            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStageId(stage.id)}
                className={`p-5 rounded-3xl text-left border transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? "bg-white border-brand-blue shadow-xl shadow-brand-blue/15 ring-2 ring-brand-blue/20 scale-[1.02]"
                    : "bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${isSelected ? "bg-blue-50" : "bg-slate-100"}`}>
                    {stageIcons[idx]}
                  </div>
                  <span className={`text-xs font-black px-3 py-1 rounded-full ${isSelected ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-600"}`}>
                    Stage {stage.id}
                  </span>
                </div>
                <div>
                  <h3 className={`text-base font-black ${isSelected ? "text-brand-blue" : "text-slate-900"}`}>
                    {stage.title.split("—")[1] || stage.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{stage.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Expanded View */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl space-y-10">
          
          {/* Header Summary */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
            <div className="space-y-2">
              <span className="px-3.5 py-1 bg-brand-blue/10 text-brand-blue text-xs font-extrabold rounded-lg">
                Stage {activeStage.id} of 5 Details
              </span>
              <h2 className="text-3xl font-black text-slate-900">{activeStage.title}</h2>
              <p className="text-slate-600 max-w-2xl text-sm leading-relaxed">{activeStage.description}</p>
            </div>

            <Link
              href="/courses"
              className="px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-indigo text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 shrink-0"
            >
              Explore Stage Courses
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid Information Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Col 1: Key Topics */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Key Topics & Modules
              </h3>
              <ul className="space-y-2.5">
                {activeStage.topics.map((t, idx) => (
                  <li key={idx} className="p-3 bg-white rounded-xl border border-slate-200/60 text-xs font-semibold text-slate-700 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-brand-blue font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 2: Technologies & Skills */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-purple-600" /> Technologies & Tools
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activeStage.technologies.map((tech) => (
                    <span key={tech} className="px-3 py-1.5 bg-white text-slate-800 text-xs font-bold rounded-xl border border-slate-200 shadow-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200/60">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-600" /> Practical Skills Gained
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activeStage.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 bg-blue-50 text-brand-blue text-xs font-bold rounded-xl border border-blue-100">
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Col 3: Real Projects & Outcomes */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" /> Stage Real Projects
                </h3>
                <div className="space-y-2">
                  {stageProjects.map((p) => (
                    <div key={p.id} className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-900">{p.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md">
                          {p.difficulty}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{p.description}</p>
                      <div className="pt-1 flex items-center justify-between">
                        <Link href={`/projects/${p.id}`} className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1">
                          Build Project <ArrowRight className="w-3 h-3" />
                        </Link>
                        <Link href={`/projects/${p.id}/assessment`} className="text-[11px] font-bold text-purple-600 hover:underline">
                          Take Assessment
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
