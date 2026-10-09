"use client";

import Link from "next/link";
import { ArrowRight, Play, CheckCircle, Award, TrendingUp, Briefcase, Star, Users, BookOpen, MessageSquare } from "lucide-react";
import { getWhatsAppLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";

interface HeroProps {
  stats?: {
    stages: number;
    topics: number;
    projects: number;
    practical: string;
  };
}

export default function Hero({ stats }: HeroProps) {
  const currentStats = stats || {
    stages: 5,
    topics: 150,
    projects: 10,
    practical: "100%",
  };

  return (
    <section className="relative overflow-hidden bg-brand-dark text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background Technology Pattern & Overlay */}
      <div className="absolute inset-0 tech-grid-pattern opacity-15 pointer-events-none" />
      <div className="absolute inset-0 tech-bg-overlay pointer-events-none" />

      {/* Floating Network Dots Background Accent */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue/20 border border-brand-blue/30 text-brand-blue text-xs font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
              LEARN • PRACTICE • BUILD • GROW
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
              Learn Skills. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                Build Projects.
              </span> <br />
              Get Career Ready.
            </h1>

            {/* Supporting Paragraph */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Industry-focused courses with hands-on projects, practical skills and certificates to help you grow from beginner to job-ready.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 text-base font-extrabold text-white bg-gradient-to-r from-brand-blue to-brand-indigo rounded-2xl shadow-lg shadow-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/40 hover:-translate-y-0.5 transition-all group"
              >
                Explore Courses
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={getWhatsAppLink(WHATSAPP_MESSAGES.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-base font-bold text-white bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 rounded-2xl backdrop-blur-md hover:-translate-y-0.5 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-[#25D366]" />
                WhatsApp Us
              </a>
              <Link
                href="#learning-path"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-base font-bold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl backdrop-blur-md hover:-translate-y-0.5 transition-all"
              >
                <Play className="w-4 h-4 fill-slate-200" />
                How It Works
              </Link>
            </div>

            {/* Live Stats Row (Preserving Prototype Values) */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="block text-2xl font-black text-blue-400">{currentStats.stages}</span>
                <span className="text-xs text-slate-400 font-medium">Learning Stages</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="block text-2xl font-black text-purple-400">{currentStats.topics}+</span>
                <span className="text-xs text-slate-400 font-medium">Topics Covered</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="block text-2xl font-black text-indigo-400">{currentStats.projects}+</span>
                <span className="text-xs text-slate-400 font-medium">Hands-On Projects</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="block text-2xl font-black text-emerald-400">{currentStats.practical}</span>
                <span className="text-xs text-slate-400 font-medium">Practical Learning</span>
              </div>
            </div>

          </div>

          {/* Right Hero Visual Column with Student Image & Floating Cards */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Visual Container Frame */}
            <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] lg:w-[420px] lg:h-[420px]">
              
              {/* Soft Gradient Blob Behind Student */}
              <div className="absolute inset-0 rounded-[45%_55%_50%_40%] bg-gradient-to-tr from-brand-blue/40 to-brand-purple/40 blur-xl animate-pulse" />
              
              {/* Person Circle Shadow Container */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-2xl overflow-hidden flex items-center justify-center">
                <img
                  src="/hero-student.png"
                  alt="EdTech Student Learning"
                  className="w-full h-full object-cover object-center filter drop-shadow-xl"
                />
              </div>

              {/* Floating Card 1: Hands-on Projects */}
              <div className="absolute top-4 -left-4 sm:-left-8 bg-white text-slate-800 px-4 py-3 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3 animate-float-1 z-20">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-brand-blue flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Practical Learning</p>
                  <p className="text-sm font-black">Hands-on Projects</p>
                </div>
              </div>

              {/* Floating Card 2: Certificates */}
              <div className="absolute bottom-16 -left-6 sm:-left-10 bg-white text-slate-800 px-4 py-3 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3 animate-float-2 z-20">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-brand-purple flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Verified Credentials</p>
                  <p className="text-sm font-black">Certificates</p>
                </div>
              </div>

              {/* Floating Card 3: Learning Progress */}
              <div className="absolute top-1/3 -right-6 sm:-right-8 bg-white text-slate-800 px-4 py-3 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3 animate-float-3 z-20">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Live LMS Tracking</p>
                  <p className="text-sm font-black">Learning Progress</p>
                </div>
              </div>

              {/* Floating Card 4: Career Ready */}
              <div className="absolute -bottom-4 right-8 bg-white text-slate-800 px-4 py-3 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3 animate-float-1 z-20">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Industry Outcome</p>
                  <p className="text-sm font-black">Career Ready</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
