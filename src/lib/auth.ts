import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { sendMagicLinkEmail } from "@/lib/email";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Nodemailer({
      server: {},
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier: email, url }) => {
        const result = await sendMagicLinkEmail(email, url);
        if (!result.success) {
          throw new Error(`Failed to send magic link: ${result.error}`);
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/verify",
    error: "/login",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        const created = (user as any).createdAt;
        (session.user as any).createdAt = created instanceof Date
          ? created.toISOString()
          : null;
      }
      return session;
    },
  },
});
