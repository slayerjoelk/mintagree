import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { randomBytes } from "crypto";
import { checkReceiptLimit } from "@/lib/plans";
import OpenAI from "openai";

const MAX_FILE_SIZE_MB = 25;
const ALLOWED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
  "audio/x-m4a",
  "audio/mp4",
  "audio/webm",
];

function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not set");
  return new OpenAI({ apiKey: key });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limitCheck = await checkReceiptLimit(session.user.id);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      {
        error: "Monthly receipt limit reached.",
        plan: limitCheck.plan,
        limit: limitCheck.limit,
        used: limitCheck.used,
      },
      { status: 403 }
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Transcription not configured. Add OPENAI_API_KEY to your environment." },
      { status: 503 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: `File type not supported: ${file.type}. Supported: mp3, wav, ogg, m4a, webm` },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return NextResponse.json(
      { error: `File too large. Max ${MAX_FILE_SIZE_MB}MB` },
      { status: 400 }
    );
  }

  const tmpDir = tmpdir();
  const tmpName = `transcribe-${randomBytes(8).toString("hex")}.mp3`;
  const tmpPath = join(tmpDir, tmpName);

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(tmpPath, buffer);

    const openai = getOpenAI();
    const whisper = await openai.audio.transcriptions.create({
      file: await import("fs").then((m) => m.createReadStream(tmpPath)),
      model: "whisper-1",
      language: "en",
      response_format: "text",
    });

    await unlink(tmpPath).catch(() => {});

    return NextResponse.json({ transcript: whisper });
  } catch (e: any) {
    await unlink(tmpPath).catch(() => {});
    console.error("Whisper transcription error:", e);
    return NextResponse.json(
      { error: e?.message || "Transcription failed" },
      { status: 500 }
    );
  }
}
