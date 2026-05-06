import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-semibold mb-4">Analytics</h2>
      <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
        <p className="text-slate-600">Analytics dashboard coming soon.</p>
        <p className="text-sm text-slate-500 mt-2">Track receipt volume, sign-off rates, and client engagement.</p>
      </div>
    </div>
  );
}
