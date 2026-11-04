export default function CoursesLoading() {
  return (
    <div className="py-12 sm:py-16 bg-slate-50 min-h-screen animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm text-center max-w-3xl mx-auto space-y-3">
          <div className="h-6 w-32 bg-slate-100 rounded-full mx-auto" />
          <div className="h-9 w-72 bg-slate-200 rounded-xl mx-auto" />
          <div className="h-4 w-56 bg-slate-100 rounded mx-auto" />
        </div>
        {/* Course grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="h-48 bg-slate-100" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 bg-slate-200 rounded" />
                <div className="h-4 w-full bg-slate-100 rounded" />
                <div className="h-4 w-2/3 bg-slate-100 rounded" />
                <div className="flex justify-between pt-2">
                  <div className="h-6 w-20 bg-slate-200 rounded-lg" />
                  <div className="h-9 w-28 bg-slate-100 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
