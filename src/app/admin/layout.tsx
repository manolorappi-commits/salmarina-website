import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

export const metadata: Metadata = {
  title: "Admin | Salmarina",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-brand-cream/40">
      <header className="border-b border-brand-blue/15 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-serif text-2xl text-brand-blue">
              Salmarina Admin
            </Link>
            {session && (
              <nav className="flex flex-wrap gap-4 text-sm">
                <Link href="/admin/reservierungen" className="text-brand-ink/70 hover:text-brand-blue">
                  Reservierungen
                </Link>
                <Link href="/admin/speisekarten" className="text-brand-ink/70 hover:text-brand-blue">
                  Speisekarten
                </Link>
                <Link href="/" className="text-brand-ink/50 hover:text-brand-blue">
                  Zur Website
                </Link>
              </nav>
            )}
          </div>
          {session && (
            <div className="flex items-center gap-3 text-sm text-brand-ink/70">
              <span>{session.username}</span>
              <AdminLogoutButton />
            </div>
          )}
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">{children}</div>
    </div>
  );
}
