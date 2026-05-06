import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, receipts, clients, signatures } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const [[userRow], receiptStats, clientStats, signatureStats] = await Promise.all([
    db.select({ plan: users.plan }).from(users).where(eq(users.id, userId)).limit(1),
    db
      .select({
        total: sql<number>`count(*)`.as("total"),
        sent: sql<number>`sum(case when ${receipts.status} = 'sent' then 1 else 0 end)`.as("sent"),
        signed: sql<number>`sum(case when ${receipts.status} = 'signed' then 1 else 0 end)`.as("signed"),
        disputed: sql<number>`sum(case when ${receipts.status} = 'disputed' then 1 else 0 end)`.as("disputed"),
      })
      .from(receipts)
      .where(eq(receipts.userId, userId)),
    db
      .select({
        total: sql<number>`count(*)`.as("total"),
      })
      .from(clients)
      .where(eq(clients.userId, userId)),
    db
      .select({ total: sql<number>`count(*)` })
      .from(signatures)
      .innerJoin(receipts, eq(signatures.receiptId, receipts.id))
      .where(eq(receipts.userId, userId)),
  ]);

  const plan = userRow?.plan || "free";

  const limits: Record<string, number> = {
    free: 5,
    starter: 50,
    pro: 200,
    enterprise: 999999,
  };

  return NextResponse.json({
    plan,
    limit: limits[plan] ?? 5,
    receipts: {
      total: receiptStats[0]?.total ?? 0,
      sent: receiptStats[0]?.sent ?? 0,
      signed: receiptStats[0]?.signed ?? 0,
      disputed: receiptStats[0]?.disputed ?? 0,
    },
    clients: {
      total: clientStats[0]?.total ?? 0,
    },
    signatures: {
      total: signatureStats[0]?.total ?? 0,
    },
  });
}
