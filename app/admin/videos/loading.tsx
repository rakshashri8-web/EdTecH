export default function VideosAdminLoading() {
  return (
    <div className="p-6 lg:p-8 space-y-6 lg:mt-0 mt-[52px] animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl" />
        <div className="space-y-1.5">
          <div className="h-6 w-48 bg-slate-200 rounded-lg" />
          <div className="h-3 w-64 bg-slate-100 rounded" />
        </div>
      </div>
      {/* Drive status banner skeleton */}
      <div className="h-20 bg-slate-100 rounded-2xl" />
      {/* Selector skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="h-5 w-36 bg-slate-200 rounded" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-slate-100 rounded-xl" />
          <div className="h-10 bg-slate-100 rounded-xl" />
        </div>
      </div>
      {/* Lessons skeleton */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-3">
        <div className="h-5 w-24 bg-slate-200 rounded mb-4" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex gap-3">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 bg-slate-200 rounded" />
              <div className="flex gap-2">
                <div className="h-5 w-20 bg-slate-100 rounded-full" />
                <div className="h-5 w-24 bg-slate-100 rounded-full" />
              </div>
            </div>
            <div className="flex gap-1">
              <div className="h-7 w-14 bg-slate-100 rounded-lg" />
              <div className="h-7 w-7 bg-slate-100 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
