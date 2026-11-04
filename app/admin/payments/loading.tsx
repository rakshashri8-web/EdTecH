export default function PaymentsAdminLoading() {
  return (
    <div className="p-6 lg:p-8 space-y-6 lg:mt-0 mt-[52px] animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-xl" />
        <div className="space-y-1.5">
          <div className="h-6 w-44 bg-slate-200 rounded-lg" />
          <div className="h-3 w-72 bg-slate-100 rounded" />
        </div>
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex gap-3">
          {["All", "Pending", "Approved", "Rejected"].map((t) => (
            <div key={t} className="h-8 w-20 bg-slate-100 rounded-full" />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-slate-50 grid grid-cols-5 gap-4">
            <div className="space-y-1.5">
              <div className="h-4 w-28 bg-slate-200 rounded" />
              <div className="h-3 w-36 bg-slate-100 rounded" />
            </div>
            <div className="h-4 w-32 bg-slate-100 rounded self-center" />
            <div className="h-4 w-20 bg-slate-100 rounded self-center" />
            <div className="h-5 w-20 bg-slate-100 rounded-full self-center" />
            <div className="flex gap-2 self-center">
              <div className="h-7 w-20 bg-emerald-100 rounded-lg" />
              <div className="h-7 w-16 bg-red-100 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
