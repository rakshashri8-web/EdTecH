"use client";

import { useState, useEffect } from "react";
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  Edit2,
  Check,
  X,
  Video,
  VideoOff,
  Clock,
  Sparkles,
  Info,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { getCanonicalCourseTitle } from "@/lib/courseImage";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  duration: string;
  order: number;
  is_preview: boolean;
  published: boolean;
  video_processing_status?: string | null;
}

interface Module {
  id: string;
  title: string;
  course_id: string;
}

interface Course {
  id: string;
  title: string;
  slug?: string;
}

interface LessonManagerProps {
  courses: Course[];
}

const emptyLesson = {
  title: "",
  description: "",
  video_url: "",
  duration: "",
  is_preview: false,
  published: true,
};

export default function LessonManager({ courses }: LessonManagerProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loadingModules, setLoadingModules] = useState(false);
  const [loadingLessons, setLoadingLessons] = useState(false);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const courseTarget = selectedCourse?.slug || selectedCourse?.id || "data-analyst";

  const [addingLesson, setAddingLesson] = useState(false);
  const [lessonForm, setLessonForm] = useState({ ...emptyLesson });
  const [savingLesson, setSavingLesson] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ ...emptyLesson });

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Google Drive connection status
  const [driveConnected, setDriveConnected] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/admin/drive/status")
      .then((r) => r.json())
      .then((data) => setDriveConnected(!!data.connected))
      .catch(() => setDriveConnected(false));
  }, []);

  // Auto-restore selected course from URL or localStorage, or default to first course
  useEffect(() => {
    if (!courses || courses.length === 0) return;

    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlCourse = urlParams.get("course_id");
      const storedCourse = localStorage.getItem("aimp_admin_course_id");

      const targetCourse =
        (urlCourse && courses.some((c) => c.id === urlCourse) ? urlCourse : null) ||
        (storedCourse && courses.some((c) => c.id === storedCourse) ? storedCourse : null) ||
        courses[0]?.id ||
        "";

      if (targetCourse && targetCourse !== selectedCourseId) {
        setSelectedCourseId(targetCourse);
      }
    }
  }, [courses]);

  // When selectedCourseId changes, fetch modules and restore/default selectedModuleId
  useEffect(() => {
    if (!selectedCourseId) {
      setModules([]);
      setSelectedModuleId("");
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("aimp_admin_course_id", selectedCourseId);
    }

    setLoadingModules(true);
    fetch(`/api/admin/modules?course_id=${selectedCourseId}`)
      .then((r) => r.json())
      .then((data: Module[]) => {
        const mods = data ?? [];
        setModules(mods);

        // Check if there was a saved module for this course
        let targetMod = "";
        if (typeof window !== "undefined") {
          const urlParams = new URLSearchParams(window.location.search);
          const urlModule = urlParams.get("module_id");
          const storedModule = localStorage.getItem("aimp_admin_module_id");

          if (urlModule && mods.some((m) => m.id === urlModule)) {
            targetMod = urlModule;
          } else if (storedModule && mods.some((m) => m.id === storedModule)) {
            targetMod = storedModule;
          } else if (mods.length > 0) {
            targetMod = mods[0].id;
          }
        } else if (mods.length > 0) {
          targetMod = mods[0].id;
        }

        setSelectedModuleId(targetMod);
      })
      .catch(console.error)
      .finally(() => setLoadingModules(false));
  }, [selectedCourseId]);

  // When selectedModuleId changes, save to localStorage and sync URL
  useEffect(() => {
    if (!selectedModuleId) {
      setLessons([]);
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("aimp_admin_module_id", selectedModuleId);

      // Sync to browser URL silently without reloading
      const url = new URL(window.location.href);
      if (selectedCourseId) url.searchParams.set("course_id", selectedCourseId);
      url.searchParams.set("module_id", selectedModuleId);
      window.history.replaceState(null, "", url.toString());
    }

    setLoadingLessons(true);
    fetch(`/api/admin/lessons?module_id=${selectedModuleId}`)
      .then((r) => r.json())
      .then((data) => setLessons(data ?? []))
      .catch(console.error)
      .finally(() => setLoadingLessons(false));
  }, [selectedModuleId]);

  const handleAddLesson = async () => {
    if (!lessonForm.title || !selectedModuleId) return;
    setSavingLesson(true);
    try {
      const res = await fetch("/api/admin/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module_id: selectedModuleId,
          course_id: selectedCourseId,
          title: lessonForm.title,
          description: lessonForm.description || null,
          video_url: lessonForm.video_url,
          duration: lessonForm.duration,
          order: lessons.length + 1,
          is_preview: lessonForm.is_preview,
          published: lessonForm.published,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const newLesson = await res.json();
      setLessons((prev) => [...prev, newLesson]);
      setLessonForm({ ...emptyLesson });
      setAddingLesson(false);

      // If video was added but duration still unknown, trigger background save-duration
      if (newLesson.video_url && !newLesson.duration) {
        fetch("/api/admin/videos/save-duration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lesson_id: newLesson.id, video_url: newLesson.video_url }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.status === "ready" && data.duration) {
              setLessons((prev) =>
                prev.map((l) =>
                  l.id === newLesson.id
                    ? { ...l, duration: data.duration, video_processing_status: "completed" }
                    : l
                )
              );
            }
          })
          .catch(() => {});
      }
    } catch (err: any) {
      alert(`Failed to add lesson: ${err.message}`);
    } finally {
      setSavingLesson(false);
    }
  };

  const handleEditLesson = async (lessonId: string) => {
    setSavingLesson(true);
    try {
      const res = await fetch("/api/admin/lessons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: lessonId,
          title: editForm.title,
          description: editForm.description || null,
          video_url: editForm.video_url,
          duration: editForm.duration,
          is_preview: editForm.is_preview,
          published: editForm.published,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setLessons((prev) =>
        prev.map((l) =>
          l.id === lessonId
            ? { ...l, ...editForm, duration: updated.duration ?? editForm.duration, description: editForm.description || null }
            : l
        )
      );
      setEditingId(null);

      // If video was added/changed but duration still not resolved, run background save-duration
      if (editForm.video_url && !updated.duration) {
        fetch("/api/admin/videos/save-duration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lesson_id: lessonId, video_url: editForm.video_url }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.status === "ready" && data.duration) {
              setLessons((prev) =>
                prev.map((l) =>
                  l.id === lessonId
                    ? { ...l, duration: data.duration, video_processing_status: "completed" }
                    : l
                )
              );
            }
          })
          .catch(() => {});
      }
    } catch (err: any) {
      alert(`Failed to update lesson: ${err.message}`);
    } finally {
      setSavingLesson(false);
    }
  };

  const handleRemoveVideo = async (lessonId: string) => {
    try {
      const res = await fetch("/api/admin/lessons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: lessonId,
          video_url: "",
          duration: "",
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setLessons((prev) =>
        prev.map((l) =>
          l.id === lessonId ? { ...l, video_url: "", duration: "" } : l
        )
      );
    } catch (err: any) {
      alert(`Failed to remove video: ${err.message}`);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    setDeletingId(lessonId);
    try {
      const res = await fetch(`/api/admin/lessons?id=${lessonId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    } catch (err: any) {
      alert(`Failed to delete lesson: ${err.message}`);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const handleReorder = async (index: number, direction: "up" | "down") => {
    const newLessons = [...lessons];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newLessons.length) return;
    [newLessons[index], newLessons[swapIndex]] = [newLessons[swapIndex], newLessons[index]];
    const updated = newLessons.map((l, i) => ({ ...l, order: i + 1 }));
    setLessons(updated);
    await Promise.all(
      updated.map((l) =>
        fetch("/api/admin/lessons", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: l.id, order: l.order }),
        })
      )
    );
  };

  const [detectingDuration, setDetectingDuration] = useState(false);
  const [retryingDurationId, setRetryingDurationId] = useState<string | null>(null);

  const handleDetectDuration = async (url: string, setFn: (k: string, v: any) => void) => {
    if (!url || !url.trim()) return;
    setDetectingDuration(true);
    try {
      const res = await fetch(`/api/admin/videos/detect-duration?url=${encodeURIComponent(url.trim())}`);
      const data = await res.json();
      if (data.status === "ready" && data.duration) {
        setFn("duration", data.duration);
      } else if (data.status === "processing") {
        // Don't set "Processing video..." as the duration value in the form
        setFn("duration", "");
      }
    } catch (err) {
      console.warn("Detect duration error:", err);
    } finally {
      setDetectingDuration(false);
    }
  };

  // Retry duration detection for a saved lesson (calls save-duration API which persists to DB)
  const handleRetryDuration = async (lesson: Lesson) => {
    if (!lesson.video_url) return;
    setRetryingDurationId(lesson.id);
    try {
      const res = await fetch("/api/admin/videos/save-duration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson_id: lesson.id, video_url: lesson.video_url }),
      });
      const data = await res.json();
      if (data.status === "ready" && data.duration) {
        // Duration successfully detected — update lesson in list
        setLessons((prev) =>
          prev.map((l) =>
            l.id === lesson.id
              ? { ...l, duration: data.duration, video_processing_status: "completed" }
              : l
          )
        );
      } else if (data.status === "processing") {
        setLessons((prev) =>
          prev.map((l) =>
            l.id === lesson.id
              ? { ...l, duration: "", video_processing_status: "processing" }
              : l
          )
        );
        alert("Google Drive is still processing this video. Please try again in a few minutes.");
      } else {
        setLessons((prev) =>
          prev.map((l) =>
            l.id === lesson.id
              ? { ...l, duration: "", video_processing_status: "unavailable" }
              : l
          )
        );
        alert("Could not detect duration. Make sure Google Drive is connected and the video has finished uploading.");
      }
    } catch (err: any) {
      alert(`Retry failed: ${err.message}`);
    } finally {
      setRetryingDurationId(null);
    }
  };

  const inputCls = "w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20";
  const labelCls = "block text-xs font-black text-slate-600 mb-1";

  const LessonFormFields = ({
    form,
    onChange,
  }: {
    form: typeof emptyLesson;
    onChange: (k: string, v: any) => void;
  }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="sm:col-span-2">
        <label className={labelCls}>Title *</label>
        <input type="text" value={form.title} onChange={(e) => onChange("title", e.target.value)} className={inputCls} placeholder="Lesson title..." />
      </div>
      <div className="sm:col-span-2">
        <label className={labelCls}>Description</label>
        <input type="text" value={form.description} onChange={(e) => onChange("description", e.target.value)} className={inputCls} placeholder="Optional description..." />
      </div>
      <div className="sm:col-span-2">
        <div className="flex items-center justify-between mb-1">
          <label className={labelCls}>Video URL or Google Drive File ID / Link</label>
          {form.video_url && (
            <button
              type="button"
              onClick={() => {
                onChange("video_url", "");
                onChange("duration", "");
              }}
              className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Remove Video
            </button>
          )}
        </div>
        <input
          type="text"
          value={form.video_url}
          onChange={(e) => {
            const val = e.target.value.trim();
            // Automatically detect Google Drive file ID pattern
            const match = val.match(/\/file\/d\/([a-zA-Z0-9_-]{25,})/) || val.match(/[?&]id=([a-zA-Z0-9_-]{25,})/);
            if (match) {
              const driveUrl = `gdrive://${match[1]}`;
              onChange("video_url", driveUrl);
              handleDetectDuration(driveUrl, onChange);
            } else {
              onChange("video_url", e.target.value);
            }
          }}
          onBlur={() => {
            if (form.video_url && !form.duration) {
              handleDetectDuration(form.video_url, onChange);
            }
          }}
          className={inputCls}
          placeholder="e.g. gdrive://FILE_ID or https://drive.google.com/file/d/... or YouTube URL"
        />
        {form.video_url.startsWith("gdrive://") || /^[a-zA-Z0-9_-]{25,50}$/.test(form.video_url.trim()) ? (
          <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            Google Drive Video detected. Will stream securely with range seeking.
          </p>
        ) : form.video_url ? (
          <p className="text-[11px] text-brand-blue font-bold mt-1 flex items-center gap-1">
            <Video className="w-3.5 h-3.5" />
            Video link configured. Duration will auto-detect.
          </p>
        ) : (
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <Info className="w-3 h-3 text-slate-400" />
            Paste a Google Drive link, file ID, or YouTube video URL. Leave empty if video is not ready.
          </p>
        )}
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className={labelCls}>Detected Duration</label>
          {form.video_url && (
            <button
              type="button"
              onClick={() => handleDetectDuration(form.video_url, onChange)}
              disabled={detectingDuration}
              className="text-[11px] font-bold text-brand-blue hover:text-blue-700 flex items-center gap-1"
            >
              {detectingDuration ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              {detectingDuration ? "Detecting..." : "Auto-Detect"}
            </button>
          )}
        </div>
        <input
          type="text"
          value={form.duration}
          onChange={(e) => onChange("duration", e.target.value)}
          className={inputCls}
          placeholder="e.g. 14 mins 35 secs (auto-detected)"
        />
      </div>
      <div className="flex items-center gap-4 pt-5">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
          <input type="checkbox" checked={form.is_preview} onChange={(e) => onChange("is_preview", e.target.checked)} className="w-4 h-4 rounded accent-brand-blue" />
          Free Preview
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
          <input type="checkbox" checked={form.published} onChange={(e) => onChange("published", e.target.checked)} className="w-4 h-4 rounded accent-brand-blue" />
          Published
        </label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Google Drive Video Storage Status Banner */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          driveConnected
            ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
            : "bg-amber-50 border-amber-200 text-amber-900"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl ${
              driveConnected ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
            }`}
          >
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black">
              {driveConnected ? "Google Drive Video Storage Connected" : "Google Drive Video Storage Disconnected"}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {driveConnected
                ? "Secure streaming proxy is active. Students can watch private Drive videos directly on the website."
                : "Authorize the Google Drive account to allow server-side video streaming."}
            </p>
          </div>
        </div>

        <a
          href="/api/admin/drive/auth"
          className={`px-4 py-2 font-bold text-xs rounded-xl shadow-md hover:opacity-90 transition-all flex items-center gap-1.5 shrink-0 ${
            driveConnected
              ? "bg-slate-800 text-white hover:bg-slate-700"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-600/30"
          }`}
        >
          {driveConnected ? "Reconnect Google Drive" : "Connect Google Drive"} ↗
        </a>
      </div>

      {/* Selectors */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <h2 className="text-sm font-black text-slate-800">Select Course & Module</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Course</label>
            <select
              value={selectedCourseId}
              onChange={(e) => {
                const newCourse = e.target.value;
                setSelectedCourseId(newCourse);
                if (typeof window !== "undefined") {
                  localStorage.removeItem("aimp_admin_module_id");
                  const url = new URL(window.location.href);
                  url.searchParams.delete("module_id");
                  if (newCourse) {
                    url.searchParams.set("course_id", newCourse);
                  } else {
                    url.searchParams.delete("course_id");
                  }
                  window.history.replaceState(null, "", url.toString());
                }
              }}
              className={inputCls}
            >
              <option value="">-- Select a course --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{getCanonicalCourseTitle(c)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Module</label>
            <select
              value={selectedModuleId}
              onChange={(e) => setSelectedModuleId(e.target.value)}
              className={inputCls}
              disabled={!selectedCourseId || loadingModules}
            >
              <option value="">-- Select a module --</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
            {loadingModules && <p className="text-xs text-slate-400 mt-1">Loading modules...</p>}
          </div>
        </div>

        {selectedCourse && (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-500 font-bold">
              Test video playback on: <span className="text-slate-800 font-black">{getCanonicalCourseTitle(selectedCourse)}</span>
            </span>
            <div className="flex items-center gap-2">
              <a
                href={`/courses/${courseTarget}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-brand-blue font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5"
                title="View Course Page with In-Page Video Player"
              >
                <Eye className="w-3.5 h-3.5" /> Course Page ↗
              </a>
              <a
                href={`/learn/${courseTarget}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5"
                title="Open Classroom Player"
              >
                <Video className="w-3.5 h-3.5" /> Classroom Player ↗
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Upload Notice */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
        <Video className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-black text-emerald-900">Google Drive Video Streaming Active</p>
          <p className="text-xs text-emerald-800 mt-0.5">
            Paste any Google Drive link or file ID into the &quot;Video URL&quot; field. The system streams directly and securely to enrolled students with fast timeline scrubbing and mobile playback.
          </p>
        </div>
      </div>

      {/* Lessons List */}
      {selectedModuleId && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-sm font-black text-slate-900">
              Lessons
              {lessons.length > 0 && <span className="ml-2 text-slate-400 font-bold">({lessons.length})</span>}
            </h2>
            <button
              onClick={() => setAddingLesson(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-blue text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Lesson
            </button>
          </div>

          {loadingLessons && (
            <div className="flex items-center gap-2 py-8 justify-center text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-bold">Loading lessons...</span>
            </div>
          )}

          {/* Add Lesson Form */}
          {addingLesson && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-black text-slate-800">New Lesson</h3>
              <LessonFormFields
                form={lessonForm}
                onChange={(k, v) => setLessonForm((p) => ({ ...p, [k]: v }))}
              />
              <div className="flex gap-2 justify-end pt-2 border-t border-slate-200">
                <button onClick={() => setAddingLesson(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-200 hover:bg-slate-300 transition-colors">Cancel</button>
                <button
                  onClick={handleAddLesson}
                  disabled={savingLesson || !lessonForm.title}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-blue hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                >
                  {savingLesson && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Add Lesson
                </button>
              </div>
            </div>
          )}

          {!loadingLessons && lessons.length === 0 && !addingLesson && (
            <p className="text-center py-10 text-slate-400 font-bold text-sm">
              No lessons in this module. Click &quot;Add Lesson&quot; to create one.
            </p>
          )}

          {/* Lesson Cards */}
          <div className="space-y-3">
            {lessons.map((lesson, idx) => (
              <div key={lesson.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                {editingId === lesson.id ? (
                  <div className="space-y-4">
                    <LessonFormFields
                      form={editForm}
                      onChange={(k, v) => setEditForm((p) => ({ ...p, [k]: v }))}
                    />
                    <div className="flex gap-2 justify-end pt-2 border-t border-slate-200">
                      <button onClick={() => setEditingId(null)} className="px-3 py-1.5 bg-slate-200 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1">
                        <X className="w-3 h-3" />Cancel
                      </button>
                      <button onClick={() => handleEditLesson(lesson.id)} disabled={savingLesson} className="px-3 py-1.5 bg-brand-blue text-white rounded-lg text-xs font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" />Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black text-slate-400 bg-slate-200 rounded px-1.5 py-0.5">#{idx + 1}</span>
                        <p className="text-sm font-black text-slate-900">{lesson.title}</p>
                        {lesson.is_preview && (
                          <span className="text-[10px] font-black bg-blue-100 text-brand-blue rounded-full px-2 py-0.5">Free Preview</span>
                        )}
                        {lesson.video_url ? (
                          <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 rounded-full px-2 py-0.5 flex items-center gap-1">
                            <Video className="w-2.5 h-2.5 text-emerald-600" />Video Uploaded
                          </span>
                        ) : (
                          <span className="text-[10px] font-black bg-amber-100 text-amber-800 rounded-full px-2 py-0.5 flex items-center gap-1">
                            <VideoOff className="w-2.5 h-2.5 text-amber-600" />Video not uploaded yet
                          </span>
                        )}
                        {lesson.duration ? (
                          <span className="text-[10px] font-bold bg-slate-200 text-slate-700 rounded-full px-2 py-0.5 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 text-slate-500" />{lesson.duration}
                          </span>
                        ) : lesson.video_url && lesson.video_processing_status === "processing" ? (
                          <span className="text-[10px] font-bold bg-amber-50 text-amber-700 rounded-full px-2 py-0.5 flex items-center gap-1">
                            <Loader2 className="w-2.5 h-2.5 text-amber-500 animate-spin" />Drive processing...
                          </span>
                        ) : lesson.video_url && lesson.video_processing_status === "unavailable" ? (
                          <span className="text-[10px] font-bold bg-red-50 text-red-600 rounded-full px-2 py-0.5 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 text-red-400" />Duration unavailable
                          </span>
                        ) : lesson.video_url ? (
                          <span className="text-[10px] font-bold bg-amber-50 text-amber-700 rounded-full px-2 py-0.5 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 text-amber-500" />Duration pending
                          </span>
                        ) : null}
                        {lesson.published ? (
                          <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5 flex items-center gap-1">
                            <Eye className="w-2.5 h-2.5" />Published
                          </span>
                        ) : (
                          <span className="text-[10px] font-black bg-slate-100 text-slate-500 rounded-full px-2 py-0.5 flex items-center gap-1">
                            <EyeOff className="w-2.5 h-2.5" />Draft
                          </span>
                        )}
                      </div>
                      {lesson.description && <p className="text-xs text-slate-500 mt-0.5">{lesson.description}</p>}
                      {lesson.video_url && (
                        <p className="text-[11px] text-slate-500 mt-1 font-mono truncate max-w-sm">
                          <span className="text-slate-400 font-sans font-bold">Source:</span> {lesson.video_url}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {lesson.video_url ? (
                        <>
                          <a
                            href={`/learn/${courseTarget}?lesson=${lesson.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors mr-1 shadow-sm"
                            title="Play video directly in classroom"
                          >
                            <Video className="w-3 h-3 text-emerald-700" /> Play
                          </a>
                          {/* Show Retry Duration button when duration is missing */}
                          {!lesson.duration && (
                            <button
                              onClick={() => handleRetryDuration(lesson)}
                              disabled={retryingDurationId === lesson.id}
                              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-brand-blue rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors mr-1"
                              title="Detect and save video duration"
                            >
                              {retryingDurationId === lesson.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Sparkles className="w-3 h-3" />
                              )}
                              {retryingDurationId === lesson.id ? "Detecting..." : "Get Duration"}
                            </button>
                          )}
                          <button
                            onClick={() => handleRemoveVideo(lesson.id)}
                            className="px-2 py-1 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors mr-1"
                            title="Remove video from this lesson"
                          >
                            <Trash2 className="w-3 h-3" /> Remove Video
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(lesson.id);
                            setEditForm({
                              title: lesson.title,
                              description: lesson.description ?? "",
                              video_url: "",
                              duration: "",
                              is_preview: lesson.is_preview,
                              published: lesson.published,
                            });
                          }}
                          className="px-2.5 py-1 bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors mr-1"
                          title="Upload or link video for this lesson"
                        >
                          <Plus className="w-3 h-3" /> Add Video
                        </button>
                      )}
                      <button onClick={() => handleReorder(idx, "up")} disabled={idx === 0} className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30">
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleReorder(idx, "down")} disabled={idx === lessons.length - 1} className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30">
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setEditingId(lesson.id); setEditForm({ title: lesson.title, description: lesson.description ?? "", video_url: lesson.video_url, duration: lesson.duration, is_preview: lesson.is_preview, published: lesson.published }); }}
                        className="p-1.5 text-slate-400 hover:text-brand-blue transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setConfirmDeleteId(lesson.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!selectedModuleId && selectedCourseId && !loadingModules && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400 font-bold text-sm">
          <Video className="w-10 h-10 mx-auto mb-3 opacity-40" />
          Select a module above to manage its lessons.
        </div>
      )}

      {!selectedCourseId && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400 font-bold text-sm">
          <Video className="w-10 h-10 mx-auto mb-3 opacity-40" />
          Select a course to get started.
        </div>
      )}

      {confirmDeleteId && (
        <ConfirmDialog
          isOpen={!!confirmDeleteId}
          title="Delete Lesson"
          message="Are you sure you want to delete this lesson? This cannot be undone."
          variant="danger"
          onConfirm={() => handleDeleteLesson(confirmDeleteId)}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}
