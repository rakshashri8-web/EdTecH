"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Play, Award, BookOpen, Clock, ShieldCheck, Trophy, CheckCircle2, 
  ArrowRight, Brain, Sparkles, Layers, CreditCard, ExternalLink, 
  Copy, Check, MessageSquare, AlertCircle, Eye, X, ChevronRight
} from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { AuthUser } from "@/lib/auth";
import { Enrollment, ProjectAssessment, Certificate, Course } from "@/lib/types";
import { INITIAL_COURSES } from "@/lib/data";

interface DashboardContentProps {
  user: AuthUser;
  enrollments: Enrollment[];
  userProgress: { course_id: string; lesson_id: string }[];
  userAssessments: ProjectAssessment[];
  certificates: (Certificate & { course?: Course })[];
}

export default function DashboardContent({
  user,
  enrollments,
  userProgress,
  userAssessments,
  certificates,
}: DashboardContentProps) {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);

  // Sync with URL query parameter or hash on mount and change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (["overview", "my-courses", "learning-path", "certificates", "payments"].includes(hash)) {
        setActiveTab(hash);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    window.history.pushState(null, "", `#${tabId}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUtr(text);
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  const approvedEnrollments = enrollments.filter((e) => e.status === "approved");
  const pendingEnrollments = enrollments.filter((e) => e.status === "pending");
  const enrolledCount = approvedEnrollments.length;
  const completedLessonsCount = userProgress.length;
  const totalHoursLearned = Math.round(completedLessonsCount * 0.5);
  const assessmentsCount = userAssessments.length;
  const avgAssessmentScore = assessmentsCount > 0
    ? Math.round(userAssessments.reduce((acc, curr) => acc + curr.score, 0) / assessmentsCount)
    : 85;

  const currentCourse = approvedEnrollments.length > 0
    ? approvedEnrollments[0].course || INITIAL_COURSES[0]
    : null;

  return (
    <div className="py-8 sm:py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Welcome back, {user.full_name || "Learner"}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Student Account: <span className="font-semibold text-slate-800">{user.email}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="px-4 py-2.5 bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" /> Admin Panel
              </Link>
            )}
            <button
              onClick={() => handleTabChange("learning-path")}
              className="px-4 py-2.5 bg-purple-600 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-purple-700 transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" /> 5-Stage Path
            </button>
            <Link
              href="/courses"
              className="px-5 py-2.5 bg-brand-blue text-white font-extrabold text-xs rounded-xl shadow-md shadow-brand-blue/20 hover:bg-blue-700 transition-colors"
            >
              + Browse Courses
            </Link>
          </div>
        </div>

        {/* Dashboard Layout: Sidebar + Main Dynamic Tab Panel */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <DashboardSidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            enrolledCount={approvedEnrollments.length}
            pendingCount={pendingEnrollments.length}
            certificatesCount={certificates.length}
          />

          {/* Dynamic Tab Views */}
          <div className="flex-1 space-y-8 w-full min-w-0">
            
            {/* ============================================================== */}
            {/* TAB 1: OVERVIEW (DASHBOARD)                                    */}
            {/* ============================================================== */}
            {activeTab === "overview" && (
              <div className="space-y-8 animate-in fade-in duration-200">
                
                {/* 6-Metric Statistics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                  <div 
                    onClick={() => handleTabChange("my-courses")}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-brand-blue/40 transition-colors"
                  >
                    <span className="block text-2xl font-black text-slate-900">{enrolledCount}</span>
                    <span className="text-[11px] font-bold text-slate-500">Enrolled Courses</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="block text-2xl font-black text-brand-blue">{totalHoursLearned}h</span>
                    <span className="text-[11px] font-bold text-slate-500">Hours Learned</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="block text-2xl font-black text-emerald-600">{completedLessonsCount}</span>
                    <span className="text-[11px] font-bold text-slate-500">Lessons Finished</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="block text-2xl font-black text-purple-600">{assessmentsCount}</span>
                    <span className="text-[11px] font-bold text-slate-500">Projects Assessed</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="block text-2xl font-black text-amber-500">{avgAssessmentScore}%</span>
                    <span className="text-[11px] font-bold text-slate-500">Avg Test Score</span>
                  </div>
                  <div 
                    onClick={() => handleTabChange("certificates")}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-brand-blue/40 transition-colors"
                  >
                    <span className="block text-2xl font-black text-indigo-600">{certificates.length}</span>
                    <span className="text-[11px] font-bold text-slate-500">Certificates</span>
                  </div>
                </div>

                {/* Pending Payment Alert if any */}
                {pendingEnrollments.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-6 h-6 text-amber-600 shrink-0" />
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-amber-900">
                          UPI Payment Verification Pending ({pendingEnrollments.length})
                        </p>
                        <p className="text-[11px] sm:text-xs text-amber-700 mt-0.5">
                          UTR <strong className="font-mono">{pendingEnrollments[0].utr}</strong> is being verified by admin. Full video access will unlock once approved.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleTabChange("payments")}
                      className="px-4 py-2 bg-amber-600 text-white font-extrabold text-xs rounded-xl hover:bg-amber-700 shrink-0 shadow-sm"
                    >
                      View Payment Status &rarr;
                    </button>
                  </div>
                )}

                {/* Continue Learning Featured Card */}
                {currentCourse && (
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-brand-blue text-[10px] font-extrabold uppercase">
                          Currently Learning
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">• {currentCourse.category}</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900">{currentCourse.title}</h3>
                      
                      <div className="space-y-1.5 max-w-md">
                        <div className="flex justify-between text-xs font-bold text-slate-500">
                          <span>Overall Progress</span>
                          <span>{completedLessonsCount} lessons finished</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-brand-blue to-brand-purple rounded-full"
                            style={{ width: `${Math.min(100, Math.round((completedLessonsCount / 10) * 100))}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/learn/${currentCourse.slug || currentCourse.id}`}
                      className="px-6 py-3.5 bg-gradient-to-r from-brand-blue to-brand-indigo text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-brand-blue/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 shrink-0"
                    >
                      <Play className="w-4 h-4 fill-white" /> Resume Lesson
                    </Link>
                  </div>
                )}

                {/* 5-Stage Roadmap Tracker Widget */}
                <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-brand-navy text-white p-6 sm:p-8 rounded-3xl border border-white/10 shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wider block">Career Roadmap</span>
                      <h3 className="text-lg sm:text-xl font-black text-white">5-Stage Learning Pathway Status</h3>
                    </div>
                    <button 
                      onClick={() => handleTabChange("learning-path")}
                      className="text-xs font-extrabold text-brand-blue bg-white px-3.5 py-1.5 rounded-full hover:bg-slate-100 transition-colors"
                    >
                      View Details &rarr;
                    </button>
                  </div>

                  <div className="grid grid-cols-5 gap-2 pt-2">
                    {[
                      { stage: 1, label: "Python & SQL" },
                      { stage: 2, label: "Machine Learning" },
                      { stage: 3, label: "Deep Learning" },
                      { stage: 4, label: "GenAI & RAG" },
                      { stage: 5, label: "Agentic AI" }
                    ].map((item) => {
                      const isUnlocked = item.stage <= (enrolledCount || 1);
                      return (
                        <div 
                          key={item.stage} 
                          className={`p-3 rounded-2xl border text-center transition-all ${
                            isUnlocked 
                              ? "bg-brand-blue/20 border-brand-blue text-white font-bold" 
                              : "bg-white/5 border-white/10 text-slate-400 opacity-60"
                          }`}
                        >
                          <span className="text-[10px] font-extrabold uppercase block">Stage {item.stage}</span>
                          <span className="text-xs font-black mt-1 block truncate">{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Project Assessment Scores Section */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-600" />
                        Project Knowledge Assessments
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Real understanding scores from 7-section project testing suites.
                      </p>
                    </div>
                    <Link href="/learning-path" className="text-xs font-bold text-brand-blue hover:underline">
                      Take Next Assessment &rarr;
                    </Link>
                  </div>

                  {userAssessments.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {userAssessments.map((a) => (
                        <div key={a.id || Math.random()} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="text-xs font-black text-slate-900 block">Project #{a.project_id}</span>
                            <span className="text-[11px] font-semibold text-slate-500">
                              Score: <strong className="text-slate-900">{a.score}%</strong>
                            </span>
                          </div>
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${a.score >= 70 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                            {a.score >= 70 ? "Passed ✓" : "Review Needed"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <span>No project assessments taken yet. Practice real-world project knowledge tests.</span>
                      <Link href="/projects/1/assessment" className="px-3.5 py-1.5 bg-purple-600 text-white font-extrabold rounded-xl text-xs shrink-0">
                        Try Sample Test
                      </Link>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 2: MY COURSES                                              */}
            {/* ============================================================== */}
            {activeTab === "my-courses" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">My Enrolled Courses</h2>
                      <p className="text-xs text-slate-500 mt-1">Access all your approved and active learning curriculum.</p>
                    </div>
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-full">
                      {approvedEnrollments.length} Active Courses
                    </span>
                  </div>

                  {approvedEnrollments.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {approvedEnrollments.map((item) => {
                        const c = item.course || INITIAL_COURSES.find(crs => crs.id === item.course_id || crs.slug === item.course_id) || INITIAL_COURSES[0];
                        const cProgress = userProgress.filter((p) => p.course_id === c.id);
                        const lessonsCompleted = cProgress.length;
                        const estimatedTotalLessons = 10;
                        const percent = Math.min(100, Math.round((lessonsCompleted / estimatedTotalLessons) * 100));

                        return (
                          <div
                            key={item.id}
                            className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-blue/50 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                          >
                            <div className="space-y-3 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-blue-100 text-brand-blue">
                                  {c.category}
                                </span>
                                <span className="text-xs font-medium text-slate-400">• {c.duration}</span>
                              </div>
                              <h3 className="text-lg font-black text-slate-900">{c.title}</h3>
                              <p className="text-xs text-slate-500 line-clamp-1">{c.description}</p>
                              
                              {/* Progress Bar */}
                              <div className="w-full max-w-md space-y-1 pt-1">
                                <div className="flex justify-between text-[11px] font-bold text-slate-500">
                                  <span>Progress</span>
                                  <span>{lessonsCompleted} lessons completed ({percent}%)</span>
                                </div>
                                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-brand-blue to-brand-purple rounded-full transition-all duration-300"
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>
                              </div>
                            </div>

                            <Link
                              href={`/learn/${c.slug || c.id}`}
                              className="px-6 py-3 bg-brand-blue text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2 shrink-0"
                            >
                              <Play className="w-4 h-4 fill-white" /> Continue Learning
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-4">
                      <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
                      <div className="space-y-1">
                        <p className="text-base font-bold text-slate-800">No active unlocked courses yet.</p>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                          Enroll in a course and complete your manual UPI payment to unlock full video access.
                        </p>
                      </div>
                      <Link
                        href="/courses"
                        className="inline-block px-6 py-3 bg-brand-blue text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-blue-700 transition-colors"
                      >
                        Browse Courses
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 3: LEARNING PATH                                           */}
            {/* ============================================================== */}
            {activeTab === "learning-path" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-[11px] font-extrabold uppercase">
                        Career Roadmap
                      </span>
                      <h2 className="text-2xl font-black text-slate-900 mt-2">5-Stage Career Pathway</h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Complete curriculum from data fundamentals to building autonomous multi-agent AI systems.
                      </p>
                    </div>
                    <Link
                      href="/learning-path"
                      className="px-4 py-2 bg-purple-50 text-purple-700 font-extrabold text-xs rounded-xl border border-purple-200 hover:bg-purple-100 flex items-center gap-1.5"
                    >
                      Full Curriculum Page <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="space-y-4 pt-2">
                    {[
                      {
                        stage: 1,
                        title: "Python, SQL & Data Foundations",
                        desc: "Master Python fundamentals, advanced SQL querying, data cleaning with Pandas, and exploratory data analysis.",
                        skills: ["Python", "SQL", "Pandas", "NumPy", "EDA"],
                        project: "E-Commerce Customer Analytics Dashboard",
                      },
                      {
                        stage: 2,
                        title: "Machine Learning & Predictive Modeling",
                        desc: "Build supervised and unsupervised ML models, feature engineering, Scikit-Learn pipelines, and model evaluation.",
                        skills: ["Scikit-Learn", "Regression", "Classification", "Clustering", "XGBoost"],
                        project: "Loan Default Risk Prediction System",
                      },
                      {
                        stage: 3,
                        title: "Deep Learning, PyTorch & Computer Vision / NLP",
                        desc: "Neural network architectures with PyTorch, Convolutional Neural Networks, transfer learning, and Transformers.",
                        skills: ["PyTorch", "CNNs", "RNNs", "Transformers", "HuggingFace"],
                        project: "Medical Image Classification & Diagnosis",
                      },
                      {
                        stage: 4,
                        title: "Generative AI, LLMs & Advanced RAG Systems",
                        desc: "Build context-aware Generative AI applications with LangChain, LlamaIndex, Vector Databases, and hybrid search.",
                        skills: ["LangChain", "Vector DBs", "LlamaIndex", "OpenAI", "Prompt Engineering"],
                        project: "Enterprise Knowledge Base Chatbot",
                      },
                      {
                        stage: 5,
                        title: "Autonomous Agentic AI & Multi-Agent Systems",
                        desc: "Design multi-agent collaborative workflows with LangGraph, tool-calling agents, state machines, and human-in-the-loop controls.",
                        skills: ["LangGraph", "CrewAI", "Agentic Workflows", "Tool Calling", "Memory"],
                        project: "Autonomous Market Research & Report Agent",
                      },
                    ].map((item) => {
                      const isUnlocked = item.stage <= (enrolledCount || 1);
                      return (
                        <div
                          key={item.stage}
                          className={`p-6 rounded-2xl border transition-all ${
                            isUnlocked
                              ? "bg-slate-50 border-slate-200 hover:border-brand-blue/50"
                              : "bg-slate-50/50 border-slate-200/60 opacity-70"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                            <div className="flex items-center gap-2.5">
                              <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                                isUnlocked ? "bg-brand-blue text-white" : "bg-slate-200 text-slate-500"
                              }`}>
                                {item.stage}
                              </span>
                              <h3 className="text-base font-black text-slate-900">{item.title}</h3>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                              isUnlocked ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                            }`}>
                              {isUnlocked ? "Available" : "Locked"}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 mb-4">{item.desc}</p>

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/70">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {item.skills.map((s, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-600">
                                  {s}
                                </span>
                              ))}
                            </div>
                            <span className="text-xs font-bold text-brand-blue">
                              Milestone Project: {item.project}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 4: CERTIFICATES                                            */}
            {/* ============================================================== */}
            {activeTab === "certificates" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">Verified Certificates</h2>
                      <p className="text-xs text-slate-500 mt-1">Download and share digital credentials for completed courses.</p>
                    </div>
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-full">
                      {certificates.length} Issued
                    </span>
                  </div>

                  {certificates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {certificates.map((cert) => {
                        const c = cert.course || INITIAL_COURSES[0];
                        return (
                          <div
                            key={cert.id}
                            className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 hover:border-brand-purple/40 transition-colors"
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-black rounded-full flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Completed
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono">
                                  {new Date(cert.issued_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>

                              <h3 className="text-lg font-black text-slate-900">{c.title}</h3>
                              <p className="text-xs text-slate-500">Instructor: {c.instructor_name}</p>

                              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs font-mono text-slate-600">
                                ID: {cert.certificate_number}
                              </div>
                            </div>

                            <Link
                              href={`/certificates/${cert.id}`}
                              className="w-full py-2.5 px-4 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                              <Award className="w-4 h-4" /> View & Print Certificate
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-4">
                      <Award className="w-12 h-12 text-slate-400 mx-auto" />
                      <div className="space-y-1">
                        <p className="text-base font-bold text-slate-800">No Certificates Earned Yet</p>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          Complete all video lessons in your enrolled courses to automatically unlock your verified certificate.
                        </p>
                      </div>
                      {approvedEnrollments.length > 0 ? (
                        <button
                          onClick={() => handleTabChange("my-courses")}
                          className="px-6 py-2.5 bg-brand-blue text-white font-extrabold text-xs rounded-xl shadow"
                        >
                          Continue Learning &rarr;
                        </button>
                      ) : (
                        <Link
                          href="/courses"
                          className="inline-block px-6 py-2.5 bg-brand-blue text-white font-extrabold text-xs rounded-xl shadow"
                        >
                          Browse Courses
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 5: PAYMENTS (UPI TRANSACTION HISTORY)                       */}
            {/* ============================================================== */}
            {activeTab === "payments" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  
                  {/* Payments Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-brand-blue" />
                        UPI Payments & Verification
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Track your manual UPI payments, UTR numbers, and approval statuses.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-full">
                      {enrollments.length} Transactions
                    </span>
                  </div>

                  {/* Manual UPI Info Banner */}
                  <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-800">
                          How Manual UPI Verification Works
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Once you pay via UPI and submit your 12-digit UTR, our administrator verifies the transaction. Courses unlock immediately upon approval.
                        </p>
                      </div>
                    </div>
                    <a
                      href="https://wa.me/919876543210?text=Hi%20EdTech%20Team%2C%20I%20have%20submitted%20my%20UPI%20payment%20for%20course%20enrollment."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Support
                    </a>
                  </div>

                  {/* Payments List / Table */}
                  {enrollments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                            <th className="py-3 px-4">Course</th>
                            <th className="py-3 px-4">Amount</th>
                            <th className="py-3 px-4">UTR Number</th>
                            <th className="py-3 px-4">Screenshot</th>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                          {enrollments.map((enr) => {
                            const c = enr.course || INITIAL_COURSES.find(crs => crs.id === enr.course_id || crs.slug === enr.course_id) || INITIAL_COURSES[0];
                            return (
                              <tr key={enr.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-4 px-4 font-black text-slate-900 max-w-xs">
                                  <div className="truncate">{c.title}</div>
                                  <span className="text-[10px] text-slate-400 font-normal">{c.category}</span>
                                </td>
                                <td className="py-4 px-4 font-extrabold text-slate-900 whitespace-nowrap">
                                  ₹{enr.amount?.toLocaleString("en-IN") || c.price.toLocaleString("en-IN")}
                                </td>
                                <td className="py-4 px-4 whitespace-nowrap">
                                  <div className="inline-flex items-center gap-1.5 font-mono bg-slate-100 px-2.5 py-1 rounded-lg text-slate-800 text-[11px]">
                                    <span>{enr.utr}</span>
                                    <button
                                      onClick={() => copyToClipboard(enr.utr)}
                                      className="text-slate-400 hover:text-slate-700"
                                      title="Copy UTR"
                                    >
                                      {copiedUtr === enr.utr ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </div>
                                </td>
                                <td className="py-4 px-4 whitespace-nowrap">
                                  {enr.screenshot_url ? (
                                    <button
                                      onClick={() => setSelectedScreenshot(enr.screenshot_url)}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                                    >
                                      <Eye className="w-3.5 h-3.5 text-slate-500" /> View
                                    </button>
                                  ) : (
                                    <span className="text-slate-400 text-xs italic">None</span>
                                  )}
                                </td>
                                <td className="py-4 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                                  {new Date(enr.created_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </td>
                                <td className="py-4 px-4 whitespace-nowrap">
                                  {enr.status === "approved" && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                                      <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                                    </span>
                                  )}
                                  {enr.status === "pending" && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800">
                                      <Clock className="w-3.5 h-3.5" /> Pending Verification
                                    </span>
                                  )}
                                  {enr.status === "rejected" && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-800">
                                      <X className="w-3.5 h-3.5" /> Rejected
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-4">
                      <CreditCard className="w-12 h-12 text-slate-400 mx-auto" />
                      <div className="space-y-1">
                        <p className="text-base font-bold text-slate-800">No payment records found.</p>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                          When you enroll in a course using UPI, your submitted payment details and verification status will appear here.
                        </p>
                      </div>
                      <Link
                        href="/courses"
                        className="inline-block px-6 py-2.5 bg-brand-blue text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-blue-700 transition-colors"
                      >
                        Enroll in a Course
                      </Link>
                    </div>
                  )}

                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Screenshot Preview Modal */}
      {selectedScreenshot && (
        <div 
          onClick={() => setSelectedScreenshot(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-4 max-w-lg w-full max-h-[90vh] flex flex-col space-y-3 shadow-2xl"
          >
            <div className="flex items-center justify-between px-2 pt-1">
              <h3 className="text-sm font-black text-slate-800">Payment Screenshot</h3>
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto rounded-2xl border border-slate-200 bg-slate-100 flex items-center justify-center p-2">
              <img
                src={selectedScreenshot}
                alt="Payment Screenshot"
                className="max-h-[70vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
