import { sqliteTable, text, integer, real, uniqueIndex } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

// ── Users ──
export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  email: text("email").notNull().unique(),
  name: text("name"),
  company: text("company"),
  plan: text("plan").default("free"), // free | starter | team
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
