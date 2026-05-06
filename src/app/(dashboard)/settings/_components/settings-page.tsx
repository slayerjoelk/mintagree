"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SettingsPageProps {
  user: {
    id?: string | null;
    email?: string | null;
    name?: string | null;
    plan?: string | null;
  } | null;
}

const PLAN_LABELS: Record<string, string> = {
  starter: "Starter",
  pro: "Pro",
  enterprise: "Enterprise",
};

export default function SettingsPage({ user }: SettingsPageProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const planKey = user?.plan;
  const planLabel = planKey ? (PLAN_LABELS[planKey] ?? planKey) : "Free";

  async function handleDeleteAccount() {
    if (!confirm("Are you sure? This permanently deletes all your receipts, clients, and templates.")) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/me", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      router.push("/login");
    } catch {
      alert("Failed to delete account");
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-semibold mb-6">Settings</h2>

      <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-6">
        <div>
          <h3 className="font-semibold mb-1">Account</h3>
          <div className="text-sm text-slate-600 space-y-2">
            <div>
              <span className="text-slate-400">Email:</span> {user?.email || "—"}
            </div>
            <div>
              <span className="text-slate-400">Name:</span> {user?.name || "Not set"}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Plan:</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs">{planLabel}</span>
              <Link
                href="/dashboard/settings/billing"
                className="text-xs text-emerald-700 hover:underline"
              >
                Upgrade
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-1">Email notifications</h3>
          <p className="text-sm text-slate-600">
            You&apos;ll receive email notifications when clients sign or dispute your
            conversation receipts.
          </p>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-1">Danger zone</h3>
          <p className="text-sm text-slate-600 mb-3">
            Delete your account and all associated data. This action is irreversible.
          </p>
          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 border-red-200 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete account"}
          </button>
        </div>
      </div>
    </div>
  );
}
