"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  Save,
  Loader2,
  GripVertical,
  Edit2,
  Check,
  X,
} from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  duration: string;
  order: number;
  is_preview: boolean;
  published: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  order: number;
  lessons?: Lesson[];
}

interface CourseFormData {
  title: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  original_price: number;
  difficulty: string;
  duration: string;
  thumbnail: string;
  instructor_name: string;
  instructor_role: string;
  published: boolean;
}

interface CourseFormProps {
  initialData?: Partial<CourseFormData>;
  courseId?: string;
  initialModules?: Module[];
}

const CATEGORIES = ["Data", "AI & ML", "Generative AI", "Agentic AI"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced", "All Levels"];

export default function CourseForm({ initialData, courseId, initialModules = [] }: CourseFormProps) {
  const router = useRouter();
  const isEdit = !!courseId;
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CourseFormData>({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    description: initialData?.description ?? "",
    category: initialData?.category ?? "Data",
    price: initialData?.price ?? 0,
    original_price: initialData?.original_price ?? 0,
    difficulty: initialData?.difficulty ?? "Beginner",
    duration: initialData?.duration ?? "",
    thumbnail: initialData?.thumbnail ?? "",
    instructor_name: initialData?.instructor_name ?? "",
    instructor_role: initialData?.instructor_role ?? "",
    published: initialData?.published ?? false,
  });

  // Modules state
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [moduleForm, setModuleForm] = useState({ title: "", description: "" });
  const [addingModule, setAddingModule] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingModuleData, setEditingModuleData] = useState({ title: "", description: "" });
  const [deletingModule, setDeletingModule] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [savingModule, setSavingModule] = useState(false);

  const handleFormChange = (field: keyof CourseFormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "title" && !isEdit) {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      setForm((prev) => ({ ...prev, slug }));
    }
  };

  const handleSaveCourse = async () => {
    if (!form.title || !form.slug) {
      alert("Title and slug are required.");
      return;
    }
    setSaving(true);
    try {
      const method = isEdit ? "PATCH" : "POST";
      const body = isEdit ? { id: courseId, ...form } : form;
      const res = await fetch("/api/admin/courses", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      if (!isEdit && data.id) {
        router.push(`/admin/courses/${data.id}`);
      } else {
        router.refresh();
      }
    } catch (err: any) {
      alert(`Failed to save course: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleAddModule = async () => {
    if (!moduleForm.title) return;
    if (!courseId) { alert("Save the course first before adding modules."); return; }
    setSavingModule(true);
    try {
      const res = await fetch("/api/admin/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_id: courseId,
          title: moduleForm.title,
          description: moduleForm.description || null,
          order: modules.length + 1,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const newModule = await res.json();
      setModules((prev) => [...prev, { ...newModule, lessons: [] }]);
      setModuleForm({ title: "", description: "" });
      setAddingModule(false);
    } catch (err: any) {
      alert(`Failed to add module: ${err.message}`);
    } finally {
      setSavingModule(false);
    }
  };

  const handleEditModule = async (moduleId: string) => {
    if (!editingModuleData.title) return;
    setSavingModule(true);
    try {
      const res = await fetch("/api/admin/modules", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: moduleId,
          title: editingModuleData.title,
          description: editingModuleData.description || null,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setModules((prev) =>
        prev.map((m) =>
          m.id === moduleId
            ? { ...m, title: editingModuleData.title, description: editingModuleData.description || null }
            : m
        )
      );
      setEditingModuleId(null);
    } catch (err: any) {
      alert(`Failed to update module: ${err.message}`);
    } finally {
      setSavingModule(false);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    setDeletingModule(moduleId);
    try {
      const res = await fetch(`/api/admin/modules?id=${moduleId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setModules((prev) => prev.filter((m) => m.id !== moduleId));
    } catch (err: any) {
      alert(`Failed to delete module: ${err.message}`);
    } finally {
      setDeletingModule(null);
      setConfirmDelete(null);
    }
  };

  const handleReorderModule = async (index: number, direction: "up" | "down") => {
    const newModules = [...modules];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newModules.length) return;
    [newModules[index], newModules[swapIndex]] = [newModules[swapIndex], newModules[index]];
    const updatedModules = newModules.map((m, i) => ({ ...m, order: i + 1 }));
    setModules(updatedModules);
    // Persist reorder
    await Promise.all(
      updatedModules.map((m) =>
        fetch("/api/admin/modules", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: m.id, order: m.order }),
        })
      )
    );
  };

  const inputCls = "w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue";
  const labelCls = "block text-xs font-black text-slate-700 mb-1.5";

  return (
    <div className="space-y-8">
      {/* Course Details Form */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
        <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-4">Course Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Title *</label>
            <input type="text" value={form.title} onChange={(e) => handleFormChange("title", e.target.value)} className={inputCls} placeholder="e.g. Complete Python Bootcamp" />
          </div>
          <div>
            <label className={labelCls}>Slug *</label>
            <input type="text" value={form.slug} onChange={(e) => handleFormChange("slug", e.target.value)} className={inputCls} placeholder="e.g. complete-python-bootcamp" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Description</label>
            <textarea rows={4} value={form.description} onChange={(e) => handleFormChange("description", e.target.value)} className={inputCls} placeholder="Course description..." />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select value={form.category} onChange={(e) => handleFormChange("category", e.target.value)} className={inputCls}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Difficulty</label>
            <select value={form.difficulty} onChange={(e) => handleFormChange("difficulty", e.target.value)} className={inputCls}>
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Price (₹)</label>
            <input type="number" value={form.price} onChange={(e) => handleFormChange("price", Number(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Original Price (₹)</label>
            <input type="number" value={form.original_price} onChange={(e) => handleFormChange("original_price", Number(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Duration</label>
            <input type="text" value={form.duration} onChange={(e) => handleFormChange("duration", e.target.value)} className={inputCls} placeholder="e.g. 40 hours" />
          </div>
          <div>
            <label className={labelCls}>Thumbnail URL</label>
            <input type="text" value={form.thumbnail} onChange={(e) => handleFormChange("thumbnail", e.target.value)} className={inputCls} placeholder="https://..." />
          </div>
          <div>
            <label className={labelCls}>Instructor Name</label>
            <input type="text" value={form.instructor_name} onChange={(e) => handleFormChange("instructor_name", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Instructor Role</label>
            <input type="text" value={form.instructor_role} onChange={(e) => handleFormChange("instructor_role", e.target.value)} className={inputCls} placeholder="e.g. Senior Data Scientist" />
          </div>
          <div className="flex items-center gap-3 sm:col-span-2">
            <button
              type="button"
              onClick={() => handleFormChange("published", !form.published)}
              className={`relative w-12 h-6 rounded-full transition-colors ${form.published ? "bg-brand-blue" : "bg-slate-300"}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow ${form.published ? "left-7" : "left-1"}`} />
            </button>
            <span className="text-sm font-bold text-slate-700">{form.published ? "Published" : "Draft (not visible to students)"}</span>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            onClick={handleSaveCourse}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-brand-blue text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-60 transition-colors shadow-md shadow-brand-blue/20"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEdit ? "Save Changes" : "Create Course"}
          </button>
        </div>
      </div>

      {/* Module Manager — only when editing */}
      {isEdit && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-black text-slate-900">Modules</h2>
            <button
              onClick={() => setAddingModule(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-blue text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Module
            </button>
          </div>

          {/* Add Module Form */}
          {addingModule && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-sm font-black text-slate-800">New Module</h3>
              <div>
                <label className={labelCls}>Title *</label>
                <input
                  type="text"
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm((p) => ({ ...p, title: e.target.value }))}
                  className={inputCls}
                  placeholder="Module title..."
                />
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <input
                  type="text"
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm((p) => ({ ...p, description: e.target.value }))}
                  className={inputCls}
                  placeholder="Optional description..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setAddingModule(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-200 hover:bg-slate-300 transition-colors">Cancel</button>
                <button onClick={handleAddModule} disabled={savingModule || !moduleForm.title} className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-blue hover:bg-blue-700 disabled:opacity-50 transition-colors">
                  {savingModule ? "Saving..." : "Add Module"}
                </button>
              </div>
            </div>
          )}

          {/* Module List */}
          <div className="space-y-3">
            {modules.length === 0 && !addingModule && (
              <p className="text-center py-8 text-slate-400 font-bold text-sm">No modules yet. Click &quot;Add Module&quot; to create one.</p>
            )}
            {modules.map((mod, idx) => (
              <div key={mod.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-start gap-3">
                  <GripVertical className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    {editingModuleId === mod.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editingModuleData.title}
                          onChange={(e) => setEditingModuleData((p) => ({ ...p, title: e.target.value }))}
                          className={inputCls}
                        />
                        <input
                          type="text"
                          value={editingModuleData.description}
                          onChange={(e) => setEditingModuleData((p) => ({ ...p, description: e.target.value }))}
                          className={inputCls}
                          placeholder="Description..."
                        />
                        <div className="flex gap-2">
                          <button onClick={() => handleEditModule(mod.id)} disabled={savingModule} className="px-3 py-1.5 bg-brand-blue text-white rounded-lg text-xs font-bold">
                            <Check className="w-3.5 h-3.5 inline mr-1" />Save
                          </button>
                          <button onClick={() => setEditingModuleId(null)} className="px-3 py-1.5 bg-slate-200 text-slate-600 rounded-lg text-xs font-bold">
                            <X className="w-3.5 h-3.5 inline mr-1" />Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black text-slate-400 bg-slate-200 rounded-md px-1.5 py-0.5">#{idx + 1}</span>
                          <p className="text-sm font-black text-slate-900">{mod.title}</p>
                        </div>
                        {mod.description && <p className="text-xs text-slate-500 mt-0.5">{mod.description}</p>}
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => handleReorderModule(idx, "up")} disabled={idx === 0} className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-colors">
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleReorderModule(idx, "down")} disabled={idx === modules.length - 1} className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-colors">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setEditingModuleId(mod.id); setEditingModuleData({ title: mod.title, description: mod.description ?? "" }); }}
                      className="p-1.5 text-slate-400 hover:text-brand-blue transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setConfirmDelete(mod.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirm Delete Module Dialog */}
      {confirmDelete && (
        <ConfirmDialog
          isOpen={!!confirmDelete}
          title="Delete Module"
          message="Are you sure you want to delete this module? All lessons inside it will also be removed."
          variant="danger"
          onConfirm={() => handleDeleteModule(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
