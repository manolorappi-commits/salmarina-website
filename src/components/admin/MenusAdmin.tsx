"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/Button";

type Slot = {
  id: string;
  label: string;
  accept: string;
  defaultFilename: string;
};

type Asset = {
  slot: string;
  url: string;
  filename: string;
  updatedAt: string;
};

export function MenusAdmin() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [blobConfigured, setBlobConfigured] = useState(false);
  const [slotId, setSlotId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function refresh() {
    const res = await fetch("/api/admin/menus");
    if (res.status === 401) {
      window.location.href = "/admin";
      return;
    }
    const data = await res.json();
    setSlots(data.slots || []);
    setAssets(data.assets || []);
    setBlobConfigured(Boolean(data.blobConfigured));
    if (!slotId && data.slots?.[0]) setSlotId(data.slots[0].id);
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/menus", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload fehlgeschlagen.");
      } else {
        setMessage(`Hochgeladen: ${data.url}${data.warning ? ` — ${data.warning}` : ""}`);
        (e.target as HTMLFormElement).reset();
        await refresh();
      }
    } catch {
      setError("Netzwerkfehler.");
    } finally {
      setLoading(false);
    }
  }

  const selected = slots.find((s) => s.id === slotId);

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-brand-blue/15 bg-white p-4 text-sm text-brand-ink/80">
        {blobConfigured ? (
          <p>Vercel Blob ist konfiguriert — Uploads werden in den Blob-Store geschrieben.</p>
        ) : (
          <p>
            Lokal: Dateien landen in <code className="text-brand-blue">public/menus/</code> und die
            Content-JSON wird aktualisiert. Auf Vercel bitte{" "}
            <code className="text-brand-blue">BLOB_READ_WRITE_TOKEN</code> setzen.
          </p>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-4 max-w-lg rounded-xl border border-brand-blue/15 bg-white p-6">
        <label className="block">
          <span className="text-sm text-brand-blue mb-1 block">Slot</span>
          <select
            name="slot"
            className="w-full rounded-md border border-brand-blue/20 px-3 py-2.5"
            value={slotId}
            onChange={(e) => setSlotId(e.target.value)}
            required
          >
            {slots.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm text-brand-blue mb-1 block">Datei</span>
          <input
            name="file"
            type="file"
            required
            accept={selected?.accept || "image/*,application/pdf"}
            className="block w-full text-sm"
          />
        </label>
        {error && <p className="text-sm text-brand-coral">{error}</p>}
        {message && <p className="text-sm text-brand-blue">{message}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Wird hochgeladen…" : "Hochladen"}
        </Button>
      </form>

      <div>
        <h2 className="font-serif text-xl text-brand-blue mb-3">Aktuelle Assets</h2>
        {assets.length === 0 ? (
          <p className="text-sm text-brand-ink/60">Noch keine Uploads in der Datenbank.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {assets.map((a) => (
              <li key={a.slot} className="flex flex-wrap gap-2 items-baseline">
                <span className="font-medium text-brand-blue">{a.slot}</span>
                <a href={a.url} target="_blank" rel="noreferrer" className="underline break-all">
                  {a.url}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
