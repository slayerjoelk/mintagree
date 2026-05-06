import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsPage from "./_components/settings-page";

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <SettingsPage
      user={{
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        plan: (session.user as { plan?: string | null }).plan ?? null,
      }}
    />
  );
}
