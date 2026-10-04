"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PROJECTS_LIST } from "@/lib/data";
import { ProjectItem } from "@/lib/types";
import { CheckCircle2, XCircle, ArrowRight, Brain, AlertCircle, RefreshCw, Trophy, BookOpen } from "lucide-react";

export default function ProjectAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = Number(params?.projectId);

  const project: ProjectItem | undefined = PROJECTS_LIST.find((p) => p.id === projectId);

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [passed, setPassed] = useState<boolean>(false);
  const [breakdown, setBreakdown] = useState<Record<string, number>>({});

  if (!project || !project.assessment_questions) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Assessment Not Found</h2>
        <p className="text-slate-500 text-sm">Assessment questions for this project are currently being generated.</p>
        <Link href="/learning-path" className="px-4 py-2 bg-brand-blue text-white text-xs font-bold rounded-xl inline-block">
          Return to Learning Path
        </Link>
      </div>
    );
  }

  const questions = project.assessment_questions;

  const handleOptionSelect = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleEvaluateAssessment = async () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      alert("Please answer all questions before submitting your assessment.");
      return;
    }

    setSubmitting(true);
    let correctCount = 0;
    const breakdownMap: Record<string, number> = {};

    questions.forEach((q) => {
      const isCorrect = selectedAnswers[q.id] === q.correctIndex;
      if (isCorrect) correctCount += 1;
      breakdownMap[q.section] = isCorrect ? 100 : 0;
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    const isPass = finalScore >= 70;

    setScore(finalScore);
    setPassed(isPass);
    setBreakdown(breakdownMap);

    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.from("project_assessments").insert({
          user_id: session.user.id,
          project_id: project.id,
          score: finalScore,
          score_breakdown: breakdownMap,
          status: isPass ? "passed" : "review_recommended",
          answers: selectedAnswers,
          completed_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("Failed to store assessment in Supabase:", err);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Assessment Header */}
        <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-3 border border-white/10">
          <div className="flex items-center gap-2 text-purple-400 font-extrabold text-xs uppercase tracking-wider">
            <Brain className="w-4 h-4" /> 7-Section Knowledge Assessment
          </div>
          <h1 className="text-3xl font-black text-white">{project.name} — Assessment</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Test your understanding across problem framing, tech choices, code snippets, debugging, and execution choices. Passing score is <strong>70% (5 out of 7 sections)</strong>.
          </p>
        </div>

        {/* Evaluation Summary Banner (Shown after submission) */}
        {submitted && (
          <div className={`p-8 rounded-3xl border shadow-lg space-y-6 ${passed ? "bg-emerald-50 border-emerald-200 text-emerald-950" : "bg-amber-50 border-amber-200 text-amber-950"}`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${passed ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"}`}>
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-black">
                    {passed ? "Congratulations! Assessment Passed 🎉" : "Review Recommended"}
                  </h2>
                  <p className="text-xs font-semibold mt-1">
                    Your Score: <span className="text-lg font-black">{score}%</span> ({score >= 70 ? "PASSED ✓" : "NEEDS REVISION"})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setSelectedAnswers({});
                  }}
                  className="px-4 py-2 bg-white text-slate-800 text-xs font-bold rounded-xl border border-slate-200 shadow-sm flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retake Test
                </button>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-brand-blue text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  View Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Score Breakdown List */}
            <div className="pt-4 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {questions.map((q) => {
                const isCorrect = selectedAnswers[q.id] === q.correctIndex;
                return (
                  <div key={q.id} className="p-3 bg-white/80 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-slate-700">{q.section}</span>
                    <span className={`font-black px-2 py-0.5 rounded-md text-[11px] ${isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                      {isCorrect ? "Correct (+14%)" : "Incorrect (0%)"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Assessment Questions List */}
        <div className="space-y-6">
          {questions.map((q, qIdx) => {
            const selectedOpt = selectedAnswers[q.id];
            const isCorrect = selectedOpt === q.correctIndex;

            return (
              <div
                key={q.id}
                className={`p-6 sm:p-8 bg-white rounded-3xl border shadow-sm transition-all ${
                  submitted
                    ? isCorrect
                      ? "border-emerald-300 ring-1 ring-emerald-200"
                      : "border-red-300 ring-1 ring-red-200"
                    : "border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-extrabold rounded-lg">
                    Section {qIdx + 1}: {q.section}
                  </span>
                  {submitted && (
                    <span className={`text-xs font-extrabold flex items-center gap-1 ${isCorrect ? "text-emerald-600" : "text-red-600"}`}>
                      {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 mb-4">{q.question}</h3>

                <div className="space-y-2.5">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedOpt === optIdx;
                    let optStyle = "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100";

                    if (submitted) {
                      if (optIdx === q.correctIndex) {
                        optStyle = "bg-emerald-100 border-emerald-400 text-emerald-950 font-bold";
                      } else if (isSelected && !isCorrect) {
                        optStyle = "bg-red-100 border-red-400 text-red-950 font-bold";
                      }
                    } else if (isSelected) {
                      optStyle = "bg-blue-50 border-brand-blue text-brand-blue font-bold ring-2 ring-brand-blue/20";
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={submitted}
                        onClick={() => handleOptionSelect(q.id, optIdx)}
                        className={`w-full p-4 rounded-2xl text-left border text-xs sm:text-sm transition-all flex items-start gap-3 ${optStyle}`}
                      >
                        <span className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-relaxed">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-900 block mb-1">Explanation:</strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Action Bar */}
        {!submitted && (
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-md flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-500">
              Answered {Object.keys(selectedAnswers).length} of {questions.length} questions
            </div>

            <button
              onClick={handleEvaluateAssessment}
              disabled={submitting}
              className="px-8 py-3.5 bg-gradient-to-r from-brand-blue to-brand-indigo text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {submitting ? "Evaluating Score..." : "Submit & Calculate Score"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
