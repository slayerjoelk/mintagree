export default function DefaultLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-40 bg-slate-200 rounded" />
      <div className="h-4 w-64 bg-slate-200 rounded" />
      <div className="rounded-2xl border bg-white p-6 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex-1 h-5 bg-slate-200 rounded" />
            <div className="w-20 h-5 bg-slate-200 rounded" />
            <div className="w-16 h-5 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
