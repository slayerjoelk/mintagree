/**
 * Rule-based AI drafter — converts a WhatsApp message thread into a draft receipt.
 * No LLM dependency. Pure regex + keyword extraction.
 */

export interface ThreadMessage {
  direction: "inbound" | "outbound";
  body: string;
}

export interface DraftReceipt {
  subject: string;
  bullets: string[];
  amount: number | null;
  currency: string;
  dueDate: string | null;
  confidence: number; // 0-1
  clientName: string | null;
  aiSummary: string;
}

// ── Amount extraction ──
const AMOUNT_PATTERNS = [
  // $1,234.56 or $1234
  { regex: /\$\s*([\d,]+\.?\d{0,2})/g, currency: "USD" },
  // R 1,234.56 (South African Rand)
  { regex: /\bR\s*([\d\s,]+\.?\d{0,2})/gi, currency: "ZAR" },
  // £1,234.56
  { regex: /£\s*([\d,]+\.?\d{0,2})/g, currency: "GBP" },
  // €1,234.56
  { regex: /€\s*([\d,]+\.?\d{0,2})/g, currency: "EUR" },
  // 1,234.56 USD | 1234 ZAR
  { regex: /([\d,]+\.?\d{0,2})\s*(USD|ZAR|GBP|EUR)/gi, currency: null },
];

function extractAmounts(messages: ThreadMessage[]): {
  amount: number | null;
  currency: string;
} {
  let bestAmount: number | null = null;
  let bestCurrency = "USD";

  for (const msg of messages) {
    for (const pattern of AMOUNT_PATTERNS) {
      const matches = Array.from(msg.body.matchAll(pattern.regex));
      for (const match of matches) {
        const raw = match[1].replace(/[\s,]/g, "");
        const val = parseFloat(raw);
        if (!isNaN(val) && val > 0) {
          if (bestAmount === null || val > bestAmount) {
            bestAmount = val;
            bestCurrency =
              pattern.currency ??
              (match[2] as string).toUpperCase() ??
              bestCurrency;
          }
        }
      }
    }
  }

  return { amount: bestAmount, currency: bestCurrency };
}

// ── Date extraction ──
const DATE_PATTERNS = [
  // by next Monday, by next Tuesday
  /\bby\s+next\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
  // by Friday, by Monday
  /\bby\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
  // by end of week/month
  /\bby\s+(?:end\s+of\s+(?:the\s+)?)?(?:week|month)\b/i,
  // in 2 weeks, in 3 days
  /\bin\s+(\d+)\s+(days?|weeks?|months?)\b/i,
  // next week, next month
  /\bnext\s+(week|month)\b/i,
  // by Jan 15, by January 15
  /\bby\s+([a-z]+\s+\d{1,2}(?:st|nd|rd|th)?)\b/i,
  // ISO dates: 2025-01-15
  /\b(\d{4}-\d{2}-\d{2})\b/,
];

function extractDate(messages: ThreadMessage[]): string | null {
  for (const msg of messages) {
    for (const pattern of DATE_PATTERNS) {
      const match = msg.body.match(pattern);
      if (match) return match[1] ?? match[0];
    }
  }
  return null;
}

// ── Name extraction ──
function extractClientName(messages: ThreadMessage[]): string | null {
  // Look for "hi i'm [name]" or "this is [name]"
  const namePatterns = [
    /(?:hi|hello|hey)\s+(?:i(?:'|\u2019)?m|this\s+is)\s+([A-Z][a-z]+)/i,
    /(?:name(?:'|s| is)?|i am)\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/i,
  ];

  for (const msg of messages) {
    if (msg.direction !== "inbound") continue;
    for (const pattern of namePatterns) {
      const match = msg.body.match(pattern);
      if (match) return match[1].trim();
    }
  }
  return null;
}

// ── Bullet generation ──
const KEYWORDS = [
  "will",
  "should",
  "need",
  "agreed",
  "confirm",
  "include",
  "deliver",
  "provide",
  "scope",
  "design",
  "website",
  "logo",
  "pages",
  "revisions",
  "campaign",
  "content",
  "strategy",
  "report",
];

function generateBullets(messages: ThreadMessage[]): string[] {
  const bullets: string[] = [];
  const seen = new Set<string>();

  for (const msg of messages) {
    const sentences = msg.body
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 10 && s.split(/\s+/).length >= 3);

    for (const sentence of sentences) {
      const lower = sentence.toLowerCase();
      // Only pick sentences that look like scope/agreement items
      const hasKeyword = KEYWORDS.some((kw) => lower.includes(kw));
      const isQuestion = sentence.trim().endsWith("?");
      const isShort = lower.split(/\s+/).length < 4;

      if (hasKeyword && !isQuestion && !isShort) {
        const cleaned = sentence
          .replace(/^\W+/, "")
          .replace(/\W+$/, "")
          .replace(/\s+/g, " ")
          .trim();
        const key = cleaned.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          bullets.push(cleaned.charAt(0).toUpperCase() + cleaned.slice(1));
        }
      }
    }
  }

  // If too few bullets, fall back to summarizing the conversation
  if (bullets.length < 2) {
    const combined = messages
      .map((m) => m.body)
      .join(" ")
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 15 && s.split(/\s+/).length >= 4);
    bullets.push("Agreement discussed via WhatsApp — review details below.");
    for (const s of combined.slice(0, 3)) {
      const key = s.toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        bullets.push(`• ${s.charAt(0).toUpperCase() + s.slice(1)}`);
      }
    }
  }

  return bullets.slice(0, 8); // cap at 8 bullets
}

function generateSubject(
  clientName: string | null,
  messages: ThreadMessage[],
  hasAmount: boolean
): string {
  const name = clientName ?? "Client";
  const firstMsg = messages[0]?.body ?? "";

  // Try to extract topic from first message
  const topics = [
    "website",
    "logo",
    "design",
    "campaign",
    "consulting",
    "development",
    "strategy",
    "agreement",
    "project",
    "proposal",
  ];
  const lower = firstMsg.toLowerCase();
  const matched = topics.find((t) => lower.includes(t));

  if (matched) {
    return `Receipt — ${name} | ${matched.charAt(0).toUpperCase() + matched.slice(1)}`;
  }

  if (hasAmount) {
    return `Receipt — ${name}`;
  }

  return `Receipt — ${name} | WhatsApp agreement`;
}

// ── Main entry point ──
export function draftReceiptFromThread(
  messages: ThreadMessage[]
): DraftReceipt {
  if (messages.length === 0) {
    return {
      subject: "Untitled receipt",
      bullets: ["No conversation data available."],
      amount: null,
      currency: "USD",
      dueDate: null,
      confidence: 0,
      clientName: null,
      aiSummary: "Empty thread.",
    };
  }

  const { amount, currency } = extractAmounts(messages);
  const dueDate = extractDate(messages);
  const clientName = extractClientName(messages);
  const bullets = generateBullets(messages);
  const subject = generateSubject(clientName, messages, !!amount);

  // Confidence score
  let confidence = 0.2;
  if (amount !== null) confidence += 0.3;
  if (dueDate !== null) confidence += 0.2;
  if (clientName !== null) confidence += 0.15;
  if (bullets.length >= 3) confidence += 0.15;
  confidence = Math.min(1, confidence);

  const aiSummary = `Draft: ${subject} — ${bullets.length} items${amount !== null ? `, ${currency} ${amount}` : ""}${dueDate !== null ? `, due ${dueDate}` : ""}`;

  return {
    subject,
    bullets,
    amount,
    currency,
    dueDate,
    confidence,
    clientName,
    aiSummary,
  };
}
