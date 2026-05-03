import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from "./sign-out-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top nav */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
        <div className="px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              AgreeMint
            </Link>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-600 hidden sm:inline">{session.user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-56 min-h-[calc(100vh-3.5rem)] border-r bg-white px-3 py-4 shrink-0">
          <nav className="space-y-1 text-sm">
            <SidebarLink href="/dashboard" label="Home" icon="🏠" />
            <SidebarLink href="/dashboard/receipts" label="Receipts" icon="📄" />
            <SidebarLink href="/dashboard/receipts/new" label="New receipt" icon="➕" />
            <SidebarLink href="/dashboard/chats" label="WhatsApp" icon="💬" />
            <SidebarLink href="/dashboard/clients" label="Clients" icon="👥" />
            <SidebarLink href="/dashboard/templates" label="Templates" icon="📋" />
            <SidebarLink href="/dashboard/analytics" label="Analytics" icon="📊" />
            <SidebarLink href="/dashboard/settings" label="Settings" icon="⚙️" />
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 px-6 py-8 max-w-5xl">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 border-t flex items-center justify-around py-2 text-xs">
        <MobileNavLink href="/dashboard" label="Home" icon="🏠" />
        <MobileNavLink href="/dashboard/receipts" label="Receipts" icon="📄" />
        <MobileNavLink href="/dashboard/receipts/new" label="New" icon="➕" />
        <MobileNavLink href="/dashboard/chats" label="Chats" icon="💬" />
        <MobileNavLink href="/dashboard/clients" label="Clients" icon="👥" />
        <MobileNavLink href="/dashboard/templates" label="Templates" icon="📋" />
        <MobileNavLink href="/dashboard/analytics" label="Analytics" icon="📊" />
        <MobileNavLink href="/dashboard/settings" label="Settings" icon="⚙️" />
      </nav>
    </div>
  );
}

function SidebarLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100 text-slate-700"
    >
      <span>{icon}</span>
      {label}
    </Link>
  );
}

function MobileNavLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-0.5 text-slate-600 py-1">
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
