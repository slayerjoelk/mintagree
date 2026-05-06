import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found — MintAgree",
};

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
      <div className="rounded-2xl border bg-white p-12 shadow-sm max-w-md text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-2xl font-semibold mb-2">Page not found</h1>
        <p className="text-slate-600 text-sm mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border px-5 py-2.5 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Go home
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center justify-center rounded-xl border px-5 py-2.5 text-sm font-medium bg-white hover:bg-slate-50"
          >
            Try the demo
          </Link>
        </div>
      </div>
    </div>
  );
}
