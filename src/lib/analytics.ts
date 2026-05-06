import { eq, sql, and, desc, gte } from "drizzle-orm";
import { db } from "@/lib/db";
import { receipts, signatures, clients } from "@/lib/db/schema";

export interface UserAnalytics {
  overview: {
    totalReceipts: number;
    sent: number;
    signed: number;
    disputed: number;
    signOffRate: number;
    avgTimeToSign: number | null; // minutes
    totalClients: number;
    activeClients: number;
  };
  trends: TrendPoint[];
  topClients: ClientStats[];
  statusBreakdown: StatusPoint[];
  activity: ActivityDay[];
}

export interface TrendPoint {
  month: string;
  created: number;
  signed: number;
  disputed: number;
}

export interface ClientStats {
  email: string;
  name: string | null;
  receiptsSent: number;
  signed: number;
  signOffRate: number;
  lastReceiptAt: string | null;
}

export interface StatusPoint {
  name: string;
  value: number;
}

export interface ActivityDay {
  day: string;
  created: number;
  signed: number;
}

export async function getUserAnalytics(userId: string): Promise<UserAnalytics> {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);

  // Overview counts
  const [overviewRow] = await db
    .select({
      total: sql<number>`count(*)`.as("total"),
      sent: sql<number>`sum(case when ${receipts.status} = 'sent' then 1 else 0 end)`.as("sent"),
      signed: sql<number>`sum(case when ${receipts.status} = 'signed' then 1 else 0 end)`.as("signed"),
      disputed: sql<number>`sum(case when ${receipts.status} = 'disputed' then 1 else 0 end)`.as("disputed"),
    })
    .from(receipts)
    .where(eq(receipts.userId, userId));

  const total = overviewRow?.total ?? 0;
  const signed = overviewRow?.signed ?? 0;
  const signOffRate = total > 0 ? Math.round((signed / total) * 1000) / 10 : 0;

  // Average time to sign (minutes) — fetch signed receipts with their signatures, compute in JS
  const signedReceipts = await db
    .select({
      receiptId: receipts.id,
      receiptCreated: receipts.createdAt,
      sigCreated: signatures.createdAt,
    })
    .from(receipts)
    .innerJoin(signatures, eq(signatures.receiptId, receipts.id))
    .where(and(eq(receipts.userId, userId), eq(receipts.status, "signed")));

  let avgTimeToSign: number | null = null;
  if (signedReceipts.length > 0) {
    const totalMinutes = signedReceipts.reduce((sum, r) => {
      const created = r.receiptCreated instanceof Date ? r.receiptCreated.getTime() : Number(r.receiptCreated) * 1000;
      const sig = r.sigCreated instanceof Date ? r.sigCreated.getTime() : Number(r.sigCreated) * 1000;
      return sum + (sig - created) / 60000;
    }, 0);
    avgTimeToSign = Math.round(totalMinutes / signedReceipts.length);
  }

  // Client counts
  const [clientRow] = await db
    .select({ total: sql<number>`count(*)` })
    .from(clients)
    .where(eq(clients.userId, userId));

  const activeClientRows = await db
    .select({ email: receipts.clientEmail })
    .from(receipts)
    .where(and(eq(receipts.userId, userId), eq(receipts.status, "signed"), sql`${receipts.clientEmail} is not null`))
    .groupBy(receipts.clientEmail);

  const activeClients = activeClientRows.length;

  // Monthly trends (6 months)
  const trendRows = await db
    .select({
      month: sql<string>`strftime('%Y-%m', ${receipts.createdAt}, 'unixepoch')`.as("month"),
      created: sql<number>`count(*)`.as("created"),
      signed: sql<number>`sum(case when ${receipts.status} = 'signed' then 1 else 0 end)`.as("signed"),
      disputed: sql<number>`sum(case when ${receipts.status} = 'disputed' then 1 else 0 end)`.as("disputed"),
    })
    .from(receipts)
    .where(and(eq(receipts.userId, userId), gte(receipts.createdAt, sixMonthsAgo)))
    .groupBy(sql`strftime('%Y-%m', ${receipts.createdAt}, 'unixepoch')`)
    .orderBy(desc(sql`strftime('%Y-%m', ${receipts.createdAt}, 'unixepoch')`));

  // Top clients
  const topClientRows = await db
    .select({
      email: receipts.clientEmail,
      name: receipts.clientName,
      total: sql<number>`count(*)`.as("total"),
      signed: sql<number>`sum(case when ${receipts.status} = 'signed' then 1 else 0 end)`.as("signed"),
      lastReceiptAt: sql<number>`max(${receipts.createdAt})`.as("lastReceiptAt"),
    })
    .from(receipts)
    .where(and(eq(receipts.userId, userId), sql`${receipts.clientEmail} is not null`))
    .groupBy(receipts.clientEmail)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  // Daily activity (30 days)
  const activityRows = await db
    .select({
      day: sql<string>`strftime('%Y-%m-%d', ${receipts.createdAt}, 'unixepoch')`.as("day"),
      created: sql<number>`count(*)`.as("created"),
      signed: sql<number>`sum(case when ${receipts.status} = 'signed' then 1 else 0 end)`.as("signed"),
    })
    .from(receipts)
    .where(and(eq(receipts.userId, userId), gte(receipts.createdAt, thirtyDaysAgo)))
    .groupBy(sql`strftime('%Y-%m-%d', ${receipts.createdAt}, 'unixepoch')`)
    .orderBy(sql`strftime('%Y-%m-%d', ${receipts.createdAt}, 'unixepoch')`);

  const topClients: ClientStats[] = topClientRows.map((r) => ({
    email: r.email!,
    name: r.name,
    receiptsSent: r.total,
    signed: r.signed ?? 0,
    signOffRate: r.total > 0 ? Math.round(((r.signed ?? 0) / r.total) * 1000) / 10 : 0,
    lastReceiptAt: r.lastReceiptAt ? new Date(r.lastReceiptAt * 1000).toISOString() : null,
  }));

  const draft = Math.max(0, total - (overviewRow?.sent ?? 0) - signed - (overviewRow?.disputed ?? 0));

  return {
    overview: {
      totalReceipts: total,
      sent: overviewRow?.sent ?? 0,
      signed,
      disputed: overviewRow?.disputed ?? 0,
      signOffRate,
      avgTimeToSign,
      totalClients: clientRow?.total ?? 0,
      activeClients,
    },
    trends: trendRows,
    topClients,
    statusBreakdown: [
      { name: "Draft", value: draft },
      { name: "Sent", value: overviewRow?.sent ?? 0 },
      { name: "Signed", value: signed },
      { name: "Disputed", value: overviewRow?.disputed ?? 0 },
    ],
    activity: activityRows,
  };
}
