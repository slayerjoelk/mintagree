import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema";
import { clientSchema } from "@/lib/validations";
import { eq, desc, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await db
    .select()
    .from(clients)
    .where(eq(clients.userId, session.user.id))
    .orderBy(desc(clients.createdAt));

  return NextResponse.json({ clients: results });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = clientSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

    const [existing] = await db
    .select({ id: clients.id })
    .from(clients)
    .where(and(eq(clients.userId, session.user.id), eq(clients.email, parsed.data.email)))
    .limit(1);

  if (existing) {
    return NextResponse.json({ error: "Client with this email already exists" }, { status: 409 });
  }

  const [client] = await db
    .insert(clients)
    .values({
      userId: session.user.id,
      email: parsed.data.email,
      name: parsed.data.name ?? null,
      company: parsed.data.company ?? null,
    })
    .returning();

  return NextResponse.json({ client }, { status: 201 });
}
