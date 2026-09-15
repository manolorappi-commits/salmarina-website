import reservationsConfig from "../../content/reservations.json";

/** Thresholds for transitional badge states (minutes). */
export const CLOSING_SOON_MINUTES = 60;
export const OPENING_SOON_MINUTES = 60;

export type OpeningStatusKind = "open" | "closing_soon" | "opening_soon" | "closed";

export type OpeningStatus = {
  kind: OpeningStatusKind;
  label: "Geöffnet" | "Schliesst bald" | "Öffnet bald" | "Geschlossen";
  /** Today's windows as "11:00–14:00 · 17:00–21:30" or "Ruhetag" */
  hoursSnippet: string;
};

export type OpenWindow = { start: string; end: string };

/** Minutes from midnight for HH:mm */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Calendar weekday in Europe/Zurich: 0=Sun … 6=Sat */
export function zurichWeekday(dateStr: string): number {
  const d = new Date(`${dateStr}T12:00:00Z`);
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Zurich",
    weekday: "short",
  });
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[fmt.format(d)] ?? d.getUTCDay();
}

export function getZurichToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Zurich",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function getZurichNowMinutes(now: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Zurich",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return hour * 60 + minute;
}

/**
 * Opening windows for a calendar date (Europe/Zurich).
 * Mo closed; Di–Fr lunch + dinner; Sa dinner; So lunch only.
 * Shared client-safe window rules (no server env).
 */
export function getOpenWindows(dateStr: string): OpenWindow[] {
  const day = zurichWeekday(dateStr);
  const lunchEnd = reservationsConfig.lastSeatingLunch;
  const dinnerEnd = reservationsConfig.lastSeatingDinner;

  if (day === 1) return []; // Monday
  if (day >= 2 && day <= 5) {
    return [
      { start: "11:00", end: lunchEnd },
      { start: "17:00", end: dinnerEnd },
    ];
  }
  if (day === 6) {
    return [{ start: "17:00", end: dinnerEnd }];
  }
  // Sunday
  return [{ start: "11:00", end: lunchEnd }];
}

export function formatHoursSnippet(windows: OpenWindow[]): string {
  if (windows.length === 0) return "Ruhetag";
  return windows.map((w) => `${w.start}–${w.end}`).join(" · ");
}

/**
 * Inclusive start and end: open at start minute through end minute inclusive.
 */
function isOpenAt(nowMins: number, windows: OpenWindow[]): OpenWindow | null {
  for (const w of windows) {
    const start = timeToMinutes(w.start);
    const end = timeToMinutes(w.end);
    if (nowMins >= start && nowMins <= end) return w;
  }
  return null;
}

function nextWindowStartToday(nowMins: number, windows: OpenWindow[]): number | null {
  let next: number | null = null;
  for (const w of windows) {
    const start = timeToMinutes(w.start);
    if (start > nowMins && (next === null || start < next)) next = start;
  }
  return next;
}

/**
 * Compute live opening badge status for Europe/Zurich.
 */
export function getOpeningStatus(now: Date = new Date()): OpeningStatus {
  const today = getZurichToday(now);
  const nowMins = getZurichNowMinutes(now);
  const windows = getOpenWindows(today);
  const hoursSnippet = formatHoursSnippet(windows);

  const current = isOpenAt(nowMins, windows);
  if (current) {
    const end = timeToMinutes(current.end);
    const minsToClose = end - nowMins;
    if (minsToClose <= CLOSING_SOON_MINUTES) {
      return { kind: "closing_soon", label: "Schliesst bald", hoursSnippet };
    }
    return { kind: "open", label: "Geöffnet", hoursSnippet };
  }

  const nextStart = nextWindowStartToday(nowMins, windows);
  if (nextStart !== null && nextStart - nowMins <= OPENING_SOON_MINUTES) {
    return { kind: "opening_soon", label: "Öffnet bald", hoursSnippet };
  }

  return { kind: "closed", label: "Geschlossen", hoursSnippet };
}
