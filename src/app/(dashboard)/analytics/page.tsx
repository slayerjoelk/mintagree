import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { receipts } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const uid = session.user.id;
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const weekAgoSeconds = Math.floor((now.getTime() - 7 * 24 * 60 * 60 * 1000) / 1000);
  const monthStartSeconds = Math.floor(monthStart.getTime() / 1000);

  // Simple parallel queries — no nested .then() chains
  const [allTime] = await db
    .select({ count: sql<number>`count(*)` })
    .from(receipts)
    .where(eq(receipts.userId, uid))
    .limit(1);

  const [thisMonthSent] = await db
    .select({ count: sql<number>`count(*)` })
    .from(receipts)
    .where(and(eq(receipts.userId, uid), sql`created_at >= ${monthStartSeconds}`))
    .limit(1);

  const [thisWeekSent] = await db
    .select({ count: sql<number>`count(*)` })
    .from(receipts)
    .where(and(eq(receipts.userId, uid), sql`created_at >= ${weekAgoSeconds}`))
    .limit(1);

  const [signed] = await db
    .select({ count: sql<number>`count(*)` })
    .from(receipts)
    .where(and(eq(receipts.userId, uid), eq(receipts.status, "signed")))
    .limit(1);

  const [disputed] = await db
    .select({ count: sql<number>`count(*)` })
    .from(receipts)
    .where(and(eq(receipts.userId, uid), eq(receipts.status, "disputed")))
    .limit(1);

  const [pending] = await db
    .select({ count: sql<number>`count(*)` })
    .from(receipts)
    .where(and(eq(receipts.userId, uid), eq(receipts.status, "sent")))
    .limit(1);

  const signedRow = signed?.count ?? 0;
  const totalRow = allTime?.count ?? 0;
  const signOffRate = totalRow > 0 ? Math.round((signedRow / totalRow) * 100) : 0;

  const topClients = await db.all(
    sql`
      SELECT client_email, count(*) as total
      FROM receipts
      WHERE user_id = ${uid} AND client_email IS NOT NULL
      GROUP BY client_email
      ORDER BY total DESC
      LIMIT 5
    `
  ) as Array<{ client_email: string; total: number }>;

  const dailyVolume = await db.all(
    sql`
      SELECT date(created_at, 'unixepoch') as day, count(*) as count
      FROM receipts
      WHERE user_id = ${uid} AND created_at >= ${weekAgoSeconds}
      GROUP BY day
      ORDER BY day
    `
  ) as Array<{ day: string; count: number }>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Analytics</h2>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <StatCard value={totalRow} label="Total receipts" />
        <StatCard value={thisMonthSent?.count ?? 0} label="This month" />
        <StatCard value={thisWeekSent?.count ?? 0} label="Last 7 days" />
        <StatCard value={`${signOffRate}%`} label="Sign-off rate" />
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <StatCard value={signedRow} label="Signed ✅" color="emerald" />
        <StatCard value={disputed?.count ?? 0} label="Disputed ⚡" color="red" />
        <StatCard value={pending?.count ?? 0} label="Pending" color="slate" />
      </div>

      {topClients.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold mb-3">Top clients</h3>
          <div className="rounded-2xl border bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Email</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-600">Receipts</th>
                </tr>
              </thead>
              <tbody>
                {topClients.map((c) => (
                  <tr
                    key={c.client_email}
                    className="border-b last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3">{c.client_email}</td>
                    <td className="px-4 py-3 text-right font-medium">{c.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {dailyVolume.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Receipt volume (last 7 days)</h3>
          <div className="rounded-2xl border bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Date</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-600">Count</th>
                </tr>
              </thead>
              <tbody>
                {dailyVolume.map((d) => (
                  <tr
                    key={d.day}
                    className="border-b last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3">{d.day}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="inline-block h-3 rounded bg-emerald-400"
                          style={{ width: `${Math.min(d.count * 8, 120)}px` }}
                        />
                        {d.count}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  value,
  label,
  color = "slate",
}: {
  value: number | string;
  label: string;
  color?: "emerald" | "red" | "slate";
}) {
  const colors: Record<string, string> = {
    emerald: "text-emerald-600",
    red: "text-red-600",
    slate: "",
  };
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className={`text-3xl font-semibold ${colors[color]}`}>{value}</div>
      <div className="text-sm text-slate-600 mt-1">{label}</div>
    </div>
  );
}
