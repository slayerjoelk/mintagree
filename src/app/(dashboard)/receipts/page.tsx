import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { receipts } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import ReceiptsList from "./_components/receipts-list";

export default async function ReceiptsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const results = await db
    .select({
      id: receipts.id,
      subject: receipts.subject,
      status: receipts.status,
      clientEmail: receipts.clientEmail,
      clientName: receipts.clientName,
      amount: receipts.amount,
      currency: receipts.currency,
      createdAt: receipts.createdAt,
    })
    .from(receipts)
    .where(eq(receipts.userId, session.user.id))
    .orderBy(desc(receipts.createdAt))
    .limit(100);

  return <ReceiptsList receipts={results} />;
}
