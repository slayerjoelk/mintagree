import { sql } from "drizzle-orm";
import { db } from "./db";
import { receipts, users } from "./db/schema";
import { eq, and, gte } from "drizzle-orm";

export const PLAN_LIMITS: Record<
  string,
  { maxReceiptsPerMonth: number | null; maxSeats: number | null; label: string }
> = {
  free: { maxReceiptsPerMonth: 5, maxSeats: 1, label: "Free" },
  starter: { maxReceiptsPerMonth: null, maxSeats: 3, label: "Starter" },
  pro: { maxReceiptsPerMonth: null, maxSeats: 10, label: "Pro" },
  enterprise: { maxReceiptsPerMonth: null, maxSeats: null, label: "Enterprise" },
};

export async function getUserPlan(userId: string) {
  const [user] = await db.select({ plan: users.plan }).from(users).where(eq(users.id, userId)).limit(1);
  return user?.plan || "free";
}

export async function checkReceiptLimit(userId: string) {
  const planKey = await getUserPlan(userId);
  const limits = PLAN_LIMITS[planKey] || PLAN_LIMITS.free;

  if (limits.maxReceiptsPerMonth === null) {
    return { allowed: true as const, plan: planKey, limit: null, used: 0 };
  }

  // Count receipts created this calendar month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(receipts)
    .where(
      and(
        eq(receipts.userId, userId),
        gte(receipts.createdAt, startOfMonth)
      )
    );

  const used = count || 0;
  const allowed = used < limits.maxReceiptsPerMonth;

  return {
    allowed,
    plan: planKey,
    limit: limits.maxReceiptsPerMonth,
    used,
  };
}
