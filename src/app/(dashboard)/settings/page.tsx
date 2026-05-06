import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import SettingsPage from "./_components/settings-page";

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  return (
    <SettingsPage
      user={{
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        plan: (session.user as { plan?: string | null }).plan ?? null,
        webhookUrl: user?.webhookUrl ?? null,
      }}
    />
  );
}
