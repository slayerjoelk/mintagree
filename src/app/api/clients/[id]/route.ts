import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { clients, receipts } from "@/lib/db/schema";
import { clientSchema } from "@/lib/validations";
import { eq, and } from "drizzle-orm";

// PATCH /api/clients/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const [client] = await db
    .select()
    .from(clients)
    .where(eq(clients.id, id))
    .limit(1);

  if (!client || client.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = clientSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { email, name, company } = parsed.data;

  if (email && email !== client.email) {
    const [duplicate] = await db
      .select({ id: clients.id })
      .from(clients)
      .where(and(eq(clients.userId, session.user.id), eq(clients.email, email)))
      .limit(1);
    if (duplicate) {
      return NextResponse.json({ error: "Email already in use by another client" }, { status: 409 });
    }
  }

  const [updated] = await db
    .update(clients)
    .set({
      ...(email !== undefined && { email }),
      ...(name !== undefined && { name }),
      ...(company !== undefined && { company }),
    })
    .where(eq(clients.id, id))
    .returning();

  return NextResponse.json({ client: updated });
}

// DELETE /api/clients/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const [client] = await db
    .select()
    .from(clients)
    .where(eq(clients.id, id))
    .limit(1);

  if (!client || client.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.delete(clients).where(eq(clients.id, id));
  return NextResponse.json({ success: true });
}
