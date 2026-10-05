import { notFound } from "next/navigation";
import Link from "next/link";
import CurriculumAccordion from "@/components/CurriculumAccordion";
import CourseCard from "@/components/CourseCard";
import { INITIAL_COURSES, INSTRUCTOR_INFO, PROJECTS_LIST } from "@/lib/data";
import { Course, CourseModule, ProjectItem } from "@/lib/types";
import { CheckCircle2, Clock, Award, Star, ArrowRight, User, Code2, Target, Sparkles, BookOpen, Rocket, Wrench, FileCode } from "lucide-react";
import HowEnrollmentWorks from "@/components/HowEnrollmentWorks";

interface CourseDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = params;

  let course: Course | null = INITIAL_COURSES.find((c) => c.slug === slug) || null;
  let modules: CourseModule[] = [];

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = createClient();
    
    const { data: courseData } = await supabase
      .from("courses")
      .select("*")
      .eq("slug", slug)
      .single();

    if (courseData) {
      course = {
        ...courseData,
        outcomes: courseData.outcomes || course?.outcomes,
        prerequisites: courseData.prerequisites || course?.prerequisites,
        target_audience: courseData.target_audience || course?.target_audience,
        technologies: courseData.technologies || course?.technologies,
        modules: course?.modules,
      };

      const { data: moduleData } = await supabase
        .from("course_modules")
        .select("*, lessons(*)")
        .eq("course_id", courseData.id)
        .order("order", { ascending: true });

      if (moduleData && moduleData.length > 0) {
        modules = moduleData;
      }
    }
  } catch {
    // Fallback if DB fetch fails
  }

  if (!course) {
    notFound();
  }

  // Use full modules list from initial course data if DB modules not yet populated
  if (modules.length === 0) {
    modules = course.modules || [];
  }

  // Calculate actual dynamic counts
  const actualModuleCount = modules.length;
  const actualLessonCount = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);

  // Map related projects for this specific course
  const courseProjects: ProjectItem[] = PROJECTS_LIST.filter(
    (p) => p.course_slug === course?.slug || p.course.toLowerCase() === course.title.toLowerCase()
  ).sort((a, b) => (a.project_order || 0) - (b.project_order || 0));

  const discountPercent = Math.round(
    ((course.original_price - course.price) / course.original_price) * 100
  );

  const defaultOutcomes = [
    "Master practical hands-on workflows for real-world industry project development.",
    "Build end-to-end production pipelines, executive dashboards, and automated AI tools.",
    "Apply industry-standard code design, error handling, and performance optimization.",
    "Solve 10+ real-world industry problems from finance, retail, and tech domains.",
    "Prepare resume-ready capstone portfolio projects for top tech roles.",
    "Earn a verified certificate of completion backed by EdTech LMS."
  ];

  const outcomes = course.outcomes && course.outcomes.length > 0 ? course.outcomes : defaultOutcomes;
  const techStack = course.technologies && course.technologies.length > 0 ? course.technologies : ["Python", "SQL", "Pandas", "Power BI", "Git", "Docker"];
  const prerequisites = course.prerequisites && course.prerequisites.length > 0 ? course.prerequisites : [
    "Basic computer literacy and web browsing skills.",
    "No prior programming experience required for beginner modules.",
    "Willingness to spend 4-6 hours per week practicing code."
  ];
  const targetAudience = course.target_audience && course.target_audience.length > 0 ? course.target_audience : [
    "Aspiring Data Scientists, Analysts, and AI Engineers.",
    "Software Developers looking to upskill in Machine Learning & GenAI.",
    "Working professionals seeking high-growth tech career transitions."
  ];

  const recommendedCourses = INITIAL_COURSES.filter((c) => c.id !== course?.id).slice(0, 3);

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Hero Header Card */}
        <div className="bg-gradient-to-r from-slate-950 via-brand-dark to-slate-900 text-white p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-brand-blue text-white text-xs font-black rounded-full uppercase tracking-wider">
                  {course.category}
                </span>
                <span className="px-3 py-1 bg-white/10 text-slate-300 text-xs font-bold rounded-full">
                  {course.difficulty} Level
                </span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {course.duration}
                </span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> {actualModuleCount} Modules ({actualLessonCount} Lessons)
                </span>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full flex items-center gap-1">
                  <Rocket className="w-3.5 h-3.5" /> {courseProjects.length} Real Projects
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                {course.description}
              </p>

              {/* Technologies Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
                  <Code2 className="w-3.5 h-3.5 text-brand-blue" /> Tech Stack:
                </span>
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 bg-white/10 text-white text-xs font-semibold rounded-lg border border-white/10"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-blue" />
                  <span>Instructor: <strong className="text-white">{course.instructor_name || INSTRUCTOR_INFO.name}</strong> ({course.instructor_role || INSTRUCTOR_INFO.role})</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>4.9 / 5.0 Rating (120+ Student Reviews)</span>
                </div>
              </div>
            </div>

            {/* Price & Action Card */}
            <div className="lg:col-span-4 bg-white text-slate-900 p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-100 text-center space-y-5">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Program Investment</span>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-4xl font-black text-slate-900">
                    ₹{course.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm font-medium text-slate-400 line-through">
                    ₹{course.original_price.toLocaleString("en-IN")}
                  </span>
                </div>
                {discountPercent > 0 && (
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-black rounded-full">
                    Save {discountPercent}% Today
                  </span>
                )}
              </div>

              <Link
                href={`/payment/${course.id}`}
                className="w-full py-4 text-center text-sm font-extrabold text-white bg-gradient-to-r from-brand-blue to-brand-indigo rounded-2xl shadow-lg shadow-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/40 transition-all flex items-center justify-center gap-2 group"
              >
                Enroll in Program Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="text-[11px] text-slate-500 space-y-1.5 border-t border-slate-100 pt-4 text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Lifetime Access to 10 Modules & 40 Lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{courseProjects.length} Portfolio Capstone Projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Verified Digital Certificate of Completion</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Manual UPI QR Payment & Instant Admin Approval</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 space-y-10">
            
            {/* What You'll Learn (Detailed Outcomes) */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-brand-blue font-extrabold text-sm uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> Learning Outcomes
              </div>
              <h3 className="text-2xl font-black text-slate-900">What You&apos;ll Learn in This Course</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {outcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Complete Curriculum Accordion */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-brand-blue font-extrabold text-sm uppercase tracking-wider">
                    <BookOpen className="w-4 h-4" /> Complete Syllabus
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">Full 10-Module Curriculum</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Expand every module to inspect lessons, video duration, and free preview topics.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-extrabold text-brand-blue bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
                    {actualModuleCount} Modules
                  </span>
                  <span className="text-xs font-extrabold text-purple-700 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-full">
                    {actualLessonCount} Lessons
                  </span>
                </div>
              </div>

              <CurriculumAccordion modules={modules} />
            </div>

            {/* REAL-WORLD PROJECTS SECTION */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-amber-600 font-extrabold text-sm uppercase tracking-wider">
                  <Rocket className="w-4 h-4" /> Portfolio Capstones
                </div>
                <h3 className="text-2xl font-black text-slate-900 mt-1">Course Real-World Projects</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Build and submit code repositories for every project below to prove real understanding.
                </p>
              </div>

              {courseProjects.length > 0 ? (
                <div className="space-y-6">
                  {courseProjects.map((p, idx) => (
                    <div key={p.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 hover:border-brand-blue/40 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-xl bg-brand-blue text-white font-black text-xs flex items-center justify-center">
                            #{p.project_order || idx + 1}
                          </span>
                          <h4 className="text-lg font-black text-slate-900">{p.name}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg">
                            {p.difficulty} Level
                          </span>
                          <span className="text-xs font-bold px-2.5 py-1 bg-purple-100 text-purple-800 rounded-lg">
                            {p.course}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        {p.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                          <strong className="text-slate-900 block text-xs uppercase tracking-wider text-brand-blue">Problem Statement</strong>
                          <p className="text-slate-600 leading-relaxed">{p.problem_statement}</p>
                        </div>

                        <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                          <strong className="text-slate-900 block text-xs uppercase tracking-wider text-purple-600">Real-World Use Case</strong>
                          <p className="text-slate-600 leading-relaxed">{p.real_world_use_case}</p>
                        </div>
                      </div>

                      {/* Modules Used Section */}
                      {p.required_modules && p.required_modules.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Modules Used</span>
                          <div className="flex flex-wrap gap-1.5">
                            {p.required_modules.map((mod) => (
                              <span key={mod} className="px-2.5 py-1 bg-amber-50 text-amber-900 text-xs font-bold rounded-lg border border-amber-200/80">
                                {mod}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">Technologies & Skills Used</span>
                        <div className="flex flex-wrap gap-1.5">
                          {p.technologies.map((tech) => (
                            <span key={tech} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
                              {tech}
                            </span>
                          ))}
                          {p.skills.map((skill) => (
                            <span key={skill} className="px-2.5 py-1 bg-blue-50 text-brand-blue text-xs font-bold rounded-lg border border-blue-200">
                              ✓ {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/60">
                        <Link
                          href={`/projects/${p.id}`}
                          className="px-5 py-2.5 bg-brand-blue text-white text-xs font-extrabold rounded-xl shadow-md hover:bg-blue-700 transition-colors flex items-center gap-1.5"
                        >
                          View Project & Submit Code <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/projects/${p.id}/assessment`}
                          className="px-4 py-2 bg-purple-50 text-purple-700 text-xs font-extrabold rounded-xl border border-purple-200 hover:bg-purple-100 transition-colors"
                        >
                          Take 7-Section Assessment
                        </Link>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 font-bold text-center">
                  All course capstone projects are available in the learning path dashboard.
                </div>
              )}
            </div>

            {/* Prerequisites & Target Audience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
                  <Code2 className="w-4 h-4" /> Requirements
                </div>
                <h4 className="text-lg font-black text-slate-900">Prerequisites</h4>
                <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5">
                  {prerequisites.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                  <Target className="w-4 h-4" /> Who Should Take This
                </div>
                <h4 className="text-lg font-black text-slate-900">Target Audience</h4>
                <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5">
                  {targetAudience.map((target, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <span>{target}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Right Sidebar: Instructor & Certificate */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Instructor Profile Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                Lead Program Mentor
              </span>
              <div className="flex items-center gap-4">
                <img
                  src={INSTRUCTOR_INFO.avatar}
                  alt={INSTRUCTOR_INFO.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
                />
                <div>
                  <h4 className="text-base font-black text-slate-900">{INSTRUCTOR_INFO.name}</h4>
                  <p className="text-xs font-bold text-brand-blue">{INSTRUCTOR_INFO.role}</p>
                  <p className="text-[11px] text-slate-400">{INSTRUCTOR_INFO.program}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {INSTRUCTOR_INFO.bio}
              </p>
            </div>

            {/* Certificate Preview Card */}
            <div className="bg-gradient-to-br from-slate-900 to-brand-navy text-white p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-amber-400">
                <Award className="w-6 h-6" />
                <span className="text-xs font-extrabold uppercase tracking-wider">Earn Your Certificate</span>
              </div>
              <h4 className="text-lg font-black text-white">
                Official Industry Credential
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Complete 100% of lessons and submit required portfolio projects to receive your shareable digital certificate.
              </p>
              <div className="p-3 bg-white/10 rounded-2xl border border-white/15 text-center text-xs font-mono font-bold text-slate-200">
                ID: EDTECH-{course.slug.toUpperCase()}-VERIFIED
              </div>
            </div>

          </div>

        </div>

        {/* How Enrollment Works Section */}
        <div className="pt-12 border-t border-slate-200">
          <HowEnrollmentWorks showCardWrapper={false} />
        </div>

        {/* You May Also Like Section */}
        {recommendedCourses.length > 0 && (
          <div className="pt-12 border-t border-slate-200 space-y-6">
            <div>
              <span className="text-xs font-extrabold text-brand-blue uppercase tracking-wider">Recommended Next</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">You May Also Like</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedCourses.map((recCourse) => (
                <CourseCard key={recCourse.id} course={recCourse} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
