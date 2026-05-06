import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import BillingPage from "./_components/billing-page";

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <BillingPage
      user={{
        email: session.user.email,
        name: session.user.name,
        plan: (session.user as { plan?: string | null }).plan ?? null,
      }}
    />
  );
}
