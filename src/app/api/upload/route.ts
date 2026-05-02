import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { mkdirSync } from "fs";
import path from "path";
import { auth } from "@/lib/auth";

const uploadTracker = new Map<string, number[]>();
const MAX_UPLOADS_PER_HOUR = 20;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const now = Date.now();
  const hourAgo = now - 60 * 60 * 1000;
  const recentUploads = (uploadTracker.get(userId) ?? []).filter((t) => t > hourAgo);
  if (recentUploads.length >= MAX_UPLOADS_PER_HOUR) {
    return NextResponse.json(
      { error: "Upload limit exceeded (max 20 uploads per hour)" },
      { status: 429 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.name.length > 255) {
    return NextResponse.json({ error: "Filename too long (max 255 characters)" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  mkdirSync(uploadsDir, { recursive: true });
  const filepath = path.join(uploadsDir, filename);

  await writeFile(filepath, buffer);

  recentUploads.push(now);
  uploadTracker.set(userId, recentUploads);

  const url = `/uploads/${filename}`;
  return NextResponse.json({ url, filename, mimeType: file.type, size: file.size });
}
