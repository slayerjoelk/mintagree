"use client";

export default function SocialProof() {
  return (
    <section className="border-y border-white/5 bg-zinc-900/50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i <= 4 ? "text-mint" : "text-mint/40"}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-zinc-400">
              Early access — join the beta
            </span>
          </div>

          <div className="hidden md:block w-px h-4 bg-zinc-800" />

          <div className="text-zinc-400">
            Fast scope confirmation for agencies & freelancers
          </div>

          <div className="hidden md:block w-px h-4 bg-zinc-800" />

          <div className="text-zinc-400">
            Built in South Africa 🇿🇦
          </div>
        </div>
      </div>
    </section>
  );
}
