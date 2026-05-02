export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-48 bg-slate-200 rounded" />
      <div className="h-4 w-72 bg-slate-200 rounded" />
      <div className="grid md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border bg-white p-5 space-y-2">
            <div className="h-8 w-12 bg-slate-200 rounded" />
            <div className="h-3 w-20 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <div className="h-11 w-40 bg-slate-200 rounded-xl" />
        <div className="h-11 w-40 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
}
