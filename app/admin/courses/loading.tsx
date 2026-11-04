export default function CoursesAdminLoading() {
  return (
    <div className="p-6 lg:p-8 space-y-6 lg:mt-0 mt-[52px] animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl" />
        <div className="space-y-1.5">
          <div className="h-6 w-40 bg-slate-200 rounded-lg" />
          <div className="h-3 w-56 bg-slate-100 rounded" />
        </div>
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-50">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 bg-slate-200 rounded" />
              <div className="h-3 w-24 bg-slate-100 rounded" />
            </div>
            <div className="h-6 w-20 bg-slate-100 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
