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
  title: "AgreeMint — Voice Agreement & Client Sign-Off Software",
  description:
    "Voice agreement & client sign-off software. Create conversation receipts with OTP acknowledgement, scope, budget, due dates, and visual attachments for agencies, consultants, freelancers, SMBs and enterprises.",
  keywords: [
    "voice agreement software",
    "client sign-off software",
    "conversation receipts",
    "scope confirmation tool",
    "budget confirmation",
    "OTP acknowledgement",
    "client approval software",
    "post-call summary",
    "voice to agreement",
    "service business software",
    "agency approval workflow",
    "consultant sign-off",
    "freelancer scope tool",
    "MSP agreement software",
    "construction change order confirmation",
    "creative brief sign-off",
    "legal intake confirmation",
    "sales call confirmation",
    "customer approval receipt",
    "project kickoff checklist",
    "meeting summary to agreement",
    "contract-lite acknowledgement",
    "receipt of conversation",
  ],
  openGraph: {
    title: "AgreeMint — Voice Agreement & Client Sign-Off Software",
    description:
      "Turn calls into signed client agreement receipts. Send a clear conversation receipt with scope, budget and due dates, attach visuals, and capture OTP acknowledgement.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgreeMint — Voice Agreement & Client Sign-Off Software",
    description:
      "Turn calls into signed client agreement receipts. Send a clear conversation receipt with scope, budget and due dates, attach visuals, and capture OTP acknowledgement.",
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
