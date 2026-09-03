import { format, isSameDay, startOfDay } from "date-fns";

export type ShopHoursDay = {
  day_name: string;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean | null;
};

export type DaySlot =
  | { closed: true; dayName: string }
  | {
      closed: false;
      dayName: string;
      openMinutes: number;
      closeMinutes: number;
      openTime: string;
      closeTime: string;
    };

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export function parseMinutes(value: string | null | undefined): number | null {
  if (!value) return null;
  const match = value.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

export function minutesToTimeInput(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export const APPOINTMENT_TIME_STEP = 30;

export function formatHourLabel(hour24: number): string {
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12} ${period}`;
}

export function earliestBookableMinutes(
  slot: Extract<DaySlot, { closed: false }>,
  date: Date,
  now = new Date(),
  step = APPOINTMENT_TIME_STEP,
): number {
  let minMinutes = slot.openMinutes;
  if (isSameDay(date, now)) {
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    if (nowMinutes > minMinutes) minMinutes = nowMinutes;
  }
  return Math.ceil(minMinutes / step) * step;
}

export function bookableMinutesForHour(
  slot: Extract<DaySlot, { closed: false }>,
  minMinutes: number,
  hour: number,
  step = APPOINTMENT_TIME_STEP,
): number[] {
  const minutes: number[] = [];
  for (let minute = 0; minute < 60; minute += step) {
    const total = hour * 60 + minute;
    if (total >= minMinutes && total <= slot.closeMinutes) {
      minutes.push(minute);
    }
  }
  return minutes;
}

export function bookableHours(
  slot: Extract<DaySlot, { closed: false }>,
  minMinutes: number,
  step = APPOINTMENT_TIME_STEP,
): number[] {
  const hours: number[] = [];
  const startHour = Math.floor(minMinutes / 60);
  const endHour = Math.floor(slot.closeMinutes / 60);
  for (let hour = startHour; hour <= endHour; hour += 1) {
    if (bookableMinutesForHour(slot, minMinutes, hour, step).length > 0) {
      hours.push(hour);
    }
  }
  return hours;
}

export function snapToShopTimeSlot(
  date: Date,
  hours: ShopHoursDay[],
  now = new Date(),
  step = APPOINTMENT_TIME_STEP,
): Date {
  const slot = getDaySlot(hours, date);
  if (slot.closed) return date;

  const minMinutes = earliestBookableMinutes(slot, date, now, step);
  const lastSlot = Math.floor(slot.closeMinutes / step) * step;
  let minutes = date.getHours() * 60 + date.getMinutes();
  minutes = Math.ceil(minutes / step) * step;
  if (minutes < minMinutes) minutes = minMinutes;
  if (minutes > slot.closeMinutes) minutes = lastSlot;

  const next = new Date(date);
  next.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return next;
}

function formatClock(minutes: number): string {
  const hours24 = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${String(mins).padStart(2, "0")} ${period}`;
}

export function weekdayName(date: Date): string {
  return format(date, "EEEE");
}

export function weekdayFromYmd(ymd: string): string | null {
  const match = ymd.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const date = new Date(
    Date.UTC(
      Number(match[1]),
      Number(match[2]) - 1,
      Number(match[3]),
      12,
      0,
      0,
    ),
  );
  return WEEKDAYS[date.getUTCDay()];
}

function findHoursRow(hours: ShopHoursDay[], dayName: string) {
  return hours.find(
    (hour) => hour.day_name.trim().toLowerCase() === dayName.toLowerCase(),
  );
}

export function getDaySlot(hours: ShopHoursDay[], date: Date): DaySlot {
  const dayName = weekdayName(date);
  return slotFromRow(findHoursRow(hours, dayName), dayName);
}

function slotFromRow(row: ShopHoursDay | undefined, dayName: string): DaySlot {
  if (!row || row.is_closed) {
    return { closed: true, dayName };
  }
  const openMinutes = parseMinutes(row.open_time);
  const closeMinutes = parseMinutes(row.close_time);
  if (
    openMinutes === null ||
    closeMinutes === null ||
    closeMinutes < openMinutes
  ) {
    return { closed: true, dayName };
  }
  return {
    closed: false,
    dayName,
    openMinutes,
    closeMinutes,
    openTime: minutesToTimeInput(openMinutes),
    closeTime: minutesToTimeInput(closeMinutes),
  };
}

export function isShopDateDisabled(
  hours: ShopHoursDay[],
  date: Date,
  now = new Date(),
): boolean {
  if (startOfDay(date).getTime() < startOfDay(now).getTime()) return true;
  const slot = getDaySlot(hours, date);
  if (slot.closed) return true;
  if (isSameDay(date, now)) {
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    if (nowMinutes > slot.closeMinutes) return true;
  }
  return false;
}

export function clampDateToShopHours(
  date: Date,
  hours: ShopHoursDay[],
  now = new Date(),
): Date {
  const slot = getDaySlot(hours, date);
  if (slot.closed) return date;

  let minutes = date.getHours() * 60 + date.getMinutes();
  let minMinutes = slot.openMinutes;
  if (isSameDay(date, now)) {
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    if (nowMinutes > minMinutes) minMinutes = nowMinutes;
  }
  if (minutes < minMinutes) minutes = minMinutes;
  if (minutes > slot.closeMinutes) minutes = slot.closeMinutes;

  const next = new Date(date);
  next.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return next;
}

export function shopHoursCaption(
  hours: ShopHoursDay[],
  date: Date | undefined,
): string {
  if (hours.length === 0) {
    return "Set shop hours before booking an appointment.";
  }
  if (!date) {
    return "Closed days and past dates cannot be booked.";
  }
  const slot = getDaySlot(hours, date);
  if (slot.closed) {
    return `The shop is closed on ${slot.dayName}s.`;
  }
  return `${slot.dayName} hours: ${formatClock(slot.openMinutes)} – ${formatClock(slot.closeMinutes)}`;
}

export function validateAppointmentSlot(
  hours: ShopHoursDay[],
  localDate: string,
  localTime: string,
  isoTimestamp: string,
): string | null {
  const parsedIso = Date.parse(isoTimestamp);
  if (Number.isNaN(parsedIso)) {
    return "Please select a valid date and time.";
  }
  if (parsedIso < Date.now() - 60_000) {
    return "Please choose today or a future date and time.";
  }

  const dayName = weekdayFromYmd(localDate);
  const timeMinutes = parseMinutes(localTime);
  if (!dayName || timeMinutes === null) {
    return "Please select a date and time.";
  }

  const slot = slotFromRow(findHoursRow(hours, dayName), dayName);
  if (slot.closed) {
    return `The shop is closed on ${dayName}s.`;
  }
  if (timeMinutes < slot.openMinutes || timeMinutes > slot.closeMinutes) {
    return `Choose a time between ${formatClock(slot.openMinutes)} and ${formatClock(slot.closeMinutes)}.`;
  }

  return null;
}
