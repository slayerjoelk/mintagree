import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  const params = await searchParams;
  const error = params?.error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
      <div className="w-full max-w-md mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-mint"></span>
            <span className="font-semibold text-mint">MintAgree</span>
          </div>
          <h1 className="text-2xl font-semibold">Get started</h1>
          <p className="text-zinc-400 mt-1">
            Enter your email to receive a magic link. No password needed.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-surface p-6 shadow-sm">
          <form
            action={async (formData) => {
              "use server";
              const email = formData.get("email") as string;
              const callbackUrl = params?.callbackUrl || "/dashboard";
              await signIn("nodemailer", { email, callbackUrl, redirect: false });
            }}
          >
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@company.com"
              required
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 mb-4"
            />
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-xl border border-zinc-800 px-5 py-3 text-sm font-medium bg-mint text-zinc-950 hover:bg-mint-hover transition-colors"
            >
              Send magic link
            </button>
          </form>
          <p className="text-xs text-zinc-600 mt-3 text-center">
            Or{" "}
            <Link href="/login" className="text-mint hover:underline">
              sign in
            </Link>{" "}
            if you already have an account.
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-400">
            {error === "Verification" ? "The sign-in link has expired or was already used." : "An error occurred. Please try again."}
          </div>
        )}

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            ← Back to MintAgree
          </Link>
        </div>
      </div>
    </div>
  );
}
