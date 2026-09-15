"use client";

import { useState, FormEvent } from "react";
import { site } from "@/lib/content";
import { Button } from "./Button";

type Props = {
  compact?: boolean;
};

export function ReservationForm({ compact = false }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      persons: String(fd.get("persons") || "").trim(),
      date: String(fd.get("date") || "").trim(),
      time: String(fd.get("time") || "").trim(),
      name: String(fd.get("name") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      notes: String(fd.get("notes") || "").trim(),
    };

    if (!payload.persons || !payload.date || !payload.time) {
      setError("Bitte Personenzahl, Datum und Uhrzeit angeben.");
      setStatus("error");
      return;
    }
    if (!compact && (!payload.name || !payload.email)) {
      setError("Bitte Name und E-Mail angeben.");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.mailto) {
        window.location.href = data.mailto;
      }
      setStatus("done");
      (e.target as HTMLFormElement).reset();
    } catch {
      const subject = encodeURIComponent(
        `Reservierungsanfrage — ${payload.persons} Pers., ${payload.date} ${payload.time}`,
      );
      const body = encodeURIComponent(
        [
          `Personenzahl: ${payload.persons}`,
          `Datum: ${payload.date}`,
          `Uhrzeit: ${payload.time}`,
          payload.name ? `Name: ${payload.name}` : "",
          payload.phone ? `Telefon: ${payload.phone}` : "",
          payload.email ? `E-Mail: ${payload.email}` : "",
          payload.notes ? `\nBemerkungen:\n${payload.notes}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      );
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      setStatus("done");
    }
  }

  const field =
    "w-full rounded-md border border-brand-blue/20 bg-white px-3 py-2.5 text-brand-ink placeholder:text-brand-ink/40 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none";

  if (compact) {
    return (
      <form onSubmit={onSubmit} className="w-full" noValidate>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4 items-end">
          <label className="block">
            <span className="sr-only">Personenzahl</span>
            <select name="persons" required className={field} defaultValue="">
              <option value="" disabled>
                Personenzahl
              </option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={String(n)}>
                  {n} {n === 1 ? "Person" : "Personen"}
                </option>
              ))}
              <option value="13+">13+ Personen</option>
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Datum</span>
            <input name="date" type="date" required className={field} />
          </label>
          <label className="block">
            <span className="sr-only">Uhrzeit</span>
            <input name="time" type="time" required className={field} />
          </label>
          <Button type="submit" className="rounded-md w-full sm:w-auto" disabled={status === "sending"}>
            Tisch anfragen
          </Button>
        </div>
        {error && (
          <p className="mt-3 text-sm text-brand-coral" role="alert">
            {error}
          </p>
        )}
        {status === "done" && (
          <p className="mt-3 text-sm text-brand-blue" role="status">
            Ihr E-Mail-Programm öffnet sich mit der Anfrage.
          </p>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 max-w-xl" noValidate>
      <div className="grid gap-5 sm:grid-cols-3">
        <label className="block sm:col-span-1">
          <span className="text-sm text-brand-blue mb-1 block">Personenzahl *</span>
          <select name="persons" required className={field} defaultValue="">
            <option value="" disabled>
              Bitte wählen
            </option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={String(n)}>
                {n}
              </option>
            ))}
            <option value="13+">13+</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm text-brand-blue mb-1 block">Datum *</span>
          <input name="date" type="date" required className={field} />
        </label>
        <label className="block">
          <span className="text-sm text-brand-blue mb-1 block">Uhrzeit *</span>
          <input name="time" type="time" required className={field} />
        </label>
      </div>
      <label className="block">
        <span className="text-sm text-brand-blue mb-1 block">Name *</span>
        <input name="name" required autoComplete="name" className={field} />
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-brand-blue mb-1 block">Telefon</span>
          <input name="phone" type="tel" autoComplete="tel" className={field} />
        </label>
        <label className="block">
          <span className="text-sm text-brand-blue mb-1 block">E-Mail *</span>
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
      </div>
      <label className="block">
        <span className="text-sm text-brand-blue mb-1 block">Bemerkungen</span>
        <textarea name="notes" rows={3} className={`${field} resize-y`} placeholder="Allergien, Anlass, …" />
      </label>

      {error && (
        <p className="text-sm text-brand-coral" role="alert">
          {error}
        </p>
      )}
      {status === "done" && (
        <p className="text-sm text-brand-blue" role="status">
          Ihr E-Mail-Programm öffnet sich mit der Reservierungsanfrage. Wir melden uns zur Bestätigung.
        </p>
      )}

      <Button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Wird vorbereitet…" : "Tisch anfragen"}
      </Button>
    </form>
  );
}
