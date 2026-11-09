"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Course, CourseModule, Lesson } from "@/lib/types";
import { PlayCircle, CheckCircle2, ChevronLeft, ChevronRight, Lock, Award, BookOpen, Layers, VideoOff, Video, AlertCircle, Clock } from "lucide-react";
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

  const [useEmbedFallback, setUseEmbedFallback] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);

  // Check URL query param ?lesson=... on initial mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const lessonParam = params.get("lesson");
      if (lessonParam) {
        const found = allLessons.find((l) => l.id === lessonParam);
        if (found) {
          setCurrentLesson(found);
        }
      }
    }
  }, []);

  // Sync current lesson to URL silently and reset video error states
  useEffect(() => {
    setUseEmbedFallback(false);
    setStreamError(null);

    if (currentLesson && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.get("lesson") !== currentLesson.id) {
        url.searchParams.set("lesson", currentLesson.id);
        window.history.replaceState(null, "", url.toString());
      }
    }
  }, [currentLesson?.id]);

  // Check if video is hosted on Google Drive
  const isGoogleDriveVideo = (url?: string) => {
    if (!url) return false;
    const trimmed = url.trim();
    return (
      trimmed.startsWith("gdrive://") ||
      trimmed.includes("drive.google.com") ||
      /^[a-zA-Z0-9_-]{25,50}$/.test(trimmed)
    );
  };

  // Extract Drive File ID
  const getDriveFileId = (url?: string): string | null => {
    if (!url) return null;
    const trimmed = url.trim();
    if (trimmed.startsWith("gdrive://")) return trimmed.replace("gdrive://", "").trim();
    const match = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]{25,})/);
    if (match) return match[1];
    const idParam = trimmed.match(/[?&]id=([a-zA-Z0-9_-]{25,})/);
    if (idParam) return idParam[1];
    if (/^[a-zA-Z0-9_-]{25,50}$/.test(trimmed)) return trimmed;
    return null;
  };

  // Extract YouTube embed URL helper (returns null if invalid, never returns dummy/rickroll URLs)
  const getEmbedUrl = (url?: string | null) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.trim().match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
      : null;
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
              certificate_number: `AIMP-${course.slug.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
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

      {/* Main Grid: Mobile Order = Video on TOP, Modules underneath; Desktop = Sidebar Left, Video Right */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Modules Sidebar (Order 2 on mobile, Order 1 on Desktop) */}
        <div className="order-2 lg:order-1 lg:col-span-3 xl:col-span-3 bg-slate-900 border-t lg:border-t-0 lg:border-r border-slate-800 overflow-y-auto max-h-[50vh] lg:max-h-[calc(100vh-4rem)] p-3 sm:p-4 space-y-4">
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
                        <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <PlayCircle className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span className="truncate">{les.title}</span>
                        </div>
                        {les.duration ? (
                          <span className="text-[10px] text-slate-400 shrink-0">{les.duration}</span>
                        ) : !les.video_url ? (
                          <span className="text-[10px] text-slate-500 italic shrink-0">Pending</span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Player and Lesson Details (Order 1 on mobile, Order 2 on Desktop) */}
        <div className="order-1 lg:order-2 lg:col-span-9 xl:col-span-9 bg-slate-950 overflow-y-auto max-h-[calc(100vh-4rem)] p-3 sm:p-6 lg:p-8">
          <div className="w-full max-w-5xl mx-auto space-y-3.5 sm:space-y-5">
            
            {/* Video Player Container (Natural 16:9 Aspect Ratio) */}
            <div className="relative aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
              {currentLesson ? (
                !currentLesson.video_url || !currentLesson.video_url.trim() ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-slate-900 text-slate-400 space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400">
                      <VideoOff className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-base font-black text-slate-200">Video not uploaded yet</h3>
                    <p className="text-xs text-slate-400 max-w-md">
                      The instructor has not uploaded the video for this lesson yet. Please check back soon or proceed to another lesson.
                    </p>
                  </div>
                ) : isGoogleDriveVideo(currentLesson.video_url) ? (
                  useEmbedFallback || !getDriveFileId(currentLesson.video_url) ? (
                    <iframe
                      key={`embed-${currentLesson.id}`}
                      src={`https://drive.google.com/file/d/${getDriveFileId(currentLesson.video_url)}/preview`}
                      title={currentLesson.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="relative w-full h-full bg-black">
                      <video
                        key={`stream-${currentLesson.id}`}
                        src={`/api/videos/${currentLesson.id}/stream`}
                        controls
                        controlsList="nodownload"
                        playsInline
                        className="w-full h-full object-contain"
                        onEnded={!isCurrentCompleted ? handleToggleComplete : undefined}
                        onError={() => {
                          // Automatically fall back to Google Drive Preview player for resilience
                          setUseEmbedFallback(true);
                        }}
                      />

                      {streamError && (
                        <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center space-y-3 z-10">
                          <p className="text-sm font-bold text-amber-400 max-w-md">{streamError}</p>
                          <button
                            onClick={() => setUseEmbedFallback(true)}
                            className="px-4 py-2 bg-brand-blue text-white font-bold text-xs rounded-xl shadow-lg hover:opacity-90 transition-all"
                          >
                            Switch to Google Drive Embed Player
                          </button>
                        </div>
                      )}
                    </div>
                  )
                ) : getEmbedUrl(currentLesson.video_url) ? (
                  <iframe
                    src={getEmbedUrl(currentLesson.video_url)!}
                    title={currentLesson.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-slate-900 text-slate-400 space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400">
                      <AlertCircle className="w-8 h-8 text-amber-400" />
                    </div>
                    <h3 className="text-base font-black text-slate-200">Video unavailable</h3>
                    <p className="text-xs text-slate-400 max-w-md">
                      The video link for this lesson could not be loaded. Please contact support.
                    </p>
                  </div>
                )
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500 text-sm font-bold">
                  Select a lesson to start playing
                </div>
              )}
            </div>

            {/* Lesson Title, Description & Action Controls Immediately Below Video */}
            {currentLesson && (
              <div className="bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
                
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
                      Current Lesson
                    </span>
                    {currentLesson.duration && (
                      <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/50">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {currentLesson.duration}
                      </span>
                    )}
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-white">
                    {currentLesson.title}
                  </h2>
                  {currentLesson.description && (
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
                      {currentLesson.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto justify-between sm:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <button
                    onClick={handlePrevLesson}
                    disabled={currentLessonIndex === 0}
                    className="flex-1 sm:flex-initial px-3 py-2 sm:px-3.5 sm:py-2.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700 disabled:opacity-30 transition-colors flex items-center justify-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4 shrink-0" /> Previous
                  </button>

                  <button
                    onClick={handleToggleComplete}
                    disabled={isUpdating}
                    className={`flex-1 sm:flex-initial px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
                      isCurrentCompleted
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                        : "bg-gradient-to-r from-brand-blue to-brand-indigo text-white shadow-md shadow-brand-blue/30 hover:opacity-90"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    {isCurrentCompleted ? "Completed" : "Complete"}
                  </button>

                  <button
                    onClick={handleNextLesson}
                    disabled={isLastLesson}
                    className="flex-1 sm:flex-initial px-3 py-2 sm:px-3.5 sm:py-2.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700 disabled:opacity-30 transition-colors flex items-center justify-center gap-1"
                  >
                    Next <ChevronRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
