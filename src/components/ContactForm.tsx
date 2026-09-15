"use client";

import { useState, FormEvent } from "react";
import { site } from "@/lib/content";
import { Button } from "./Button";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const fd = new FormData(e.currentTarget);
    const vorname = String(fd.get("vorname") || "").trim();
    const nachname = String(fd.get("nachname") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();

    if (!vorname || !nachname || !email || !message) {
      setError("Bitte alle Pflichtfelder ausfüllen.");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vorname, nachname, email, message }),
      });
      const data = await res.json();
      if (data.mailto) {
        window.location.href = data.mailto;
      }
      setStatus("done");
      (e.target as HTMLFormElement).reset();
    } catch {
      const subject = encodeURIComponent(`Kontaktanfrage von ${vorname} ${nachname}`);
      const body = encodeURIComponent(
        `Name: ${vorname} ${nachname}\nE-Mail: ${email}\n\nNachricht:\n${message}`,
      );
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      setStatus("done");
    }
  }

  const field =
    "w-full border-0 border-b border-brand-blue/40 bg-transparent px-0 py-2 text-brand-blue placeholder:text-brand-blue/40 focus:border-brand-blue focus:ring-0 outline-none";

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-brand-blue">Vorname *</span>
          <input name="vorname" required autoComplete="given-name" className={field} />
        </label>
        <label className="block">
          <span className="text-sm text-brand-blue">Nachname *</span>
          <input name="nachname" required autoComplete="family-name" className={field} />
        </label>
      </div>
      <label className="block">
        <span className="text-sm text-brand-blue">E-Mail-Adresse *</span>
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <label className="block">
        <span className="text-sm text-brand-blue">Nachricht *</span>
        <textarea
          name="message"
          required
          rows={4}
          placeholder="Nachricht schreiben …"
          className={`${field} resize-y min-h-[6rem]`}
        />
      </label>

      {error && <p className="text-sm text-brand-coral" role="alert">{error}</p>}
      {status === "done" && (
        <p className="text-sm text-brand-blue" role="status">
          Ihr E-Mail-Programm öffnet sich mit der Nachricht. Falls nicht, schreiben Sie uns an{" "}
          <a className="underline" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          .
        </p>
      )}

      <Button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Wird vorbereitet…" : "Absenden"}
      </Button>
    </form>
  );
}
