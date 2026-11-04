export default function StudentsAdminLoading() {
  return (
    <div className="p-6 lg:p-8 space-y-6 lg:mt-0 mt-[52px] animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-100 rounded-xl" />
        <div className="space-y-1.5">
          <div className="h-6 w-40 bg-slate-200 rounded-lg" />
          <div className="h-3 w-48 bg-slate-100 rounded" />
        </div>
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="h-9 w-72 bg-slate-100 rounded-xl" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-slate-50 flex items-center gap-4">
            <div className="w-9 h-9 bg-slate-100 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-40 bg-slate-200 rounded" />
              <div className="h-3 w-56 bg-slate-100 rounded" />
            </div>
            <div className="h-5 w-20 bg-slate-100 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
