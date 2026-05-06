export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
      <div className="w-full max-w-md mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          <span className="font-semibold">MintAgree</span>
        </div>
        <h1 className="text-2xl font-semibold mb-2">Check your email</h1>
        <p className="text-slate-600">
          A sign-in link has been sent to your email address. Click the link to sign in.
        </p>
        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="text-4xl mb-2">📧</div>
          <p className="text-sm text-slate-600">
            Don&apos;t see the email? Check your spam folder. The link expires in 10 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
