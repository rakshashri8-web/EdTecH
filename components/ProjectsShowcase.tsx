"use client";

import { PROJECTS_LIST } from "@/lib/data";
import { Code2, ArrowUpRight, Cpu } from "lucide-react";

export default function ProjectsShowcase() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-brand-purple text-xs font-black uppercase tracking-wider mb-3">
            <Cpu className="w-4 h-4" />
            10 Real-World Industry Projects
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Build a Portfolio That Gets You Hired
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Work on production-grade systems evaluated by senior engineers, from RAG agents to automated predictive analytics engines.
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS_LIST.map((proj) => (
            <div
              key={proj.id}
              className="group bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:bg-white hover:border-brand-purple/40 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700">
                    {proj.course}
                  </span>
                  <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    proj.difficulty === "Beginner"
                      ? "bg-emerald-100 text-emerald-800"
                      : proj.difficulty === "Intermediate"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                  }`}>
                    {proj.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 group-hover:text-brand-purple transition-colors">
                  {proj.name}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {proj.description}
                </p>

                {/* Skill Tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {proj.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md bg-white text-[11px] font-bold text-slate-600 border border-slate-200"
                    >
                      #{skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Project #{proj.id}</span>
                <button className="inline-flex items-center gap-1 text-xs font-extrabold text-brand-purple hover:underline">
                  View Project <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
