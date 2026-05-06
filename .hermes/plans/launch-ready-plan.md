# MintAgree — Launch-Ready Build Plan
## Date: 2026-05-06
## Project: ~/Desktop/Coding Projects/SaaS/agree_mint

---

## Current State (from audit)

**Core flow works:** Auth → Create receipt → Send email → Client OTP sign-off → Dashboard stats
**WhatsApp/Twilio:** Placeholder credentials — outbound/inbound will fail
**Build:** Passing (30 routes, 0 errors)
**DB:** Turso SQLite live, 8 tables

---

## TIER 1 — CRITICAL BUGS (must fix before anything else)

### Batch 1: Runtime Crash Fixes
| # | File | Bug | Fix |
|---|------|-----|-----|
| 1.1 | `src/lib/whatsapp.ts:111` | `needs_attention` not in schema enum | Change to `pending_review` |
| 1.2 | `src/lib/whatsapp.ts:74` | `.get()` on async Turso driver | Replace with `.limit(1)` + destructure |
| 1.3 | `src/app/api/upload/route.ts:50` | `crypto` not imported | Add `import crypto from "crypto"` |
| 1.4 | `src/app/api/subscribe/route.ts` | No PayFast notify webhook | Create `POST /api/payfast/notify` handler |
| 1.5 | `.env` lines 14-17 | Twilio placeholders | Mark as TODO/optional or add real env fallback |

---

## TIER 2 — MISSING API SURFACES

### Batch 2: Client API CRUD + Plan + PayFast
| # | Route | Purpose |
|---|-------|---------|
| 2.1 | `POST /api/clients` | Create client manually |
| 2.2 | `PATCH /api/clients/[id]` | Edit client name/email/phone |
| 2.3 | `DELETE /api/clients/[id]` | Delete client (soft or hard) |
| 2.4 | `GET /api/user/plan` | Return user's plan + limits + usage |
| 2.5 | `POST /api/payfast/notify` | Receive PayFast ITN, update user plan |
| 2.6 | `GET /api/analytics` | Real-time analytics (replace raw SQL) |

### Batch 3: Receipt API Enhancements
| # | Route | Purpose |
|---|-------|---------|
| 3.1 | `PATCH /api/receipts/[id]` | Edit draft receipt before send |
| 3.2 | `DELETE /api/receipts/[id]` | Delete receipt |
| 3.3 | `POST /api/receipts/[id]/resend` | Resend receipt to client |

---

## TIER 3 — MISSING UI / UX

### Batch 4: Client Management Page
| # | File | Purpose |
|---|------|---------|
| 4.1 | Update `/dashboard/clients/page.tsx` | Add "New client" button + search/filter |
| 4.2 | Add `NewClientModal` component | Form: name, email, phone, channel |
| 4.3 | Add `EditClientModal` component | Inline edit of existing client |
| 4.4 | Wire `DELETE /api/clients/[id]` | Delete button with confirmation |

### Batch 5: Template Full CRUD + Use Template
| # | File | Purpose |
|---|------|---------|
| 5.1 | Update `/dashboard/templates/page.tsx` | Add edit/delete buttons per card |
| 5.2 | Add `EditTemplateModal` component | Edit title, bullets, amount, industry |
| 5.3 | Add `DELETE /api/templates/[id]` | Delete template |
| 5.4 | Add "Use template" flow | Template card → `/receipts/new?templateId=xxx` pre-fill |

### Batch 6: Receipt Edit/Delete + List Search
| # | File | Purpose |
|---|------|---------|
| 6.1 | Update `/dashboard/receipts/[id]/page.tsx` | Add edit + delete buttons |
| 6.2 | Add `EditReceiptModal` component | Edit bullets, amount, subject, due date |
| 6.3 | Add `DELETE /api/receipts/[id]` | Delete with confirmation |
| 6.4 | Update `/dashboard/receipts/page.tsx` | Search by client/subject, status filter, pagination |
| 6.5 | Add `POST /api/receipts/[id]/resend` | Resend to same client |

### Batch 7: Settings Functional
| # | File | Purpose |
|---|------|---------|
| 7.1 | Update `/dashboard/settings/page.tsx` | Wire delete account → `DELETE /api/user` |
| 7.2 | Add `POST /api/user/delete` | Delete user + cascade receipts/clients |
| 7.3 | Add plan display | Show current plan, receipts used vs limit |
| 7.4 | Add plan upgrade CTA | Link to `/pricing` with pre-selected plan |

### Batch 8: Plan Enforcement
| # | File | Purpose |
|---|------|---------|
| 8.1 | `src/lib/plans.ts` | Plan limits config (free=10/mo, pro=100/mo, team=unlimited) |
| 8.2 | `src/middleware.ts` or API guard | Check receipt count before allowing create |
| 8.3 | Update `POST /api/receipts` | Return 403 if over plan limit |
| 8.4 | Update receipt creation UI | Show plan limit warning, upgrade prompt |

---

## TIER 4 — WHATSAPP (optional, blocked on Twilio credentials)

| # | File | Purpose |
|---|------|---------|
| 9.1 | `src/lib/whatsapp.ts` | Add real Twilio SID/token fallback |
| 9.2 | `src/app/api/webhooks/twilio/route.ts` | Verify webhook signature |
| 9.3 | Chat detail page | Polish empty-state guidance |

---

## Verification per Batch

- [ ] `npx next build` passes after EVERY batch
- [ ] `git add -A && git commit -m "batch N: description"` after EVERY batch
- [ ] No uncommitted changes between batches

## Final Deliverables

- [ ] Build passes with 0 errors
- [ ] All API routes have auth checks
- [ ] All delete operations have confirmation
- [ ] Plan limits enforced
- [ ] No placeholder env vars in production paths
- [ ] Handoff written to vault
