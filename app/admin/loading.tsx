export default function AdminLoading() {
  return (
    <div className="p-6 lg:p-8 space-y-8 lg:mt-0 mt-[52px] animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-56 bg-slate-200 rounded-xl" />
        <div className="h-4 w-72 bg-slate-100 rounded-lg" />
      </div>
      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-3">
            <div className="h-3 w-24 bg-slate-100 rounded" />
            <div className="h-8 w-16 bg-slate-200 rounded-lg" />
          </div>
        ))}
      </div>
      {/* Table skeleton */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="h-5 w-48 bg-slate-200 rounded-lg" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-slate-50 flex gap-4">
            <div className="h-4 w-32 bg-slate-100 rounded" />
            <div className="h-4 w-24 bg-slate-100 rounded" />
            <div className="h-4 w-20 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
