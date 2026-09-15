import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import Link from "next/link";

export default async function AdminPage() {
  const session = await getSession();
  if (session) {
    redirect("/admin/reservierungen");
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="font-serif text-3xl text-brand-blue mb-2">Anmelden</h1>
      <p className="text-sm text-brand-ink/70 mb-8">
        Verwaltung von Reservierungen und Speisekarten.
      </p>
      <Suspense fallback={<p className="text-sm">Laden…</p>}>
        <AdminLoginForm />
      </Suspense>
      <p className="mt-8 text-sm text-brand-ink/50">
        <Link href="/" className="underline">
          Zurück zur Website
        </Link>
      </p>
    </div>
  );
}
