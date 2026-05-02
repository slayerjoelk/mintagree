import { z } from "zod";

export const receiptSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200),
  bullets: z.array(z.string().min(1)).min(1, "At least one bullet is required"),
  amount: z.number().min(0).nullable().optional(),
  currency: z.string().default("USD"),
  dueDate: z.string().nullable().optional(),
  clientEmail: z.string().email().nullable().optional(),
  clientName: z.string().nullable().optional(),
  requireOtp: z.boolean().default(true),
  templateId: z.string().nullable().optional(),
});

export const clientSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  company: z.string().optional(),
});

export const templateSchema = z.object({
  name: z.string().min(1).max(500),
  subject: z.string().optional(),
  bullets: z.array(z.string()).min(1),
  amount: z.number().min(0).nullable().optional(),
  industry: z.string().optional(),
});

export const receiptPatchSchema = z.object({
  subject: z.string().min(1).max(200).optional(),
  bullets: z.array(z.string().min(1)).optional(),
  amount: z.number().min(0).nullable().optional(),
  currency: z.string().optional(),
  dueDate: z.string().nullable().optional(),
  clientEmail: z.string().email().nullable().optional(),
  clientName: z.string().nullable().optional(),
  requireOtp: z.boolean().optional(),
});

export const templatePatchSchema = z.object({
  name: z.string().min(1).max(500).optional(),
  subject: z.string().optional(),
  bullets: z.array(z.string()).min(1).optional(),
  amount: z.number().min(0).nullable().optional(),
  industry: z.string().optional(),
});

export const signSchema = z.object({
  action: z.enum(["acknowledged", "disputed"]),
  clientName: z.string().optional(),
  otp: z.string().optional(),
});

export type ReceiptInput = z.infer<typeof receiptSchema>;
export type ClientInput = z.infer<typeof clientSchema>;
export type TemplateInput = z.infer<typeof templateSchema>;
export type SignInput = z.infer<typeof signSchema>;
