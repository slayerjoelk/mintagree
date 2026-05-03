import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { receipts } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalResult, signedResult, pendingResult, thisMonthResult] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(receipts)
      .where(eq(receipts.userId, session.user.id))
      .limit(1),
    db
      .select({ count: sql<number>`count(*)` })
      .from(receipts)
      .where(and(eq(receipts.userId, session.user.id), eq(receipts.status, "signed")))
      .limit(1),
    db
      .select({ count: sql<number>`count(*)` })
      .from(receipts)
      .where(
        and(
          eq(receipts.userId, session.user.id),
          eq(receipts.status, "sent")
        )
      )
      .limit(1),
    db
      .select({ count: sql<number>`count(*)` })
      .from(receipts)
      .where(
        and(
          eq(receipts.userId, session.user.id),
          sql`created_at >= ${Math.floor(monthStart.getTime() / 1000)}`
        )
      )
      .limit(1),
  ]);

  const total = totalResult[0];
  const signed = signedResult[0];
  const pending = pendingResult[0];
  const thisMonth = thisMonthResult[0];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
          Welcome{session.user.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="text-slate-600 mt-1">
          Send conversation receipts and get client sign-off in minutes.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <StatCard value={total?.count ?? 0} label="Total receipts" />
        <StatCard value={signed?.count ?? 0} label="Signed" />
        <StatCard value={pending?.count ?? 0} label="Pending" />
        <StatCard value={thisMonth?.count ?? 0} label="This month" />
      </div>

      <div className="flex gap-3">
        <Link
          href="/dashboard/receipts/new"
          className="inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Create new receipt
        </Link>
        <Link
          href="/dashboard/receipts"
          className="inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-medium bg-white hover:bg-slate-50"
        >
          View all receipts
        </Link>
      </div>
    </div>
  );
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="text-3xl font-semibold">{value}</div>
      <div className="text-sm text-slate-600 mt-1">{label}</div>
    </div>
  );
}
