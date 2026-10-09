import Hero from "@/components/Hero";
import LearningJourney from "@/components/LearningJourney";
import CourseGrid from "@/components/CourseGrid";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import WhatsIncluded from "@/components/WhatsIncluded";
import HowEnrollmentWorks from "@/components/HowEnrollmentWorks";
import FAQ from "@/components/FAQ";
import { INITIAL_COURSES } from "@/lib/data";
import Link from "next/link";
import { ArrowRight, Award, CheckCircle2, Laptop, ShieldCheck, Sparkles, Target, Users, MessageSquare } from "lucide-react";
import { getWhatsAppLink, WHATSAPP_MESSAGES } from "@/lib/whatsapp";

export default async function HomePage() {
  // Try fetching courses from Supabase or fallback to INITIAL_COURSES
  let courses = INITIAL_COURSES;
  
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = createClient();
    const { data } = await supabase.from("courses").select("*").eq("published", true);
    if (data && data.length > 0) {
      courses = data;
    }
  } catch {
    courses = INITIAL_COURSES;
  }

  const whyUsFeatures = [
    {
      icon: Laptop,
      title: "100% Practical Learning",
      desc: "Learn by building real software and data pipelines instead of memorizing dry theory."
    },
    {
      icon: Target,
      title: "5-Stage Structured Pathway",
      desc: "From Python & SQL to LangChain, LangGraph, and autonomous Agentic AI systems."
    },
    {
      icon: Award,
      title: "Verified Industry Certificates",
      desc: "Earn shareable certificates upon completing 100% of lessons and portfolio projects."
    },
    {
      icon: Users,
      title: "Expert Career Guidance",
      desc: "Taught by Senior Data Scientist Shaik Anwar with resume reviews, mock interviews, and WhatsApp support."
    }
  ];

  return (
    <div className="space-y-0">
      
      {/* 1. Hero Section */}
      <Hero
        stats={{
          stages: 5,
          topics: 150,
          projects: 10,
          practical: "100%",
        }}
      />

      {/* 2. Why Learn With Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-brand-blue text-xs font-black uppercase tracking-wider">
              Why Choose EdTech
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              Designed for Job-Ready Career Growth
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              Everything you need to master modern Data Science and AI engineering skills.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUsFeatures.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:shadow-xl hover:shadow-brand-blue/10 hover:border-brand-blue/30 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-100/70 text-brand-blue flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-brand-blue transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. 5-Stage Interactive Learning Journey */}
      <LearningJourney />

      {/* 4. Featured Courses Grid */}
      <section id="courses" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1.5 rounded-full bg-purple-50 text-brand-purple text-xs font-black uppercase tracking-wider">
              Curriculum Programs
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              Explore Industry-Focused Courses
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              Prices fetched dynamically from Supabase database. Select your course to enroll.
            </p>
          </div>

          <CourseGrid courses={courses} />
        </div>
      </section>

      {/* 5. Projects Showcase */}
      <ProjectsShowcase />

      {/* 6. What's Included */}
      <WhatsIncluded />

      {/* 7. How Enrollment Works */}
      <section className="bg-slate-50 border-t border-slate-200/60">
        <HowEnrollmentWorks showCardWrapper={true} />
      </section>

      {/* 8. Student Testimonials */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
              Student Success Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              Trusted by 10,000+ Learners
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              See how our students transitioned into Data Analysts, Data Scientists, and AI Engineers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex text-amber-400 gap-1 text-sm font-bold">★★★★★</div>
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                &quot;The Analytics with Annu curriculum is incredible. The 5-stage learning path took me from basic Python to building RAG chatbots and Agentic AI workflows!&quot;
              </p>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-sm font-black text-slate-900">Rahul Sharma</p>
                <p className="text-xs text-slate-400">Data Analyst at TechCorp</p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex text-amber-400 gap-1 text-sm font-bold">★★★★★</div>
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                &quot;The manual UPI payment verification was super smooth. Got verified in an hour and unlocked all video modules. Shaik Anwar sir&apos;s project guidance is top-notch!&quot;
              </p>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-sm font-black text-slate-900">Priya Patel</p>
                <p className="text-xs text-slate-400">AI/ML Associate</p>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex text-amber-400 gap-1 text-sm font-bold">★★★★★</div>
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                &quot;Building 10 real projects gave me confidence during interviews. The resume review and LinkedIn optimization helped me get 3 callbacks in two weeks.&quot;
              </p>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-sm font-black text-slate-900">Ankit Verma</p>
                <p className="text-xs text-slate-400">GenAI Engineer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <FAQ />

      {/* 9. Final CTA */}
      <section className="py-20 bg-gradient-to-r from-brand-blue via-brand-indigo to-brand-purple text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ready to Accelerate Your Career in Data & AI?
          </h2>
          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto font-normal">
            Join thousands of learners mastering practical skills, hands-on projects, and earning verified certificates.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/courses"
              className="px-8 py-4 bg-white text-brand-blue font-extrabold text-base rounded-2xl shadow-xl hover:bg-slate-100 transition-all flex items-center gap-2"
            >
              Get Started Now <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href={getWhatsAppLink(WHATSAPP_MESSAGES.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-base rounded-2xl shadow-xl hover:shadow-emerald-500/30 transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
