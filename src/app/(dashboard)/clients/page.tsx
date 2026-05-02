import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export default async function ClientsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const results = await db
    .select()
    .from(clients)
    .where(eq(clients.userId, session.user.id))
    .orderBy(desc(clients.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Clients</h2>
          <p className="text-slate-600 text-sm mt-1">
            {results.length} client{results.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="rounded-2xl border bg-white p-12 text-center">
          <div className="text-4xl mb-3">👥</div>
          <h3 className="text-lg font-semibold mb-1">No clients yet</h3>
          <p className="text-slate-600 text-sm mb-4">
            Clients are automatically added when you send a receipt to a new email address.
          </p>
          <Link
            href="/dashboard/receipts/new"
            className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Create a receipt
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">
                  Company
                </th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">
                  Added
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{c.name || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{c.email}</td>
                  <td className="px-4 py-3 text-slate-600 hidden md:table-cell">
                    {c.company || "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-500 hidden md:table-cell">
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
