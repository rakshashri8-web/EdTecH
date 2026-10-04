"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Course, CourseModule, Lesson } from "@/lib/types";
import { PlayCircle, CheckCircle2, ChevronLeft, ChevronRight, Lock, Award, BookOpen, Layers } from "lucide-react";
import confetti from "canvas-confetti";

interface LessonPlayerProps {
  course: Course;
  modules: CourseModule[];
  initialProgress: string[]; // lesson_ids completed by user
}

export default function LessonPlayer({ course, modules, initialProgress }: LessonPlayerProps) {
  const router = useRouter();
  const supabase = createClient();

  // All lessons flat array
  const allLessons = modules.flatMap((m) => m.lessons || []);

  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(
    allLessons.length > 0 ? allLessons[0] : null
  );
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(initialProgress);
  const [isUpdating, setIsUpdating] = useState(false);

  const totalLessons = allLessons.length;
  const completedCount = completedLessonIds.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const currentLessonIndex = allLessons.findIndex((l) => l.id === currentLesson?.id);
  const isLastLesson = currentLessonIndex === totalLessons - 1;
  const isCurrentCompleted = currentLesson ? completedLessonIds.includes(currentLesson.id) : false;

  // Extract YouTube embed URL helper
  const getEmbedUrl = (url: string) => {
    if (!url) return "https://www.youtube.com/embed/dQw4w9WgXcQ";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
      : "https://www.youtube.com/embed/dQw4w9WgXcQ";
  };

  const handleToggleComplete = async () => {
    if (!currentLesson) return;
    setIsUpdating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const isCompleted = completedLessonIds.includes(currentLesson.id);

      if (isCompleted) {
        // Remove progress
        await supabase
          .from("lesson_progress")
          .delete()
          .eq("user_id", user.id)
          .eq("lesson_id", currentLesson.id);

        setCompletedLessonIds((prev) => prev.filter((id) => id !== currentLesson.id));
      } else {
        // Add progress
        await supabase
          .from("lesson_progress")
          .upsert({
            user_id: user.id,
            lesson_id: currentLesson.id,
            course_id: course.id,
            completed: true,
            completed_at: new Date().toISOString(),
          });

        const updatedCompleted = [...completedLessonIds, currentLesson.id];
        setCompletedLessonIds(updatedCompleted);

        // Trigger confetti celebration if 100% complete
        if (updatedCompleted.length === totalLessons) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });

          // Try client-side certificate issuance (if admin or server enabled)
          try {
            await supabase.from("certificates").upsert({
              user_id: user.id,
              course_id: course.id,
              certificate_number: `EDTECH-${course.slug.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
              issued_at: new Date().toISOString(),
            });
          } catch (certErr) {
            console.info("Certificate auto-issuance note:", certErr);
          }
        }
      }

      setIsUpdating(false);
    } catch (err) {
      console.error("Error updating lesson progress:", err);
      setIsUpdating(false);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < totalLessons - 1) {
      setCurrentLesson(allLessons[currentLessonIndex + 1]);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLesson(allLessons[currentLessonIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      
      {/* Top Header Bar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-black truncate max-w-xs sm:max-w-md">
              {course.title}
            </h1>
            <p className="text-[11px] text-slate-400">
              Instructor: {course.instructor_name}
            </p>
          </div>
        </div>

        {/* Progress Bar Display */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <span className="text-xs font-bold text-slate-300">
              {completedCount} / {totalLessons} Lessons ({progressPercent}%)
            </span>
            <div className="w-36 h-2 bg-slate-800 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-brand-blue to-brand-purple transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          {progressPercent === 100 && (
            <button
              onClick={() => router.push("/completed")}
              className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/30 animate-pulse"
            >
              <Award className="w-4 h-4" /> Certificate Ready
            </button>
          )}
        </div>
      </header>

      {/* Main Grid: Left Modules Sidebar + Center Video + Right Details */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left Modules Sidebar (Col 3) */}
        <div className="lg:col-span-3 bg-slate-900 border-r border-slate-800 overflow-y-auto max-h-[40vh] lg:max-h-none p-4 space-y-4">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
            Course Modules ({modules.length})
          </h3>

          <div className="space-y-3">
            {modules.map((mod, mIdx) => (
              <div key={mod.id} className="space-y-1">
                <div className="text-xs font-bold text-slate-300 px-2 py-1 bg-slate-800/60 rounded-lg">
                  Module {mIdx + 1}: {mod.title}
                </div>

                <div className="space-y-0.5">
                  {mod.lessons?.map((les) => {
                    const isSelected = les.id === currentLesson?.id;
                    const isDone = completedLessonIds.includes(les.id);
                    return (
                      <button
                        key={les.id}
                        onClick={() => setCurrentLesson(les)}
                        className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                          isSelected
                            ? "bg-brand-blue text-white font-extrabold"
                            : "text-slate-300 hover:bg-slate-800/80"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <PlayCircle className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span className="truncate">{les.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">{les.duration}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center & Right Video Player (Col 9) */}
        <div className="lg:col-span-9 bg-slate-950 flex flex-col justify-between overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* YouTube Video Player Embed Container */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
            {currentLesson ? (
              <iframe
                src={getEmbedUrl(currentLesson.video_url)}
                title={currentLesson.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 text-sm font-bold">
                Select a lesson to start playing
              </div>
            )}
          </div>

          {/* Lesson Action Controls & Information Footer */}
          {currentLesson && (
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              
              <div>
                <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
                  Current Lesson
                </span>
                <h2 className="text-lg font-black text-white mt-0.5">
                  {currentLesson.title}
                </h2>
                {currentLesson.description && (
                  <p className="text-xs text-slate-400 mt-1 max-w-xl">
                    {currentLesson.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevLesson}
                  disabled={currentLessonIndex === 0}
                  className="px-3.5 py-2.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700 disabled:opacity-30 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                <button
                  onClick={handleToggleComplete}
                  disabled={isUpdating}
                  className={`px-5 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${
                    isCurrentCompleted
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                      : "bg-gradient-to-r from-brand-blue to-brand-indigo text-white shadow-md shadow-brand-blue/30 hover:opacity-90"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isCurrentCompleted ? "Completed" : "Mark as Complete"}
                </button>

                <button
                  onClick={handleNextLesson}
                  disabled={isLastLesson}
                  className="px-3.5 py-2.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700 disabled:opacity-30 transition-colors flex items-center gap-1"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
