import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { templates } from "@/lib/db/schema";
import { templateSchema } from "@/lib/validations";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await db
    .select()
    .from(templates)
    .where(eq(templates.userId, session.user.id))
    .orderBy(desc(templates.createdAt));

  return NextResponse.json({ templates: results });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = templateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const template = await db
    .insert(templates)
    .values({
      userId: session.user.id,
      name: parsed.data.name,
      subject: parsed.data.subject ?? null,
      bullets: JSON.stringify(parsed.data.bullets),
      amount: parsed.data.amount ?? null,
      industry: parsed.data.industry ?? null,
    })
    .returning()
    .get();

  return NextResponse.json({ template }, { status: 201 });
}
