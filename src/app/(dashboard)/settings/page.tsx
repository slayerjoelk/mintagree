import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const PLAN_LABELS: Record<string, string> = {
  starter: "Starter",
  pro: "Pro",
  enterprise: "Enterprise",
};

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const planKey = (session.user as { plan?: string }).plan;
  const planLabel = planKey ? (PLAN_LABELS[planKey] ?? planKey) : "Free";

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-semibold mb-6">Settings</h2>

      <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-6">
        <div>
          <h3 className="font-semibold mb-1">Account</h3>
          <div className="text-sm text-slate-600 space-y-2">
            <div>
              <span className="text-slate-400">Email:</span> {session.user.email}
            </div>
            <div>
              <span className="text-slate-400">Name:</span>{" "}
              {session.user.name || "Not set"}
            </div>
            <div>
              <span className="text-slate-400">Plan:</span>{" "}
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs">
                {planLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-1">Email notifications</h3>
          <p className="text-sm text-slate-600">
            You'll receive email notifications when clients sign or dispute your
            conversation receipts. Configure these in your Resend dashboard.
          </p>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-1">Danger zone</h3>
          <p className="text-sm text-slate-600 mb-3">
            Delete your account and all associated data. This action is
            irreversible.
          </p>
          <button className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 border-red-200">
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
}
