"use client";

import { useCallback, useEffect, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { site } from "@/lib/content";
import { Button } from "./Button";
import { getZurichToday } from "@/lib/hours-client";

type Slot = {
  time: string;
  available: boolean;
  remainingSeats: number;
  reason?: string;
};

type Props = {
  compact?: boolean;
};

const field =
  "w-full rounded-md border border-brand-blue/20 bg-white px-3 py-2.5 text-brand-ink placeholder:text-brand-ink/40 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none";

export function ReservationForm({ compact = false }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsMessage, setSlotsMessage] = useState("");
  const [partySize, setPartySize] = useState("");

  const minDate = getZurichToday();

  useEffect(() => {
    const d = searchParams.get("date");
    const t = searchParams.get("time");
    const p = searchParams.get("persons") || searchParams.get("partySize");
    if (d) setDate(d);
    if (t) setTime(t);
    if (p) setPartySize(p);
  }, [searchParams]);

  const loadSlots = useCallback(async (d: string) => {
    if (!d) {
      setSlots([]);
      setSlotsMessage("");
      return;
    }
    setSlotsLoading(true);
    setSlotsMessage("");
    setTime("");
    try {
      const res = await fetch(`/api/reservations/slots?date=${encodeURIComponent(d)}`);
      const data = await res.json();
      if (data.closed) {
        setSlots([]);
        setSlotsMessage(data.message || "Geschlossen");
      } else {
        setSlots(data.slots || []);
        setSlotsMessage("");
      }
    } catch {
      setSlots([]);
      setSlotsMessage("Zeiten konnten nicht geladen werden.");
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (date) void loadSlots(date);
  }, [date, loadSlots]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const fd = new FormData(e.currentTarget);

    const payload = {
      partySize: Number(fd.get("partySize") || partySize || 0),
      date: String(fd.get("date") || date || "").trim(),
      time: String(fd.get("time") || time || "").trim(),
      name: String(fd.get("name") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      notes: String(fd.get("notes") || "").trim(),
    };

    if (!payload.partySize || !payload.date || !payload.time) {
      setError("Bitte Personenzahl, Datum und Uhrzeit angeben.");
      setStatus("error");
      return;
    }
    if (!compact && (!payload.name || !payload.email)) {
      setError("Bitte Name und E-Mail angeben.");
      setStatus("error");
      return;
    }
    if (compact && (!payload.name || !payload.email)) {
      // Compact CTA: redirect to full page with query params
      const q = new URLSearchParams({
        persons: String(payload.partySize),
        date: payload.date,
        time: payload.time,
      });
      router.push(`/reservierungen?${q.toString()}`);
      setStatus("idle");
      return;
    }

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Reservierung fehlgeschlagen.");
        setStatus("error");
        return;
      }
      setStatus("done");
      const q = new URLSearchParams({
        code: data.reservation.code,
        status: data.reservation.status,
      });
      if (data.emailWarning) q.set("warn", "1");
      router.push(`/reservierungen/erfolg?${q.toString()}`);
    } catch {
      setError("Netzwerkfehler. Bitte später erneut versuchen oder anrufen: " + site.phone);
      setStatus("error");
    }
  }

  const slotPicker = (
    <div className="space-y-2">
      {slotsLoading && <p className="text-sm text-brand-blue/70">Verfügbare Zeiten werden geladen…</p>}
      {!slotsLoading && slotsMessage && (
        <p className="text-sm text-brand-coral" role="status">
          {slotsMessage}
        </p>
      )}
      {!slotsLoading && slots.length > 0 && (
        <div className="flex flex-wrap gap-2" role="listbox" aria-label="Uhrzeit wählen">
          {slots.map((s) => {
            const selected = time === s.time;
            const disabled = !s.available;
            return (
              <button
                key={s.time}
                type="button"
                role="option"
                aria-selected={selected}
                disabled={disabled}
                onClick={() => setTime(s.time)}
                className={[
                  "rounded-md px-3 py-2 text-sm border transition-colors",
                  disabled
                    ? "border-brand-ink/10 text-brand-ink/30 cursor-not-allowed line-through"
                    : selected
                      ? "border-brand-blue bg-brand-blue text-white"
                      : "border-brand-blue/30 text-brand-blue hover:bg-brand-powder/50",
                ].join(" ")}
                title={s.reason || `${s.remainingSeats} Plätze`}
              >
                {s.time}
              </button>
            );
          })}
        </div>
      )}
      <input type="hidden" name="time" value={time} required />
    </div>
  );

  if (compact) {
    return (
      <form onSubmit={onSubmit} className="w-full" noValidate>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-end">
          <label className="block">
            <span className="sr-only">Personenzahl</span>
            <select
              name="partySize"
              required
              className={field}
              value={partySize}
              onChange={(e) => setPartySize(e.target.value)}
            >
              <option value="" disabled>
                Personenzahl
              </option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={String(n)}>
                  {n} {n === 1 ? "Person" : "Personen"}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Datum</span>
            <input
              name="date"
              type="date"
              required
              min={minDate}
              className={field}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <div className="sm:col-span-2 lg:col-span-1">
            {date ? (
              slotPicker
            ) : (
              <p className="text-sm text-brand-ink/50 py-2">Zuerst Datum wählen</p>
            )}
          </div>
          <Button type="submit" className="rounded-md w-full sm:w-auto" disabled={status === "sending" || !time}>
            Weiter zur Reservierung
          </Button>
        </div>
        {error && (
          <p className="mt-3 text-sm text-brand-coral" role="alert">
            {error}
          </p>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 max-w-xl" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-brand-blue mb-1 block">Personenzahl *</span>
          <select
            name="partySize"
            required
            className={field}
            value={partySize}
            onChange={(e) => setPartySize(e.target.value)}
          >
            <option value="" disabled>
              Bitte wählen
            </option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={String(n)}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm text-brand-blue mb-1 block">Datum *</span>
          <input
            name="date"
            type="date"
            required
            min={minDate}
            className={field}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
      </div>

      <div>
        <span className="text-sm text-brand-blue mb-2 block">Uhrzeit *</span>
        {!date && <p className="text-sm text-brand-ink/50">Bitte zuerst ein Datum wählen.</p>}
        {date && slotPicker}
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

      <Button type="submit" disabled={status === "sending" || !time}>
        {status === "sending" ? "Wird gesendet…" : "Tisch reservieren"}
      </Button>
    </form>
  );
}
