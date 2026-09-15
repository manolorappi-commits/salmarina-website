import { site } from "@/lib/content";
import menu from "../../content/menu.json";
import menuVorschlaege from "../../content/menu-vorschlaege.json";
import reservationsConfig from "../../content/reservations.json";

export type ChatRole = "bot" | "user";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  links?: Array<{ href: string; label: string }>;
};

export type ReservationDraft = {
  partySize?: number;
  date?: string;
  time?: string;
  name?: string;
  email?: string;
  phone?: string;
  notes?: string;
};

export type ChatState = {
  flow: "idle" | "reserve";
  step:
    | null
    | "partySize"
    | "date"
    | "time"
    | "name"
    | "email"
    | "phone"
    | "notes"
    | "confirm";
  draft: ReservationDraft;
};

export function initialChatState(): ChatState {
  return { flow: "idle", step: null, draft: {} };
}

export function welcomeMessage(): ChatMessage {
  return {
    id: uid(),
    role: "bot",
    text:
      `Grüezi! Ich bin der Salmarina-Assistent. Fragen Sie mich zu Öffnungszeiten, Speisekarte, Mittagsmenü, Monatskarte oder Reservierungen — ich helfe gerne.`,
    links: [
      { href: "/reservierungen", label: "Tisch reservieren" },
      { href: "/speisekarte", label: "Speisekarte" },
      { href: "/mittagsmenus", label: "Mittagsmenüs" },
    ],
  };
}

function uid(): string {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .trim();
}

type Intent =
  | "hours"
  | "menu"
  | "lunch"
  | "monthly"
  | "suggestions"
  | "reserve"
  | "contact"
  | "location"
  | "hello"
  | "thanks"
  | "help"
  | "cancel"
  | "unknown";

function detectIntent(raw: string): Intent {
  const t = norm(raw);

  if (/^(hallo|grüezi|gruezi|hi|hey|guten (tag|abend|morgen)|servus)/.test(t)) return "hello";
  if (/danke|merci|thank/.test(t)) return "thanks";
  if (/hilfe|help|was kannst|optionen|menü bot|menu bot/.test(t)) return "help";
  if (/abbrechen|cancel|stopp|stop|zurück|zuruck/.test(t)) return "cancel";

  if (
    /offnungs|öffnungs|offen|ruhetag|wann (habt|seid)|öffnezeit|oeffnungs/.test(t) ||
    /stunden|opening/.test(t)
  ) {
    return "hours";
  }
  if (/mittag|tagesmen|tageskarte|lunch/.test(t)) return "lunch";
  if (/monatskarte|monats.?karte|saison/.test(t)) return "monthly";
  if (/menuevorschlag|menuvorschlag|anlass|feier|firmenevent|eisen|diamant/.test(t)) {
    return "suggestions";
  }
  if (/speisekarte|karte|pizza|pasta|essen|gerichte|allerg/.test(t)) return "menu";
  if (
    /reserv|tisch|buch(en|ung)|platz|table|party|personen|anmeld/.test(t)
  ) {
    return "reserve";
  }
  if (/telefon|anruf|mail|email|kontakt|whatsapp/.test(t)) return "contact";
  if (/adresse|wo (seid|liegt)|standort|hombrecht|karte finden|anfahrt/.test(t)) {
    return "location";
  }
  return "unknown";
}

function hoursText(): string {
  const lines = site.hours.map((h) => `• ${h.days}: ${h.text}`).join("\n");
  return `Unsere Öffnungszeiten (Europe/Zurich):\n${lines}\n\nOnline-Reservierung in ${reservationsConfig.slotIntervalMinutes}-Minuten-Slots, max. ${reservationsConfig.maxSeatsPerSlot} Plätze bzw. ${reservationsConfig.maxPartiesPerSlot} Partien pro Slot.`;
}

function menuText(): string {
  const cats = menu.categories.map((c) => c.title).join(", ");
  return `Auf der Speisekarte finden Sie u. a.: ${cats}. Aktuelle Preise und Gerichte stehen auf den Kartenbildern.`;
}

export type BotReply = {
  messages: ChatMessage[];
  state: ChatState;
  /** If set, UI should fetch slots for this date */
  fetchSlotsForDate?: string;
  /** If set, UI should POST reservation */
  submitReservation?: ReservationDraft;
};

export function handleUserMessage(
  raw: string,
  state: ChatState,
  opts?: { availableSlots?: string[] },
): BotReply {
  const text = raw.trim();
  if (!text) {
    return {
      state,
      messages: [{ id: uid(), role: "bot", text: "Schreiben Sie einfach Ihre Frage — z. B. «Öffnungszeiten» oder «Tisch reservieren»." }],
    };
  }

  // Active reservation flow
  if (state.flow === "reserve" && state.step) {
    return handleReserveStep(text, state, opts);
  }

  const intent = detectIntent(text);

  switch (intent) {
    case "hello":
      return {
        state,
        messages: [
          {
            id: uid(),
            role: "bot",
            text: `Grüezi! Willkommen bei ${site.name}. Wobei darf ich helfen — Öffnungszeiten, Speisekarte oder eine Reservierung?`,
          },
        ],
      };
    case "thanks":
      return {
        state,
        messages: [
          {
            id: uid(),
            role: "bot",
            text: "Gerne! Wir freuen uns auf Ihren Besuch. Falls noch etwas ist — einfach schreiben.",
          },
        ],
      };
    case "help":
      return {
        state,
        messages: [
          {
            id: uid(),
            role: "bot",
            text: "Ich kann Auskunft geben zu:\n• Öffnungszeiten\n• Speisekarte / Pizza & Pasta\n• Mittagsmenü & Monatskarte\n• Menüvorschläge für Anlässe\n• Reservierungen (auch direkt hier im Chat)\n• Adresse & Kontakt",
            links: [
              { href: "/reservierungen", label: "Reservierungsseite" },
              { href: "/kontakt", label: "Kontakt" },
            ],
          },
        ],
      };
    case "cancel":
      return {
        state: initialChatState(),
        messages: [
          {
            id: uid(),
            role: "bot",
            text: "Alles klar — Vorgang abgebrochen. Wie kann ich sonst helfen?",
          },
        ],
      };
    case "hours":
      return {
        state,
        messages: [
          {
            id: uid(),
            role: "bot",
            text: hoursText(),
            links: [{ href: "/reservierungen", label: "Jetzt reservieren" }],
          },
        ],
      };
    case "lunch":
      return {
        state,
        messages: [
          {
            id: uid(),
            role: "bot",
            text: `${menu.mittagsmenus.title}: ${menu.mittagsmenus.intro} Di–Fr mittags geöffnet (11–14 Uhr).`,
            links: [{ href: "/mittagsmenus", label: "Mittagsmenüs ansehen" }],
          },
        ],
      };
    case "monthly":
      return {
        state,
        messages: [
          {
            id: uid(),
            role: "bot",
            text: `${menu.monatskarte.title}: ${menu.monatskarte.intro}`,
            links: [{ href: "/monatskarte", label: "Monatskarte ansehen" }],
          },
        ],
      };
    case "suggestions":
      return {
        state,
        messages: [
          {
            id: uid(),
            role: "bot",
            text: `${menuVorschlaege.title}: ${menuVorschlaege.intro} Stufen: ${menuVorschlaege.tiers.map((t) => t.name).join(", ")}.`,
            links: [{ href: "/menuevorschlaege", label: "Menüvorschläge" }],
          },
        ],
      };
    case "menu":
      return {
        state,
        messages: [
          {
            id: uid(),
            role: "bot",
            text: menuText(),
            links: [
              { href: "/speisekarte", label: "Speisekarte" },
              { href: "/monatskarte", label: "Monatskarte" },
              { href: "/mittagsmenus", label: "Mittagsmenüs" },
            ],
          },
        ],
      };
    case "contact":
      return {
        state,
        messages: [
          {
            id: uid(),
            role: "bot",
            text: `Sie erreichen uns unter ${site.phone} oder ${site.email}.`,
            links: [
              { href: site.phoneHref, label: "Anrufen" },
              { href: "/kontakt", label: "Kontaktformular" },
            ],
          },
        ],
      };
    case "location":
      return {
        state,
        messages: [
          {
            id: uid(),
            role: "bot",
            text: `${site.name} finden Sie an der ${site.address.full}.`,
            links: [{ href: "/kontakt", label: "Anfahrt & Kontakt" }],
          },
        ],
      };
    case "reserve":
      return startReserveFlow(state);
    default:
      return {
        state,
        messages: [
          {
            id: uid(),
            role: "bot",
            text:
              "Das habe ich nicht ganz verstanden. Probieren Sie z. B. «Öffnungszeiten», «Mittagsmenü», «Speisekarte» oder «Tisch reservieren». Oder schreiben Sie «Hilfe».",
            links: [
              { href: "/reservierungen", label: "Zur Reservierung" },
              { href: "/speisekarte", label: "Speisekarte" },
            ],
          },
        ],
      };
  }
}

function startReserveFlow(_state: ChatState): BotReply {
  const next: ChatState = {
    flow: "reserve",
    step: "partySize",
    draft: {},
  };
  return {
    state: next,
    messages: [
      {
        id: uid(),
        role: "bot",
        text:
          "Gerne reservieren wir Ihren Tisch. Für wie viele Personen? (1–12)\n\nTipp: Sie können jederzeit «abbrechen» schreiben oder die Seite nutzen:",
        links: [{ href: "/reservierungen", label: "Reservierungsformular" }],
      },
    ],
  };
}

function handleReserveStep(
  text: string,
  state: ChatState,
  opts?: { availableSlots?: string[] },
): BotReply {
  const intent = detectIntent(text);
  if (intent === "cancel") {
    return {
      state: initialChatState(),
      messages: [{ id: uid(), role: "bot", text: "Reservierung abgebrochen. Wie kann ich sonst helfen?" }],
    };
  }

  const draft = { ...state.draft };

  switch (state.step) {
    case "partySize": {
      const n = Number(text.replace(/[^\d]/g, ""));
      if (!Number.isFinite(n) || n < 1 || n > 12) {
        return {
          state,
          messages: [
            {
              id: uid(),
              role: "bot",
              text: "Bitte eine Zahl zwischen 1 und 12 eingeben.",
            },
          ],
        };
      }
      draft.partySize = n;
      return {
        state: { flow: "reserve", step: "date", draft },
        messages: [
          {
            id: uid(),
            role: "bot",
            text: `Perfekt, ${n} ${n === 1 ? "Person" : "Personen"}. An welchem Datum? Bitte im Format JJJJ-MM-TT (z. B. 2026-09-20).\n\nHinweis: Montag Ruhetag; So nur mittags; Sa nur abends.`,
          },
        ],
      };
    }
    case "date": {
      const m = text.match(/(\d{4}-\d{2}-\d{2})/);
      const alt = text.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
      let date = m?.[1];
      if (!date && alt) {
        date = `${alt[3]}-${alt[2].padStart(2, "0")}-${alt[1].padStart(2, "0")}`;
      }
      if (!date) {
        return {
          state,
          messages: [
            {
              id: uid(),
              role: "bot",
              text: "Bitte Datum als JJJJ-MM-TT oder TT.MM.JJJJ angeben.",
            },
          ],
        };
      }
      draft.date = date;
      return {
        state: { flow: "reserve", step: "time", draft },
        messages: [
          {
            id: uid(),
            role: "bot",
            text: `Datum ${date} — ich lade die verfügbaren Uhrzeiten… Bitte danach eine Uhrzeit wählen (z. B. 18:00).`,
          },
        ],
        fetchSlotsForDate: date,
      };
    }
    case "time": {
      const tMatch = text.match(/(\d{1,2}):(\d{2})/);
      if (!tMatch) {
        return {
          state,
          messages: [
            {
              id: uid(),
              role: "bot",
              text: `Bitte eine Uhrzeit wie 18:00 wählen.${
                opts?.availableSlots?.length
                  ? `\nVerfügbar: ${opts.availableSlots.slice(0, 12).join(", ")}${opts.availableSlots.length > 12 ? "…" : ""}`
                  : ""
              }`,
            },
          ],
        };
      }
      const time = `${tMatch[1].padStart(2, "0")}:${tMatch[2]}`;
      if (opts?.availableSlots && opts.availableSlots.length > 0 && !opts.availableSlots.includes(time)) {
        return {
          state,
          messages: [
            {
              id: uid(),
              role: "bot",
              text: `«${time}» ist nicht verfügbar. Bitte eine dieser Zeiten: ${opts.availableSlots.join(", ")}`,
            },
          ],
        };
      }
      draft.time = time;
      return {
        state: { flow: "reserve", step: "name", draft },
        messages: [
          {
            id: uid(),
            role: "bot",
            text: `Super, ${time} Uhr. Wie ist Ihr Name?`,
          },
        ],
      };
    }
    case "name": {
      if (text.length < 2) {
        return {
          state,
          messages: [{ id: uid(), role: "bot", text: "Bitte Ihren Namen angeben." }],
        };
      }
      draft.name = text;
      return {
        state: { flow: "reserve", step: "email", draft },
        messages: [
          {
            id: uid(),
            role: "bot",
            text: "Und Ihre E-Mail-Adresse für die Bestätigung?",
          },
        ],
      };
    }
    case "email": {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
        return {
          state,
          messages: [
            { id: uid(), role: "bot", text: "Das sieht nicht nach einer gültigen E-Mail aus. Bitte erneut versuchen." },
          ],
        };
      }
      draft.email = text;
      return {
        state: { flow: "reserve", step: "phone", draft },
        messages: [
          {
            id: uid(),
            role: "bot",
            text: "Telefonnummer? (optional — schreiben Sie «überspringen» wenn nicht)",
          },
        ],
      };
    }
    case "phone": {
      if (!/überspring|ueberspring|skip|nein|keine/.test(norm(text))) {
        draft.phone = text;
      } else {
        draft.phone = "";
      }
      return {
        state: { flow: "reserve", step: "notes", draft },
        messages: [
          {
            id: uid(),
            role: "bot",
            text: "Bemerkungen (Allergien, Anlass…)? Oder «überspringen».",
          },
        ],
      };
    }
    case "notes": {
      if (!/überspring|ueberspring|skip|nein|keine/.test(norm(text))) {
        draft.notes = text;
      } else {
        draft.notes = "";
      }
      const summary =
        `Bitte prüfen:\n• ${draft.partySize} Personen\n• ${draft.date} um ${draft.time}\n• ${draft.name}\n• ${draft.email}` +
        (draft.phone ? `\n• Tel. ${draft.phone}` : "") +
        (draft.notes ? `\n• ${draft.notes}` : "") +
        `\n\nSchreiben Sie «ja» zum Absenden oder «abbrechen».`;
      return {
        state: { flow: "reserve", step: "confirm", draft },
        messages: [{ id: uid(), role: "bot", text: summary }],
      };
    }
    case "confirm": {
      if (/^(ja|yes|ok|okay|bestätig|bestaetig|senden|absenden)/.test(norm(text))) {
        return {
          state: { flow: "reserve", step: "confirm", draft },
          messages: [
            {
              id: uid(),
              role: "bot",
              text: "Einen Moment — ich sende Ihre Reservierung…",
            },
          ],
          submitReservation: draft,
        };
      }
      return {
        state,
        messages: [
          {
            id: uid(),
            role: "bot",
            text: "Bitte «ja» zum Bestätigen oder «abbrechen».",
          },
        ],
      };
    }
    default:
      return startReserveFlow(state);
  }
}

export function reservationSuccessMessage(code: string, status: string, warn?: boolean): ChatMessage {
  return {
    id: uid(),
    role: "bot",
    text:
      `Vielen Dank! Ihre Reservierung wurde gespeichert.\nReferenz: ${code}\nStatus: ${
        status === "confirmed" ? "bestätigt" : "ausstehend (wir melden uns)"
      }.` +
      (warn
        ? "\n\nHinweis: E-Mail-Versand im Testmodus nur geloggt — die Reservierung ist trotzdem gespeichert."
        : "\n\nSie erhalten eine E-Mail-Bestätigung."),
    links: [
      { href: `/reservierungen/erfolg?code=${encodeURIComponent(code)}&status=${encodeURIComponent(status)}`, label: "Details ansehen" },
      { href: "/speisekarte", label: "Speisekarte" },
    ],
  };
}

export function quickReplies(): string[] {
  return ["Öffnungszeiten", "Speisekarte", "Mittagsmenü", "Monatskarte", "Tisch reservieren"];
}
