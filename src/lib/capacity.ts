import { prisma } from "./db";
import {
  generateSlotTimes,
  getMaxParties,
  getMaxSeats,
  isDateInPastZurich,
  isSlotInPast,
  type TimeSlot,
} from "./hours";

const ACTIVE = ["pending", "confirmed"] as const;

export async function getOccupancy(date: string, time: string) {
  const rows = await prisma.reservation.findMany({
    where: {
      date,
      time,
      status: { in: [...ACTIVE] },
    },
    select: { partySize: true },
  });
  const seats = rows.reduce((sum, r) => sum + r.partySize, 0);
  return { seats, parties: rows.length };
}

export async function getAvailableSlots(date: string): Promise<{
  date: string;
  closed: boolean;
  slots: TimeSlot[];
  message?: string;
}> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { date, closed: true, slots: [], message: "Ungültiges Datum." };
  }
  if (isDateInPastZurich(date)) {
    return { date, closed: true, slots: [], message: "Datum liegt in der Vergangenheit." };
  }

  const times = generateSlotTimes(date);
  if (times.length === 0) {
    return { date, closed: true, slots: [], message: "An diesem Tag ist das Restaurant geschlossen." };
  }

  const maxSeats = getMaxSeats();
  const maxParties = getMaxParties();

  const reservations = await prisma.reservation.findMany({
    where: { date, status: { in: [...ACTIVE] } },
    select: { time: true, partySize: true },
  });

  const byTime = new Map<string, { seats: number; parties: number }>();
  for (const r of reservations) {
    const cur = byTime.get(r.time) || { seats: 0, parties: 0 };
    cur.seats += r.partySize;
    cur.parties += 1;
    byTime.set(r.time, cur);
  }

  const slots: TimeSlot[] = times.map((time) => {
    if (isSlotInPast(date, time)) {
      return {
        time,
        available: false,
        remainingSeats: 0,
        remainingParties: 0,
        reason: "Vergangen",
      };
    }
    const occ = byTime.get(time) || { seats: 0, parties: 0 };
    const remainingSeats = Math.max(0, maxSeats - occ.seats);
    const remainingParties = Math.max(0, maxParties - occ.parties);
    const available = remainingSeats > 0 && remainingParties > 0;
    return {
      time,
      available,
      remainingSeats,
      remainingParties,
      reason: available ? undefined : "Ausgebucht",
    };
  });

  return { date, closed: false, slots };
}

export async function canBook(
  date: string,
  time: string,
  partySize: number,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (isDateInPastZurich(date)) {
    return { ok: false, error: "Datum liegt in der Vergangenheit." };
  }
  const times = generateSlotTimes(date);
  if (!times.includes(time)) {
    return { ok: false, error: "Ungültige Uhrzeit für diesen Tag (ausserhalb der Öffnungszeiten)." };
  }
  if (isSlotInPast(date, time)) {
    return { ok: false, error: "Dieser Zeitslot ist bereits vorbei." };
  }
  if (partySize < 1 || partySize > 12) {
    return { ok: false, error: "Personenzahl muss zwischen 1 und 12 liegen." };
  }

  const occ = await getOccupancy(date, time);
  const maxSeats = getMaxSeats();
  const maxParties = getMaxParties();

  if (occ.parties >= maxParties) {
    return { ok: false, error: "Dieser Zeitslot ist ausgebucht (max. Partien)." };
  }
  if (occ.seats + partySize > maxSeats) {
    return {
      ok: false,
      error: `Nicht genug Plätze. Noch ${Math.max(0, maxSeats - occ.seats)} von ${maxSeats} verfügbar.`,
    };
  }
  return { ok: true };
}
