import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { templates } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export default async function TemplatesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const results = await db
    .select()
    .from(templates)
    .where(eq(templates.userId, session.user.id))
    .orderBy(desc(templates.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Templates</h2>
          <p className="text-slate-600 text-sm mt-1">
            {results.length} template{results.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/dashboard/templates/new"
          className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
        >
          New template
        </Link>
      </div>

      {results.length === 0 ? (
        <div className="rounded-2xl border bg-white p-12 text-center">
          <div className="text-4xl mb-3">📋</div>
          <h3 className="text-lg font-semibold mb-1">No templates yet</h3>
          <p className="text-slate-600 text-sm mb-4">
            Create reusable receipt templates with pre-filled bullets, amounts,
            and subjects for your common call types.
          </p>
          <Link
            href="/dashboard/templates/new"
            className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Create template
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {results.map((t) => {
            let bullets: string[] = [];
            try { bullets = JSON.parse(t.bullets || "[]"); } catch { /* corrupted row */ }
            return (
              <div key={t.id} className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{t.name}</h3>
                  {t.industry && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {t.industry}
                    </span>
                  )}
                </div>
                {t.subject && (
                  <p className="text-sm text-slate-600 mb-2">{t.subject}</p>
                )}
                <ul className="list-disc pl-5 text-sm space-y-0.5">
                  {bullets.slice(0, 5).map((b, i) => (
                    <li key={i} className="text-slate-700">{b}</li>
                  ))}
                  {bullets.length > 5 && (
                    <li className="text-slate-400">
                      +{bullets.length - 5} more items
                    </li>
                  )}
                </ul>
                {t.amount && (
                  <p className="text-xs text-slate-500 mt-2">
                    Default amount: ${t.amount}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
