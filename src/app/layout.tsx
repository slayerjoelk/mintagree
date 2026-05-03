import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MintAgree — Conversation Receipts & Client Sign-Off",
  description:
    "Turn every client call into a signed agreement receipt. Send conversation summaries with scope, budget, and OTP acknowledgement. Built for agencies, consultants, and freelancers.",
  keywords: [
    "voice agreement software",
    "client sign-off tool",
    "conversation receipt app",
    "scope confirmation software",
    "OTP client acknowledgment",
    "post-call agreement",
    "freelancer scope tool",
    "agency approval workflow",
    "consultant sign-off",
    "contract-lite for agencies",
    "meeting summary to agreement",
    "client approval receipt",
  ],
  metadataBase: new URL("https://mintagree.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MintAgree — Every call ends with a receipt",
    description:
      "Turn calls into signed client agreement receipts. Send a clear conversation receipt with scope, budget and due dates, attach visuals, and capture OTP acknowledgement.",
    type: "website",
    siteName: "MintAgree",
  },
  twitter: {
    card: "summary_large_image",
    title: "MintAgree — Every call ends with a receipt",
    description:
      "Turn calls into signed client agreement receipts. Send a clear conversation receipt with scope, budget and due dates.",
  },
  robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
