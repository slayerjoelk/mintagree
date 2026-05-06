import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ChatsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-semibold mb-4">WhatsApp conversations</h2>
      <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
        <p className="text-slate-600">WhatsApp integration coming soon.</p>
        <p className="text-sm text-slate-500 mt-2">Turn WhatsApp voice messages and chats into structured receipts.</p>
      </div>
    </div>
  );
}
