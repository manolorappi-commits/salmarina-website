import reservationsConfig from "../../content/reservations.json";

export type TimeSlot = {
  time: string;
  available: boolean;
  remainingSeats: number;
  remainingParties: number;
  reason?: string;
};

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
  // noon UTC avoids DST edge cases for calendar date
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

export function isDateInPastZurich(dateStr: string): boolean {
  const now = new Date();
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Zurich",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return dateStr < today;
}

export function getZurichNowMinutes(): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Zurich",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return hour * 60 + minute;
}

export function getZurichToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Zurich",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * Opening windows for a calendar date (Europe/Zurich).
 * Mo closed; Di–Fr lunch + dinner; Sa dinner; So lunch only.
 */
export function getOpenWindows(dateStr: string): Array<{ start: string; end: string }> {
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

export function getSlotInterval(): number {
  const fromEnv = Number(process.env.SLOT_INTERVAL_MINUTES);
  if (fromEnv === 15 || fromEnv === 30) return fromEnv;
  return reservationsConfig.slotIntervalMinutes === 15 ? 15 : 30;
}

export function getMaxSeats(): number {
  const fromEnv = Number(process.env.MAX_SEATS_PER_SLOT);
  if (Number.isFinite(fromEnv) && fromEnv > 0) return fromEnv;
  return reservationsConfig.maxSeatsPerSlot;
}

export function getMaxParties(): number {
  const fromEnv = Number(process.env.MAX_PARTIES_PER_SLOT);
  if (Number.isFinite(fromEnv) && fromEnv > 0) return fromEnv;
  return reservationsConfig.maxPartiesPerSlot;
}

export function isAutoConfirm(): boolean {
  if (process.env.RESERVATION_AUTO_CONFIRM === "true") return true;
  if (process.env.RESERVATION_AUTO_CONFIRM === "false") return false;
  return Boolean(reservationsConfig.autoConfirm);
}

/** Generate candidate slot times for a date (before capacity checks). */
export function generateSlotTimes(dateStr: string): string[] {
  const windows = getOpenWindows(dateStr);
  const interval = getSlotInterval();
  const slots: string[] = [];

  for (const w of windows) {
    let t = timeToMinutes(w.start);
    const end = timeToMinutes(w.end);
    while (t <= end) {
      slots.push(minutesToTime(t));
      t += interval;
    }
  }
  return slots;
}

export function isValidSlotTime(dateStr: string, time: string): boolean {
  return generateSlotTimes(dateStr).includes(time);
}

export function isSlotInPast(dateStr: string, time: string): boolean {
  const today = getZurichToday();
  if (dateStr > today) return false;
  if (dateStr < today) return true;
  return timeToMinutes(time) <= getZurichNowMinutes();
}
