"use client";

import { useState } from "react";
import Link from "next/link";
import { CourseModule, Lesson } from "@/lib/types";
import {
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Lock,
  Clock,
  Eye,
  X,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  VideoOff,
  AlertCircle,
} from "lucide-react";

interface CurriculumAccordionProps {
  modules: CourseModule[];
  courseId?: string;
  courseSlug?: string;
  isEnrolled?: boolean;
}

export default function CurriculumAccordion({
  modules,
  courseId,
  courseSlug,
  isEnrolled = false,
}: CurriculumAccordionProps) {
  const [openModuleIds, setOpenModuleIds] = useState<string[]>(
    modules.length > 0 ? [modules[0].id] : []
  );

  const [activeLesson, setActiveLesson] = useState<{
    lesson: Lesson;
    moduleTitle: string;
  } | null>(null);

  const [fallbackToEmbed, setFallbackToEmbed] = useState(false);
  const [lockedNoticeLesson, setLockedNoticeLesson] = useState<Lesson | null>(null);
  const [noVideoNoticeLesson, setNoVideoNoticeLesson] = useState<Lesson | null>(null);

  const toggleModule = (id: string) => {
    setOpenModuleIds((prev) =>
      prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id]
    );
  };

  const isGoogleDriveVideo = (url?: string) => {
    if (!url) return false;
    const trimmed = url.trim();
    return (
      trimmed.startsWith("gdrive://") ||
      trimmed.includes("drive.google.com") ||
      /^[a-zA-Z0-9_-]{25,50}$/.test(trimmed)
    );
  };

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

  const getEmbedUrl = (url?: string | null) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.trim().match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
      : null;
  };

  const handleLessonClick = (lesson: Lesson, moduleTitle: string) => {
    if (!isEnrolled) {
      setLockedNoticeLesson(lesson);
      return;
    }
    const hasVideo = !!lesson.video_url && !!lesson.video_url.trim();
    if (!hasVideo) {
      setNoVideoNoticeLesson(lesson);
      return;
    }
    setFallbackToEmbed(false);
    setActiveLesson({ lesson, moduleTitle });
  };

  const targetIdentifier = courseSlug || courseId || "data-analyst";

  return (
    <div className="space-y-4">
      {modules.map((mod, idx) => {
        const isOpen = openModuleIds.includes(mod.id);
        const lessonCount = mod.lessons?.length || 0;

        return (
          <div
            key={mod.id}
            className="border border-slate-200/80 rounded-2xl bg-white overflow-hidden shadow-sm transition-all duration-200"
          >
            {/* Module Header Button */}
            <button
              onClick={() => toggleModule(mod.id)}
              className="w-full px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between text-left bg-slate-50/70 hover:bg-slate-100/80 transition-colors"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 pr-2">
                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-brand-blue/10 text-brand-blue text-xs font-black flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 truncate sm:whitespace-normal">
                    {mod.title}
                  </h4>
                  {mod.description && (
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {mod.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                <span className="text-[11px] sm:text-xs font-bold text-slate-500 bg-white px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-slate-200">
                  {lessonCount} {lessonCount === 1 ? "Lesson" : "Lessons"}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                )}
              </div>
            </button>

            {/* Expanded Lessons List */}
            {isOpen && (
              <div className="divide-y divide-slate-100 px-3.5 sm:px-6 py-2">
                {mod.lessons && mod.lessons.length > 0 ? (
                  mod.lessons.map((lesson) => {
                    const hasVideo = !!lesson.video_url && !!lesson.video_url.trim();
                    const isPlayable = isEnrolled && hasVideo;

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => handleLessonClick(lesson, mod.title)}
                        className={`py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm font-medium transition-all cursor-pointer rounded-xl px-2.5 sm:px-3 -mx-1 sm:-mx-3 ${
                          isPlayable
                            ? "hover:bg-blue-50/70 text-slate-800 hover:text-brand-blue"
                            : "hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                          <div
                            className={`p-1.5 rounded-lg shrink-0 mt-0.5 sm:mt-0 ${
                              isPlayable
                                ? "bg-brand-blue/10 text-brand-blue"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {isEnrolled ? (
                              <PlayCircle className="w-4 h-4 shrink-0" />
                            ) : (
                              <Lock className="w-4 h-4 shrink-0" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="font-semibold block leading-snug">{lesson.title}</span>
                            {isPlayable ? (
                              <span className="text-[11px] text-brand-blue font-bold flex items-center gap-1 mt-0.5">
                                <Sparkles className="w-3 h-3 shrink-0" /> Click to Play Video
                              </span>
                            ) : !isEnrolled ? (
                              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                                <Lock className="w-3 h-3 text-slate-400 shrink-0" /> Enroll to watch video
                              </span>
                            ) : !hasVideo ? (
                              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3 text-slate-400 shrink-0" /> Video not uploaded yet
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0 pl-9 sm:pl-0">
                          {isEnrolled ? (
                            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold text-brand-blue bg-blue-50 px-2.5 py-0.5 sm:py-1 rounded-full border border-blue-100">
                              <ShieldCheck className="w-3 h-3 shrink-0" /> Unlocked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 sm:py-1 rounded-full">
                              <Lock className="w-3 h-3 shrink-0" /> Locked
                            </span>
                          )}
                          {lesson.duration ? (
                            <span className="text-[11px] sm:text-xs text-slate-500 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3 shrink-0" />
                              {lesson.duration}
                            </span>
                          ) : hasVideo ? (
                            <span className="text-[11px] sm:text-xs text-slate-400 font-normal flex items-center gap-1">
                              <Clock className="w-3 h-3 shrink-0" />
                              Processing...
                            </span>
                          ) : null}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="py-4 text-xs text-slate-400 italic">
                    Lessons will be unlocked upon enrollment.
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Video Player Modal on Course Page */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl max-w-4xl w-full flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-white">
              <div>
                <span className="text-[11px] uppercase font-bold text-brand-blue tracking-wider block">
                  {activeLesson.moduleTitle}
                </span>
                <h3 className="text-sm sm:text-base font-black truncate max-w-lg mt-0.5">
                  {activeLesson.lesson.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveLesson(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                title="Close video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
              {isGoogleDriveVideo(activeLesson.lesson.video_url) ? (
                fallbackToEmbed || !getDriveFileId(activeLesson.lesson.video_url) ? (
                  <iframe
                    src={`https://drive.google.com/file/d/${getDriveFileId(
                      activeLesson.lesson.video_url
                    )}/preview`}
                    title={activeLesson.lesson.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    key={`modal-stream-${activeLesson.lesson.id}`}
                    src={`/api/videos/${activeLesson.lesson.id}/stream`}
                    controls
                    autoPlay
                    controlsList="nodownload"
                    playsInline
                    className="w-full h-full object-contain"
                    onError={() => setFallbackToEmbed(true)}
                  />
                )
              ) : getEmbedUrl(activeLesson.lesson.video_url) ? (
                <iframe
                  src={getEmbedUrl(activeLesson.lesson.video_url)!}
                  title={activeLesson.lesson.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2">
                  <VideoOff className="w-10 h-10 text-slate-500" />
                  <p className="text-sm font-bold text-white">Video not uploaded yet</p>
                  <p className="text-xs text-slate-400 max-w-sm">The instructor will upload this lesson video soon.</p>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 sm:p-5 bg-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white border-t border-slate-800">
              <div className="flex items-center gap-2">
                {activeLesson.lesson.is_preview ? (
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> Free Preview
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-blue-500/20 text-brand-blue text-xs font-bold rounded-lg flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Full Lesson
                  </span>
                )}
                {activeLesson.lesson.duration && (
                  <span className="text-xs text-slate-400">
                    Duration: {activeLesson.lesson.duration}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  href={`/learn/${targetIdentifier}?lesson=${activeLesson.lesson.id}`}
                  className="px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-indigo text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-blue/30 hover:opacity-95 transition-all flex items-center justify-center gap-1.5 w-full sm:w-auto"
                >
                  Open in Classroom <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => setActiveLesson(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white font-bold text-xs rounded-xl transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Not Uploaded Notice Modal */}
      {noVideoNoticeLesson && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
              <VideoOff className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Video not uploaded yet</h3>
              <p className="text-xs text-slate-500 mt-2">
                The video for <span className="font-bold text-slate-700">&quot;{noVideoNoticeLesson.title}&quot;</span> has not been uploaded by the instructor yet. Please check back soon.
              </p>
            </div>
            <button
              onClick={() => setNoVideoNoticeLesson(null)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Locked Lesson Notice Modal */}
      {lockedNoticeLesson && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Enrollment Required
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                &quot;{lockedNoticeLesson.title}&quot; is part of the full curriculum. Enroll in the program to unlock all 10 modules, real-world capstone projects, and your verified certificate.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href={`/payment/${targetIdentifier}`}
                className="w-full py-3 bg-gradient-to-r from-brand-blue to-brand-indigo text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-blue/30 hover:opacity-90 transition-all block"
              >
                Enroll in Program Now
              </Link>
              <button
                onClick={() => setLockedNoticeLesson(null)}
                className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
