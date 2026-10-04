"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PROJECTS_LIST } from "@/lib/data";
import { ProjectItem } from "@/lib/types";
import { CheckCircle2, ArrowRight, Github, ExternalLink, Code2, AlertCircle, FileCode, Check, BookOpen } from "lucide-react";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = Number(params?.projectId);

  const project: ProjectItem | undefined = PROJECTS_LIST.find((p) => p.id === projectId);

  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [explanation, setExplanation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!project) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Project Not Found</h2>
        <p className="text-slate-500 text-sm">The project you are looking for does not exist.</p>
        <Link href="/learning-path" className="px-4 py-2 bg-brand-blue text-white text-xs font-bold rounded-xl inline-block">
          Return to Learning Path
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrl) {
      setErrorMsg("Please provide your GitHub repository URL.");
      return;
    }
    setErrorMsg("");
    setSubmitting(true);

    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push("/login?redirect=/projects/" + projectId);
        return;
      }

      const { error } = await supabase.from("project_submissions").insert({
        user_id: session.user.id,
        project_id: project.id,
        github_url: githubUrl,
        demo_url: demoUrl || null,
        explanation: explanation,
        submitted_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Submission error:", error);
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-brand-navy text-white p-8 sm:p-10 rounded-3xl shadow-xl space-y-4 border border-white/10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-brand-blue text-white text-xs font-black rounded-full uppercase tracking-wider">
              Real-World Capstone Project #{project.id}
            </span>
            <span className="px-3 py-1 bg-white/10 text-slate-300 text-xs font-bold rounded-full">
              {project.difficulty} Level
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full">
              {project.course}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white">{project.name}</h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{project.description}</p>
        </div>

        {/* 5-Step Project Workflow Guide */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
          
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <FileCode className="w-5 h-5 text-brand-blue" />
              5-Step Implementation Workflow
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Follow this structured sequence: LEARN &rarr; UNDERSTAND &rarr; BUILD &rarr; SUBMIT &rarr; TEST
            </p>
          </div>

          <div className="space-y-8">
            
            {/* Step 1: Problem Statement */}
            <div className="space-y-3 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-blue text-white text-xs font-bold flex items-center justify-center">1</span>
                <h3 className="text-base font-black text-slate-900">Problem Understanding & Real-World Use Case</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                <strong>Problem:</strong> {project.problem_statement}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                <strong>Industry Context:</strong> {project.real_world_use_case}
              </p>
            </div>

            {/* Step 2: Required Knowledge */}
            <div className="space-y-3 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                <h3 className="text-base font-black text-slate-900">Required Modules & Knowledge</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.required_modules.map((m) => (
                  <span key={m} className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-200">
                    <BookOpen className="w-3.5 h-3.5 inline mr-1" /> {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Step 3: Technologies */}
            <div className="space-y-3 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">3</span>
                <h3 className="text-base font-black text-slate-900">Technologies to Implement</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span key={t} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
                    <Code2 className="w-3.5 h-3.5 inline mr-1" /> {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Step 4: Build Requirements */}
            <div className="space-y-3 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">4</span>
                <h3 className="text-base font-black text-slate-900">Build Requirements & Deliverables</h3>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {project.build_requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step 5: Submission & Assessment */}
            <div className="space-y-4 p-6 bg-blue-50/50 rounded-2xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-blue text-white text-xs font-bold flex items-center justify-center">5</span>
                  <h3 className="text-base font-black text-slate-900">Submit Project & Take Assessment</h3>
                </div>
                <Link
                  href={`/projects/${project.id}/assessment`}
                  className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-purple-700 transition-colors flex items-center gap-1.5"
                >
                  Take Assessment Test
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {submitted ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Check className="w-5 h-5 text-emerald-600" />
                    Project Code Successfully Submitted!
                  </div>
                  <p className="text-xs">
                    Your GitHub repository link is saved. Now take the 7-section knowledge assessment to test your understanding.
                  </p>
                  <Link
                    href={`/projects/${project.id}/assessment`}
                    className="inline-block mt-2 px-4 py-2 bg-emerald-600 text-white text-xs font-extrabold rounded-lg shadow-sm"
                  >
                    Proceed to Knowledge Assessment &rarr;
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                  {errorMsg && (
                    <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1">
                        GitHub Repository URL *
                      </label>
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="url"
                          required
                          placeholder="https://github.com/username/my-project"
                          value={githubUrl}
                          onChange={(e) => setGithubUrl(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-blue/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1">
                        Live Demo / Streamlit URL (Optional)
                      </label>
                      <div className="relative">
                        <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="url"
                          placeholder="https://my-app.streamlit.app"
                          value={demoUrl}
                          onChange={(e) => setDemoUrl(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-blue/20"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1">
                      Key Highlights & Implementation Summary
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Briefly describe your approach, model results, and key technical decisions..."
                      value={explanation}
                      onChange={(e) => setExplanation(e.target.value)}
                      className="w-full p-3 text-xs font-medium bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-blue/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-6 py-3 bg-brand-blue text-white text-xs font-extrabold rounded-xl shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Saving Submission..." : "Submit Project Code"}
                  </button>
                </form>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
