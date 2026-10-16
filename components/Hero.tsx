"use client";

import Link from "next/link";
import Image from "next/image";
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

          {/* Right Hero Visual Column with Mentor Portrait & Floating Badges */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Visual Container Frame (Responsive 3:4 portrait aspect ratio) */}
            <div className="relative w-[280px] xs:w-[310px] sm:w-[350px] lg:w-[370px]">
              
              {/* Ambient Glow Backdrop */}
              <div className="absolute -inset-2 sm:-inset-4 rounded-[2.5rem] bg-gradient-to-tr from-brand-blue/35 via-indigo-500/20 to-brand-purple/35 blur-2xl opacity-75 pointer-events-none" />
              
              {/* Premium Portrait Card Frame */}
              <div className="relative aspect-[3/4] w-full rounded-[2rem] overflow-hidden border-2 border-white/20 shadow-2xl bg-gradient-to-b from-slate-800 to-slate-950">
                <Image
                  src="/images/shaik-anwar.jpg"
                  alt="Shaik Anwar - Senior Data Scientist and Founder at AIMP"
                  fill
                  priority
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 350px, 370px"
                  className="object-cover object-top"
                />

                {/* Subtle Gradient Shadow Vignette at Bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

                {/* Mentor Identification Glass Badge */}
                <div className="absolute bottom-3 inset-x-3 bg-slate-900/85 backdrop-blur-md border border-white/15 rounded-2xl p-3 text-left shadow-lg">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 truncate">Lead Mentor & Founder</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-white leading-tight mt-0.5 truncate">Shaik Anwar</h3>
                      <p className="text-[11px] text-slate-300 font-medium truncate">Senior Data Scientist • Analytics with Annu</p>
                    </div>
                    <div className="shrink-0 px-2 py-1 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-black">
                      10+ Yrs Exp
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Card 1: Hands-on Projects */}
              <div className="hidden sm:flex absolute -top-3 -left-6 lg:-left-8 bg-white text-slate-800 px-3.5 py-2.5 rounded-2xl shadow-2xl border border-slate-100 items-center gap-2.5 animate-float-1 z-20">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-brand-blue flex items-center justify-center font-bold shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-medium">Practical Learning</p>
                  <p className="text-xs font-black">Hands-on Projects</p>
                </div>
              </div>

              {/* Floating Card 2: Certificates */}
              <div className="hidden sm:flex absolute -bottom-3 -left-6 lg:-left-8 bg-white text-slate-800 px-3.5 py-2.5 rounded-2xl shadow-2xl border border-slate-100 items-center gap-2.5 animate-float-2 z-20">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-brand-purple flex items-center justify-center font-bold shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-medium">Verified Credentials</p>
                  <p className="text-xs font-black">Certificates</p>
                </div>
              </div>

              {/* Floating Card 3: 10,000+ Students Mentored */}
              <div className="hidden sm:flex absolute top-12 -right-6 lg:-right-8 bg-white text-slate-800 px-3.5 py-2.5 rounded-2xl shadow-2xl border border-slate-100 items-center gap-2.5 animate-float-3 z-20">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-medium">Community Impact</p>
                  <p className="text-xs font-black">10,000+ Trained</p>
                </div>
              </div>

              {/* Mobile Badges Row (Clean alignment below portrait on small screens) */}
              <div className="sm:hidden mt-3 bg-white text-slate-800 px-3.5 py-2 rounded-xl shadow-lg border border-slate-100 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span className="font-bold text-[11px]">Certificates</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="font-bold text-[11px]">Projects</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-[11px]">10K+ Trained</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
