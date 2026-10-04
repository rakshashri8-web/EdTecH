"use client";

import { INCLUDED_FEATURES } from "@/lib/data";
import { CheckCircle } from "lucide-react";

export default function WhatsIncluded() {
  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 tech-grid-pattern opacity-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-wider">
            Comprehensive Career Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-3">
            What&apos;s Included in Every Program
          </h2>
          <p className="mt-3 text-base text-slate-400">
            More than video lectures — gain complete end-to-end career guidance, interview preparation, and business case study mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INCLUDED_FEATURES.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-400/40 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-blue/30 to-brand-purple/30 text-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <h3 className="text-base font-extrabold text-white group-hover:text-blue-300 transition-colors">
                {feat.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
