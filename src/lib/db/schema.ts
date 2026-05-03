import { sqliteTable, text, integer, real, uniqueIndex } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

// ── Users ──
export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  email: text("email").notNull().unique(),
  name: text("name"),
  company: text("company"),
  plan: text("plan").default("free"), // free | starter | pro | enterprise
  emailVerified: integer("email_verified", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const usersRelations = relations(users, ({ many }) => ({
  receipts: many(receipts),
  clients: many(clients),
  templates: many(templates),
}));

// ── Receipts ──
export const receipts = sqliteTable("receipts", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(), // public sign-off token
  subject: text("subject").notNull(),
  bullets: text("bullets").notNull(), // JSON array
  amount: real("amount"),
  currency: text("currency").default("USD"),
  dueDate: text("due_date"),
  clientEmail: text("client_email"),
  clientName: text("client_name"),
  channel: text("channel").default("email"), // email | whatsapp
  requireOtp: integer("require_otp", { mode: "boolean" }).default(true),
  otp: text("otp"),
  status: text("status").default("sent"), // draft | sent | viewed | signed | disputed
  scheduledAt: text("scheduled_at"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const receiptsRelations = relations(receipts, ({ one, many }) => ({
  user: one(users, { fields: [receipts.userId], references: [users.id] }),
  attachments: many(attachments),
  signatures: many(signatures),
}));

// ── Clients ──
export const clients = sqliteTable("clients", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  name: text("name"),
  company: text("company"),
  phone: text("phone"), // E.164 format for WhatsApp
  channel: text("channel").default("email"), // email | whatsapp
  whatsappOptIn: integer("whatsapp_opt_in", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
}, (table) => [
  uniqueIndex("clients_user_email_idx").on(table.userId, table.email),
]);

export const clientsRelations = relations(clients, ({ one }) => ({
  user: one(users, { fields: [clients.userId], references: [users.id] }),
}));

// ── Templates ──
export const templates = sqliteTable("templates", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  subject: text("subject"),
  bullets: text("bullets").notNull(), // JSON array
  amount: real("amount"),
  industry: text("industry"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const templatesRelations = relations(templates, ({ one }) => ({
  user: one(users, { fields: [templates.userId], references: [users.id] }),
}));

// ── Attachments ──
export const attachments = sqliteTable("attachments", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  receiptId: text("receipt_id")
    .notNull()
    .references(() => receipts.id, { onDelete: "cascade" }),
  filename: text("filename").notNull(),
  url: text("url").notNull(),
  mimeType: text("mime_type"),
  scheduledAt: text("scheduled_at"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  receipt: one(receipts, {
    fields: [attachments.receiptId],
    references: [receipts.id],
  }),
}));

// ── Signatures ──
export const signatures = sqliteTable("signatures", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  receiptId: text("receipt_id")
    .notNull()
    .references(() => receipts.id, { onDelete: "cascade" }),
  clientEmail: text("client_email").notNull(),
  clientName: text("client_name"),
  action: text("action").notNull(), // acknowledged | disputed
  otpUsed: text("otp_used"),
  ip: text("ip"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const signaturesRelations = relations(signatures, ({ one }) => ({
  receipt: one(receipts, {
    fields: [signatures.receiptId],
    references: [receipts.id],
  }),
}));

// ── Type Exports ──
export type User = typeof users.$inferSelect;
export type Receipt = typeof receipts.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type Template = typeof templates.$inferSelect;
export type Attachment = typeof attachments.$inferSelect;
export type Signature = typeof signatures.$inferSelect;

// ── Conversation Threads (WhatsApp / voice call history) ──
export const conversationThreads = sqliteTable("conversation_threads", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  clientPhone: text("client_phone").notNull(),
  clientName: text("client_name"),
  clientEmail: text("client_email"),
  source: text("source").notNull(), // whatsapp | voice
  status: text("status").default("active"), // active | needs_attention | completed | skipped
  draftReceiptId: text("draft_receipt_id"),
  lastMessageAt: integer("last_message_at", { mode: "timestamp" }),
  messageCount: integer("message_count").default(0),
  aiSummary: text("ai_summary"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const conversationThreadsRelations = relations(conversationThreads, ({ one, many }) => ({
  user: one(users, { fields: [conversationThreads.userId], references: [users.id] }),
  messages: many(messages),
}));

// ── Messages ──
export const messages = sqliteTable("messages", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  threadId: text("thread_id")
    .notNull()
    .references(() => conversationThreads.id, { onDelete: "cascade" }),
  direction: text("direction").notNull(), // inbound | outbound
  from: text("from").notNull(),
  to: text("to").notNull(),
  body: text("body").notNull(),
  mediaUrl: text("media_url"),
  twilioSid: text("twilio_sid"),
  aiProcessed: integer("ai_processed", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const messagesRelations = relations(messages, ({ one }) => ({
  thread: one(conversationThreads, { fields: [messages.threadId], references: [conversationThreads.id] }),
}));

// ── Receipt Delivery ──
export const receiptDelivery = sqliteTable("receipt_delivery", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  receiptId: text("receipt_id")
    .notNull()
    .references(() => receipts.id, { onDelete: "cascade" }),
  channel: text("channel").notNull(), // email | whatsapp
  status: text("status").default("sent"), // sent | delivered | read | failed
  externalId: text("external_id"), // Twilio SID or Resend ID
  error: text("error"),
  sentAt: integer("sent_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const receiptDeliveryRelations = relations(receiptDelivery, ({ one }) => ({
  receipt: one(receipts, { fields: [receiptDelivery.receiptId], references: [receipts.id] }),
}));

// New type exports
export type ConversationThread = typeof conversationThreads.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type ReceiptDelivery = typeof receiptDelivery.$inferSelect;
