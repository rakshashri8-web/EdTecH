export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-50 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Welcome header */}
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-200 rounded-xl" />
          <div className="h-4 w-48 bg-slate-100 rounded-lg" />
        </div>
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="h-3 w-20 bg-slate-100 rounded" />
              <div className="h-7 w-12 bg-slate-200 rounded-lg" />
            </div>
          ))}
        </div>
        {/* Enrolled courses */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="h-6 w-44 bg-slate-200 rounded-lg" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-16 h-16 bg-slate-200 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-48 bg-slate-200 rounded" />
                <div className="h-3 w-32 bg-slate-100 rounded" />
                <div className="h-2 w-full bg-slate-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
