"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import { format, subDays, parseISO } from "date-fns";

interface Overview {
  totalReceipts: number;
  sent: number;
  signed: number;
  disputed: number;
  signOffRate: number;
  avgTimeToSign: number | null;
  totalClients: number;
  activeClients: number;
}

interface TrendPoint { month: string; created: number; signed: number; disputed: number; }
interface ClientStats { email: string; name: string | null; receiptsSent: number; signed: number; signOffRate: number; lastReceiptAt: string | null; }
interface StatusPoint { name: string; value: number; }
interface ActivityDay { day: string; created: number; signed: number; }

interface AnalyticsData {
  overview: Overview;
  trends: TrendPoint[];
  topClients: ClientStats[];
  statusBreakdown: StatusPoint[];
  activity: ActivityDay[];
}

const STATUS_COLORS: Record<string, string> = {
  Draft: "#94a3b8",
  Sent: "#3b82f6",
  Signed: "#10b981",
  Disputed: "#ef4444",
};

function Card({ title, value, sub, accent = "zinc" }: { title: string; value: string; sub?: string; accent?: string }) {
  const accentClass = { zinc: "text-zinc-200", blue: "text-blue-400", green: "text-emerald-400", red: "text-red-400" }[accent] ?? "text-zinc-200";
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{title}</p>
      <p className={`mt-1 text-2xl font-semibold ${accentClass}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-zinc-500">{sub}</p>}
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setData(d);
        setLoading(false);
      })
      .catch(() => { setError("Failed to load analytics"); setLoading(false); });
  }, []);

  const filledActivity = useMemo(() => {
    if (!data) return [];
    const result: ActivityDay[] = [];
    const lookup = Object.fromEntries(data.activity.map((a) => [a.day, a]));
    for (let i = 29; i >= 0; i--) {
      const day = format(subDays(new Date(), i), "yyyy-MM-dd");
      result.push(lookup[day] ?? { day, created: 0, signed: 0 });
    }
    return result;
  }, [data]);

  const exportCsv = useCallback(() => {
    if (!data) return;
    const rows = [
      ["Metric", "Value"],
      ["Total Receipts", String(data.overview.totalReceipts)],
      ["Sent", String(data.overview.sent)],
      ["Signed", String(data.overview.signed)],
      ["Disputed", String(data.overview.disputed)],
      ["Sign-off Rate ", data.overview.signOffRate + "%"],
      ["Avg Time to Sign", (data.overview.avgTimeToSign ?? "N/A") + " min"],
      ["Total Clients", String(data.overview.totalClients)],
      ["Active Clients", String(data.overview.activeClients)],
      [],
      ["Month", "Created", "Signed", "Disputed"],
      ...data.trends.map((t) => [t.month, String(t.created), String(t.signed), String(t.disputed)]),
      [],
      ["Day", "Created", "Signed"],
      ...filledActivity.map((a) => [a.day, String(a.created), String(a.signed)]),
      [],
      ["Email", "Name", "Receipts Sent", "Signed", "Rate", "Last Receipt"],
      ...data.topClients.map((c) => [
        c.email,
        c.name ?? "",
        String(c.receiptsSent),
        String(c.signed),
        c.signOffRate + "%",
        c.lastReceiptAt ? format(parseISO(c.lastReceiptAt), "yyyy-MM-dd") : "N/A",
      ]),
    ];
    const escapeCsv = (f: string) => `"${f.replace(/"/g, '""')}"`;
    const csv = rows.map((r) => r.map((f) => escapeCsv(String(f))).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mintagree-analytics-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data, filledActivity]);

  if (loading) return <div className="max-w-6xl mx-auto p-6 text-zinc-400">Loading analytics…</div>;
  if (error) return <div className="max-w-6xl mx-auto p-6 text-red-400">{error}</div>;
  if (!data) return <div className="max-w-6xl mx-auto p-6 text-zinc-400">No data</div>;

  const o = data.overview;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-zinc-100">Analytics</h1>
        <button
          onClick={exportCsv}
          className="text-sm bg-zinc-100 text-zinc-950 px-4 py-2 rounded-lg font-medium hover:bg-white transition-colors"
        >
          Export CSV
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card
          title="Total Receipts"
          value={String(o.totalReceipts)}
          sub={`${o.signed} signed · ${o.disputed} disputed`}
          accent="blue"
        />
        <Card
          title="Sign-off Rate"
          value={`${o.signOffRate}%`}
          sub={o.avgTimeToSign !== null ? `Avg ${o.avgTimeToSign} min to sign` : "No signed receipts yet"}
          accent="green"
        />
        <Card
          title="Clients"
          value={String(o.totalClients)}
          sub={`${o.activeClients} active`}
          accent="zinc"
        />
        <Card
          title="Pending"
          value={String(o.sent)}
          sub="Awaiting sign-off"
          accent="zinc"
        />
      </div>

      {/* Charts Row 1: Monthly Trends + Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <p className="text-sm font-medium text-zinc-400 mb-4">Monthly Trends</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={[...data.trends].reverse()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="month" stroke="#52525b" fontSize={11} />
              <YAxis stroke="#52525b" fontSize={11} />
              <Tooltip
                contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, color: "#e4e4e7" }}
              />
              <Bar dataKey="created" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="signed" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="disputed" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <p className="text-sm font-medium text-zinc-400 mb-4">Status Breakdown</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Tooltip
                contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, color: "#e4e4e7" }}
              />
              <Pie
                data={data.statusBreakdown}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                stroke="none"
              >
                {data.statusBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || "#71717a"} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {data.statusBreakdown.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs text-zinc-400">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[s.name] }} />
                {s.name} ({s.value})
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 30-Day Activity */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 mb-6">
        <p className="text-sm font-medium text-zinc-400 mb-4">30-Day Activity</p>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={filledActivity}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="day" stroke="#52525b" fontSize={10} tickFormatter={(d) => format(parseISO(d), "dd MMM")} />
            <YAxis stroke="#52525b" fontSize={11} />
            <Tooltip
              contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, color: "#e4e4e7" }}
            />
            <Line type="monotone" dataKey="created" stroke="#3b82f6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="signed" stroke="#10b981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Clients Table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <p className="text-sm font-medium text-zinc-400 mb-4">Top Clients</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500">
                <th className="text-left py-2 pr-4 font-medium">Name</th>
                <th className="text-left py-2 pr-4 font-medium">Email</th>
                <th className="text-right py-2 pr-4 font-medium">Sent</th>
                <th className="text-right py-2 pr-4 font-medium">Signed</th>
                <th className="text-right py-2 pr-4 font-medium">Rate</th>
                <th className="text-right py-2 font-medium">Last Receipt</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              {data.topClients.map((c) => (
                <tr key={c.email} className="border-b border-zinc-800/40 last:border-none">
                  <td className="py-2 pr-4">{c.name || "—"}</td>
                  <td className="py-2 pr-4 text-zinc-400">{c.email}</td>
                  <td className="text-right py-2 pr-4">{c.receiptsSent}</td>
                  <td className="text-right py-2 pr-4">{c.signed}</td>
                  <td className="text-right py-2 pr-4 font-medium">
                    <span className={c.signOffRate >= 80 ? "text-emerald-400" : c.signOffRate >= 50 ? "text-amber-400" : "text-red-400"}>
                      {c.signOffRate}%
                    </span>
                  </td>
                  <td className="text-right py-2 text-zinc-400">
                    {c.lastReceiptAt ? format(parseISO(c.lastReceiptAt), "yyyy-MM-dd") : "—"}
                  </td>
                </tr>
              ))}
              {data.topClients.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-zinc-500">No clients with receipts yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
