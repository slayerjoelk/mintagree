import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { templates } from "@/lib/db/schema";
import { templatePatchSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";

// GET /api/templates/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const template = await db
    .select()
    .from(templates)
    .where(eq(templates.id, id))
    .get();

  if (!template || template.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let bullets: string[] = [];
  try { bullets = JSON.parse(template.bullets || "[]"); } catch { /* corrupted row */ }

  return NextResponse.json({ template: { ...template, bullets } });
}

// PATCH /api/templates/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const template = await db
    .select()
    .from(templates)
    .where(eq(templates.id, id))
    .get();

  if (!template || template.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = templatePatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, subject, bullets, amount, industry } = parsed.data;

  const updated = await db
    .update(templates)
    .set({
      ...(name !== undefined && { name }),
      ...(subject !== undefined && { subject }),
      ...(bullets !== undefined && { bullets: JSON.stringify(bullets) }),
      ...(amount !== undefined && { amount }),
      ...(industry !== undefined && { industry }),
    })
    .where(eq(templates.id, id))
    .returning()
    .get();

  return NextResponse.json({ template: updated });
}

// DELETE /api/templates/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const template = await db
    .select()
    .from(templates)
    .where(eq(templates.id, id))
    .get();

  if (!template || template.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.delete(templates).where(eq(templates.id, id));
  return NextResponse.json({ success: true });
}
