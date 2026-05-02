"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="rounded-2xl border bg-white p-8 shadow-sm text-center max-w-md mx-auto">
      <div className="text-4xl mb-3">⚠️</div>
      <h2 className="text-xl font-semibold mb-1">Something went wrong</h2>
      <p className="text-slate-600 text-sm mb-4">
        An error occurred while loading this page.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
      >
        Try again
      </button>
    </div>
  );
}
