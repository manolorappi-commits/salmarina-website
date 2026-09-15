"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChatMessage,
  ChatState,
  handleUserMessage,
  initialChatState,
  quickReplies,
  reservationSuccessMessage,
  welcomeMessage,
} from "@/lib/chatbot";

export function ChatbotWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [state, setState] = useState<ChatState>(initialChatState);
  const [slots, setSlots] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessages([welcomeMessage()]);
  }, []);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, messages, busy]);

  const pushBot = useCallback((msgs: ChatMessage[]) => {
    setMessages((prev) => [...prev, ...msgs]);
  }, []);

  const processReply = useCallback(
    async (raw: string) => {
      setBusy(true);
      try {
        const reply = handleUserMessage(raw, state, {
          availableSlots: slots,
        });

        // Fetch slots when date chosen
        if (reply.fetchSlotsForDate) {
          setState(reply.state);
          pushBot(reply.messages);
          try {
            const res = await fetch(
              `/api/reservations/slots?date=${encodeURIComponent(reply.fetchSlotsForDate)}`,
            );
            const data = await res.json();
            if (data.closed) {
              pushBot([
                {
                  id: `slot-${Date.now()}`,
                  role: "bot",
                  text: data.message || "An diesem Tag ist geschlossen. Bitte anderes Datum wählen.",
                },
              ]);
              setState({ flow: "reserve", step: "date", draft: { ...reply.state.draft, date: undefined } });
              setSlots([]);
            } else {
              const available = (data.slots || [])
                .filter((s: { available: boolean; time: string }) => s.available)
                .map((s: { time: string }) => s.time);
              setSlots(available);
              pushBot([
                {
                  id: `slot-${Date.now()}`,
                  role: "bot",
                  text: available.length
                    ? `Verfügbare Zeiten: ${available.join(", ")}\n\nBitte eine Uhrzeit schreiben (z. B. ${available[0]}).`
                    : "Leider keine freien Zeiten an diesem Tag. Bitte anderes Datum wählen.",
                },
              ]);
              if (!available.length) {
                setState({ flow: "reserve", step: "date", draft: { ...reply.state.draft, date: undefined } });
              }
            }
          } catch {
            pushBot([
              {
                id: `slot-err-${Date.now()}`,
                role: "bot",
                text: "Zeiten konnten nicht geladen werden. Bitte Datum erneut eingeben oder /reservierungen nutzen.",
                links: [{ href: "/reservierungen", label: "Reservierungsseite" }],
              },
            ]);
          }
          return;
        }

        // Submit reservation
        if (reply.submitReservation) {
          setState(reply.state);
          pushBot(reply.messages);
          const d = reply.submitReservation;
          try {
            const res = await fetch("/api/reservations", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                partySize: d.partySize,
                date: d.date,
                time: d.time,
                name: d.name,
                email: d.email,
                phone: d.phone || "",
                notes: d.notes || "",
              }),
            });
            const data = await res.json();
            if (!res.ok) {
              pushBot([
                {
                  id: `res-err-${Date.now()}`,
                  role: "bot",
                  text: data.error || "Reservierung fehlgeschlagen. Bitte erneut versuchen oder anrufen.",
                  links: [{ href: "/reservierungen", label: "Formular" }],
                },
              ]);
              setState(initialChatState());
            } else {
              pushBot([
                reservationSuccessMessage(
                  data.reservation.code,
                  data.reservation.status,
                  Boolean(data.emailWarning),
                ),
              ]);
              setState(initialChatState());
              setSlots([]);
            }
          } catch {
            pushBot([
              {
                id: `res-net-${Date.now()}`,
                role: "bot",
                text: "Netzwerkfehler beim Speichern. Bitte die Reservierungsseite nutzen.",
                links: [{ href: "/reservierungen", label: "Reservieren" }],
              },
            ]);
            setState(initialChatState());
          }
          return;
        }

        setState(reply.state);
        pushBot(reply.messages);
      } finally {
        setBusy(false);
      }
    },
    [state, slots, pushBot],
  );

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", text: trimmed },
    ]);
    await processReply(trimmed);
  }

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <div
          className="flex w-[min(100vw-2rem,24rem)] flex-col overflow-hidden rounded-2xl border border-brand-blue/20 bg-white shadow-xl shadow-brand-ink/15"
          role="dialog"
          aria-label="Salmarina Assistent"
        >
          <div className="flex items-center justify-between bg-brand-blue px-4 py-3 text-white">
            <div>
              <p className="font-serif text-lg leading-tight">Salmarina Assistent</p>
              <p className="text-xs text-white/80">Öffnungszeiten · Karte · Reservierung</p>
            </div>
            <button
              type="button"
              className="rounded-md p-1.5 hover:bg-white/15"
              aria-label="Chat schliessen"
              onClick={() => setOpen(false)}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex max-h-[min(60vh,28rem)] flex-col gap-3 overflow-y-auto bg-brand-cream/40 px-3 py-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={[
                  "max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap",
                  m.role === "user"
                    ? "ml-auto bg-brand-blue text-white rounded-br-md"
                    : "mr-auto bg-white text-brand-ink border border-brand-blue/10 rounded-bl-md",
                ].join(" ")}
              >
                <p>{m.text}</p>
                {m.links && m.links.length > 0 && (
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {m.links.map((l) => (
                      <li key={l.href + l.label}>
                        {l.href.startsWith("tel:") || l.href.startsWith("mailto:") ? (
                          <a
                            href={l.href}
                            className="inline-block rounded-full bg-brand-powder/80 px-2.5 py-1 text-xs text-brand-blue underline-offset-2 hover:underline"
                          >
                            {l.label}
                          </a>
                        ) : (
                          <Link
                            href={l.href}
                            className="inline-block rounded-full bg-brand-powder/80 px-2.5 py-1 text-xs text-brand-blue underline-offset-2 hover:underline"
                            onClick={() => setOpen(false)}
                          >
                            {l.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {busy && (
              <p className="text-xs text-brand-ink/50 px-1" aria-live="polite">
                …
              </p>
            )}
            <div ref={bottomRef} />
          </div>

          {state.flow === "idle" && (
            <div className="flex flex-wrap gap-1.5 border-t border-brand-blue/10 bg-white px-3 py-2">
              {quickReplies().map((q) => (
                <button
                  key={q}
                  type="button"
                  disabled={busy}
                  className="rounded-full border border-brand-blue/25 px-2.5 py-1 text-xs text-brand-blue hover:bg-brand-powder/50 disabled:opacity-50"
                  onClick={() => void send(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <form
            className="flex gap-2 border-t border-brand-blue/10 bg-white p-2"
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ihre Frage…"
              className="min-w-0 flex-1 rounded-xl border border-brand-blue/20 px-3 py-2 text-sm outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
              disabled={busy}
              aria-label="Nachricht"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="rounded-xl bg-brand-coral px-3 py-2 text-sm font-medium text-white hover:bg-brand-coral/90 disabled:opacity-50"
            >
              Senden
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue text-white shadow-lg shadow-brand-blue/30 hover:bg-brand-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
        aria-expanded={open}
        aria-label={open ? "Chat schliessen" : "Chat mit Salmarina Assistent öffnen"}
      >
        {open ? (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M8 10h8M8 14h5M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 21l1.9-4.2A7.7 7.7 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
