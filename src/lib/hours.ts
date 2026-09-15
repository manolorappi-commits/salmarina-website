import reservationsConfig from "../../content/reservations.json";
import {
  getOpenWindows,
  getZurichNowMinutes,
  getZurichToday,
  minutesToTime,
  timeToMinutes,
} from "./opening-status";

export type TimeSlot = {
  time: string;
  available: boolean;
  remainingSeats: number;
  remainingParties: number;
  reason?: string;
};

export {
  getOpenWindows,
  getZurichNowMinutes,
  getZurichToday,
  minutesToTime,
  timeToMinutes,
  zurichWeekday,
} from "./opening-status";

export function isDateInPastZurich(dateStr: string): boolean {
  return dateStr < getZurichToday();
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
