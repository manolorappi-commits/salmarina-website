"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";

const field =
  "w-full rounded-md border border-brand-blue/20 bg-white px-3 py-2.5 text-brand-ink focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none";

export function AdminLoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: String(fd.get("username") || ""),
          password: String(fd.get("password") || ""),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Anmeldung fehlgeschlagen.");
        setLoading(false);
        return;
      }
      const next = search.get("next") || "/admin/reservierungen";
      router.push(next);
      router.refresh();
    } catch {
      setError("Netzwerkfehler.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="text-sm text-brand-blue mb-1 block">Benutzername</span>
        <input name="username" autoComplete="username" required className={field} defaultValue="admin" />
      </label>
      <label className="block">
        <span className="text-sm text-brand-blue mb-1 block">Passwort</span>
        <input name="password" type="password" autoComplete="current-password" required className={field} />
      </label>
      {error && (
        <p className="text-sm text-brand-coral" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "…" : "Anmelden"}
      </Button>
    </form>
  );
}
