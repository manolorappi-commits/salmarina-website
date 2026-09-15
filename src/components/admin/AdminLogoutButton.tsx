"use client";

import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="rounded-md border border-brand-blue/30 px-3 py-1.5 text-brand-blue hover:bg-brand-powder/40"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin");
        router.refresh();
      }}
    >
      Abmelden
    </button>
  );
}
