import {
  addMonths,
  endOfDay,
  endOfMonth,
  endOfWeek,
  isSameDay,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export type AppointmentRange =
  | "today"
  | "week"
  | "month"
  | "threeMonths"
  | "all";

export const APPOINTMENT_RANGES: { id: AppointmentRange; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
  { id: "threeMonths", label: "Next 3 months" },
  { id: "all", label: "All" },
];

const WEEK_OPTIONS = { weekStartsOn: 0 as const };

export function appointmentInRange(
  appointmentDate: Date,
  now: Date,
  range: AppointmentRange,
  upcomingOnly = false,
): boolean {
  if (upcomingOnly && appointmentDate.getTime() < now.getTime()) {
    return false;
  }

  if (range === "all") return true;
  if (range === "today") return isSameDay(appointmentDate, now);

  if (range === "week") {
    return (
      appointmentDate >= startOfWeek(now, WEEK_OPTIONS) &&
      appointmentDate <= endOfWeek(now, WEEK_OPTIONS)
    );
  }

  if (range === "month") {
    return (
      appointmentDate >= startOfMonth(now) && appointmentDate <= endOfMonth(now)
    );
  }

  return (
    appointmentDate >= startOfDay(now) &&
    appointmentDate <= endOfDay(addMonths(now, 3))
  );
}

export function rangeEmptyMessage(range: AppointmentRange): string {
  switch (range) {
    case "today":
      return "No appointments today.";
    case "week":
      return "No appointments this week.";
    case "month":
      return "No appointments this month.";
    case "threeMonths":
      return "No appointments in the next 3 months.";
    default:
      return "No appointments found.";
  }
}
