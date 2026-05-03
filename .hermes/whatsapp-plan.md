# WhatsApp Integration Plan — MintAgree

## Architecture

MintAgree becomes channel-agnostic. Business configures per-client: voice call channel OR WhatsApp message channel. Same receipt engine underneath.

Flow (WhatsApp channel):
1. Business exchanges messages with client on WhatsApp Business
2. MintAgree receives every inbound/outbound message via Twilio webhook
3. AI reads message thread, auto-drafts receipt bullets + subject
4. Business opens /dashboard/chats, sees "Draft ready" badge on active conversations
5. Business taps conversation, reviews/corrects draft receipt
6. Business clicks "Confirm & Send" → receipt goes to client via WhatsApp (Twilio) + email (Resend)
7. Client receives link, opens it, signs off with OTP

## Schema Changes

### `clients` table
- `phone` — E.164 format (+27...)
- `channel` — 'email' (default) | 'whatsapp'
- `whatsappOptIn` — boolean, required for WhatsApp

### `receipts` table
- `channel` — 'email' | 'whatsapp' (default 'email')
- `conversationThreadId` — FK to thread

### NEW: `conversation_threads` table
- `id` — cuid2
- `userId` — FK to users
- `clientPhone` — E.164
- `clientName` — inferred from first message
- `source` — 'whatsapp'
- `status` — 'active' | 'needs_attention' (AI flagged) | 'completed'
- `draftReceiptId` — nullable FK to receipts (the one being drafted)
- `lastMessageAt` — timestamp
- `messageCount` — integer
- `createdAt`, `updatedAt`

### NEW: `messages` table
- `id` — cuid2
- `threadId` — FK to conversation_threads
- `direction` — 'inbound' | 'outbound'
- `from` — phone number
- `to` — phone number
- `body` — text content
- `mediaUrl` — nullable, for images/documents
- `twilioSid` — Twilio Message SID
- `aiProcessed` — boolean
- `createdAt`

### NEW: `receipt_delivery` table (for multi-channel delivery history)
- `id` — cuid2
- `receiptId` — FK to receipts
- `channel` — 'email' | 'whatsapp'
- `status` — 'sent' | 'delivered' | 'read' | 'failed'
- `externalId` — Twilio SID or Resend ID
- `error` — nullable
- `sentAt`

## API Routes

### `/api/webhooks/twilio` — POST
- No auth (webhook, verified by Twilio signature)
- Parse Twilio form data
- Store message in `messages` table
- Upsert `conversation_threads`
- Mark thread status as 'needs_attention' (triggers AI draft)
- Return empty 200 TwiML response

### `/api/webhooks/twilio/status` — POST
- Handles delivery/read status callbacks
- Updates `receipt_delivery` status

### `/api/chats` — GET
- Auth required
- List all conversation threads for the business
- Join with latest draft receipt status

### `/api/chats/[threadId]` — GET
- Auth required
- Full message history + draft receipt (if any)

### `/api/chats/[threadId]/draft` — GET/PUT
- Auth required
- GET: returns AI-generated draft receipt from message thread
- PUT: saves corrections to draft (subject, bullets, amount, dueDate)

### `/api/chats/[threadId]/send` — POST
- Auth required
- Creates receipt from draft with status 'draft' if new, or updates existing
- Changes status to 'sent'
- Sends via WhatsApp (Twilio) AND email (Resend)
- Stores delivery record in `receipt_delivery`
- Updates `conversation_threads.draftReceiptId`

### POST `/api/receipts` — modified
- Add `channel` field to body (optional, defaults to 'email')
- If channel='whatsapp', require `clientPhone` instead of `clientEmail`
- Deliver via both channels if both configured

## Dashboard UI

### `/dashboard/chats` — new page
- List of conversation threads like WhatsApp inbox
- Sort by lastMessageAt desc
- Status badges: Active, Draft ready, Completed
- Shows client name + last message preview + unread count
- Tap to open thread

### `/dashboard/chats/[threadId]` — new page
- Top: client name, phone, channel tag, status
- Left: message thread (inbound right-aligned, outbound left-aligned)
- Right: draft receipt editor (subject, bullets, amount, dueDate, requireOtp)
- Actions: "Refresh draft" (re-run AI), "Confirm & Send", "Skip for now"

### `/dashboard/settings` — extended
- "WhatsApp Integration" section
- Toggle: enable WhatsApp channel
- Display: Twilio-connected phone number
- Webhook URL for copy-paste into Twilio console
- Per-client channel toggle (in client detail)

## Twilio Setup Steps (manual)

1. Buy Twilio phone number with WhatsApp capability
2. Connect to WhatsApp Business Account
3. Configure webhook: `https://mintagree.com/api/webhooks/twilio`
4. Configure status callback: `https://mintagree.com/api/webhooks/twilio/status`
5. Set env vars: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_NUMBER`

## Env Variables to Add

```
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=whatsapp:+27...
```

## Package to Install

```bash
npm install twilio
```

## Files to Create/Modify

### New files:
- `src/app/api/webhooks/twilio/route.ts`
- `src/app/api/webhooks/twilio/status/route.ts`
- `src/app/api/chats/route.ts`
- `src/app/api/chats/[threadId]/route.ts`
- `src/app/api/chats/[threadId]/draft/route.ts`
- `src/app/api/chats/[threadId]/send/route.ts`
- `src/app/(dashboard)/chats/page.tsx`
- `src/app/(dashboard)/chats/[threadId]/page.tsx`
- `src/lib/whatsapp.ts` — twilio client, send message, verify webhook
- `src/lib/ai-drafter.ts` — convert message thread to receipt bullets

### Modified files:
- `src/lib/db/schema.ts` — add tables and columns
- `src/app/api/receipts/route.ts` — add channel support, dual delivery
- `src/app/(dashboard)/layout.tsx` — add "Chats" to sidebar + mobile nav
- `src/app/(dashboard)/clients/page.tsx` — add channel toggle per client
- `src/app/(dashboard)/settings/page.tsx` — add WhatsApp integration section
- `drizzle.config.ts` — ensure new schema is tracked

## AI Draft Strategy (v1)

No LLM dependency for MVP. Use rule-based extraction:

1. Take last 20 messages from thread
2. Look for price amounts (regex: `\$?[\d,]+\.?\d{0,2}` or `R[\d\s,]+`)
3. Look for date patterns (`by\s+([A-Za-z]+\s+\d{1,2})`, `next\s+(Monday|Tuesday...)`)
4. Look for scope keywords ("website", "design", "logo", "campaign", "pages", "revisions")
5. Generate subject: "Receipt — [Client] | [Date]" or extract from first message
6. Generate bullets from sentences with "will", "should", "need", "agreed", "confirm"

For v2: integrate Ollama/DSPy for true LLM summarization.

## Sign-Off Flow

Same as current email flow:
- Client receives link via WhatsApp message: "Hi [Name]. Here is what we agreed: [URL]"
- Link goes to `/sign/[token]`
- Client reviews receipt, enters OTP, clicks "I agree" or "I dispute"
- Business gets notified

## Build Order

**Batch 1:** Schema migration + install twilio + env vars
**Batch 2:** Twilio webhook endpoint (receive/store messages)
**Batch 3:** AI drafter (rule-based, no LLM)
**Batch 4:** Dashboard chats page (/chats, /chats/[threadId])
**Batch 5:** Send flow — dual delivery + status tracking
**Build + deploy**
