import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-2xl border bg-white p-12 text-center max-w-md mx-auto">
      <div className="text-5xl mb-3">🔍</div>
      <h2 className="text-xl font-semibold mb-1">Page not found</h2>
      <p className="text-slate-600 text-sm mb-4">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
