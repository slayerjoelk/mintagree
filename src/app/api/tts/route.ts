import { spawn } from "child_process";
import { unlink } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { randomBytes } from "crypto";
import { Readable } from "stream";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { text, voice = "en-US-AndrewNeural" } = await req.json();
    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "text required" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const tmpFile = join(tmpdir(), `tts-${randomBytes(8).toString("hex")}.mp3`);

    await new Promise<void>((resolve, reject) => {
      const proc = spawn("edge-tts", [
        "--voice", voice,
        "--rate", "+5%",
        "--pitch", "+0Hz",
        "--write-media", tmpFile,
        "--text", text,
      ]);

      let stderr = "";
      proc.stderr?.on("data", (d) => { stderr += d.toString(); });
      proc.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`edge-tts exited ${code}: ${stderr}`));
      });
      proc.on("error", reject);
    });

    const file = await import("fs/promises").then((m) => m.readFile(tmpFile));
    unlink(tmpFile, () => {});

    return new Response(file, {
      headers: {
        "content-type": "audio/mpeg",
        "cache-control": "public, max-age=86400",
      },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || "TTS failed" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
