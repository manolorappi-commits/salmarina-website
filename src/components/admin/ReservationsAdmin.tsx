"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { getZurichToday } from "@/lib/hours-client";

type Reservation = {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  partySize: number;
  date: string;
  time: string;
  notes: string;
  status: string;
  createdAt: string;
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Ausstehend",
  confirmed: "Bestätigt",
  cancelled: "Storniert",
  completed: "Abgeschlossen",
};

const field =
  "rounded-md border border-brand-blue/20 bg-white px-3 py-2 text-sm text-brand-ink focus:border-brand-blue outline-none";

export function ReservationsAdmin() {
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [rows, setRows] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setMessage("");
    const q = new URLSearchParams();
    if (date) q.set("date", date);
    if (status) q.set("status", status);
    try {
      const res = await fetch(`/api/admin/reservations?${q.toString()}`);
      if (res.status === 401) {
        window.location.href = "/admin";
        return;
      }
      const data = await res.json();
      setRows(data.reservations || []);
    } catch {
      setMessage("Laden fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  }, [date, status]);

  useEffect(() => {
    void load();
  }, [load]);

  async function setReservationStatus(id: string, next: string) {
    setBusyId(id);
    setMessage("");
    try {
      const res = await fetch("/api/admin/reservations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Fehler");
      } else {
        if (data.emailWarning) setMessage(data.emailWarning);
        await load();
      }
    } catch {
      setMessage("Netzwerkfehler.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-end">
        <label className="block">
          <span className="text-xs text-brand-blue block mb-1">Datum</span>
          <input
            type="date"
            className={field}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-xs text-brand-blue block mb-1">Status</span>
          <select className={field} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Alle</option>
            {Object.entries(STATUS_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <Button type="button" variant="pill" onClick={() => { setDate(getZurichToday()); }}>
          Heute
        </Button>
        <Button type="button" variant="outline" className="!rounded-md !px-4 !py-2 !text-sm" onClick={() => { setDate(""); setStatus(""); }}>
          Filter zurücksetzen
        </Button>
      </div>

      {message && <p className="text-sm text-brand-coral">{message}</p>}
      {loading && <p className="text-sm text-brand-ink/60">Laden…</p>}

      {!loading && rows.length === 0 && (
        <p className="text-brand-ink/60">Keine Reservierungen gefunden.</p>
      )}

      <div className="space-y-3">
        {rows.map((r) => (
          <article
            key={r.id}
            className="rounded-xl border border-brand-blue/15 bg-white p-4 sm:p-5 flex flex-col gap-3 sm:flex-row sm:justify-between"
          >
            <div>
              <p className="font-medium text-brand-blue">
                {r.code} · {r.date} {r.time} · {r.partySize} Pers.
              </p>
              <p className="text-sm mt-1">
                {r.name} ·{" "}
                <a className="underline" href={`mailto:${r.email}`}>
                  {r.email}
                </a>
                {r.phone ? ` · ${r.phone}` : ""}
              </p>
              {r.notes && <p className="text-sm text-brand-ink/70 mt-1">{r.notes}</p>}
              <p className="text-xs mt-2 inline-flex rounded-full bg-brand-powder/60 px-2 py-0.5 text-brand-blue">
                {STATUS_LABEL[r.status] || r.status}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 items-start">
              {r.status === "pending" && (
                <button
                  type="button"
                  disabled={busyId === r.id}
                  className="text-sm rounded-md bg-brand-blue text-white px-3 py-1.5 disabled:opacity-50"
                  onClick={() => setReservationStatus(r.id, "confirmed")}
                >
                  Bestätigen
                </button>
              )}
              {(r.status === "pending" || r.status === "confirmed") && (
                <button
                  type="button"
                  disabled={busyId === r.id}
                  className="text-sm rounded-md border border-brand-coral text-brand-coral px-3 py-1.5 disabled:opacity-50"
                  onClick={() => setReservationStatus(r.id, "cancelled")}
                >
                  Stornieren
                </button>
              )}
              {r.status === "confirmed" && (
                <button
                  type="button"
                  disabled={busyId === r.id}
                  className="text-sm rounded-md border border-brand-blue/40 text-brand-blue px-3 py-1.5 disabled:opacity-50"
                  onClick={() => setReservationStatus(r.id, "completed")}
                >
                  Abgeschlossen
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
