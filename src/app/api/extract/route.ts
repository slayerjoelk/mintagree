import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkReceiptLimit } from "@/lib/plans";
import OpenAI from "openai";

function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not set");
  return new OpenAI({ apiKey: key });
}

const systemPrompt = `You are a receipt drafting assistant. Given a transcript of a voice or video call between a service provider and their client, extract structured agreement details.

Return ONLY valid JSON with this shape:
{
  "subject": "Short meeting title (10 words max)",
  "bullets": ["Bullet 1", "Bullet 2", ...],
  "amount": 1500,
  "currency": "USD",
  "dueDate": "2026-05-15",
  "clientName": "Mike Ross",
  "clientEmail": "mike@acme.co"
}

Rules:
- Each bullet should be a concrete scope item, deliverable, deadline, or commitment.
- Ignore pleasantries, filler, and off-topic conversation.
- If dates are relative ("next Friday"), estimate from today.
- If no price was discussed, return null for amount.
- If no name/email is clear, return null.
- Never return markdown, code fences, or explanatory text — only raw JSON.`;

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
      { error: "AI extraction not configured. Add OPENAI_API_KEY to your environment." },
      { status: 503 }
    );
  }

  const { transcript } = await req.json();
  if (!transcript || typeof transcript !== "string") {
    return NextResponse.json({ error: "Transcript required" }, { status: 400 });
  }

  try {
    const openai = getOpenAI();
    const chat = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      max_tokens: 800,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: transcript },
      ],
    });

    const raw = chat.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw);

    return NextResponse.json({
      subject: parsed.subject || "Client conversation receipt",
      bullets: Array.isArray(parsed.bullets) ? parsed.bullets : ["Confirm project scope"],
      amount: parsed.amount ?? null,
      currency: parsed.currency || "USD",
      dueDate: parsed.dueDate ?? null,
      clientName: parsed.clientName ?? null,
      clientEmail: parsed.clientEmail ?? null,
    });
  } catch (e: any) {
    console.error("Extract error:", e);
    return NextResponse.json(
      { error: e?.message || "AI extraction failed" },
      { status: 500 }
    );
  }
}
