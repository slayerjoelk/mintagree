import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  const params = await searchParams;
  const error = params?.error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
      <div className="w-full max-w-md mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="font-semibold">AgreeMint</span>
          </div>
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="text-slate-600 mt-1">
            Enter your email to receive a magic link.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
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
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm mb-4"
            />
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Send magic link
            </button>
          </form>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error === "Verification" ? "The sign-in link has expired or was already used." : "An error occurred during sign-in. Please try again."}
          </div>
        )}

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">
            ← Back to AgreeMint
          </Link>
        </div>
      </div>
    </div>
  );
}
