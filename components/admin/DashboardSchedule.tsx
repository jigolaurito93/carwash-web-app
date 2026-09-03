"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { addDays, format, isSameDay } from "date-fns";
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiImage,
  FiPlus,
  FiTool,
} from "react-icons/fi";
import type { Appointment, AppointmentServiceOption } from "@/lib/app.types";
import type { ShopHoursDay } from "@/lib/appointment-hours";
import {
  appointmentInRange,
  rangeEmptyMessage,
  type AppointmentRange,
} from "@/lib/appointment-range";
import AppointmentFormModal from "@/components/admin/AppointmentFormModal";
import AppointmentRangeFilter from "@/components/admin/AppointmentRangeFilter";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

type Props = {
  appointments: Appointment[];
  services: AppointmentServiceOption[];
  hours: ShopHoursDay[];
};

function customerLabel(appointment: Appointment) {
  return (
    [appointment.first_name, appointment.last_name]
      .map((part) => part?.trim())
      .filter((part): part is string => Boolean(part))
      .join(" ") ||
    appointment.customer_name ||
    "Unknown"
  );
}

function initials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function dayLabel(date: Date, now: Date) {
  if (isSameDay(date, now)) return "Today";
  if (isSameDay(date, addDays(now, 1))) return "Tomorrow";
  return format(date, "EEEE, MMM d");
}

function groupUpcoming(upcoming: Appointment[], now: Date) {
  const groups: { label: string; items: Appointment[] }[] = [];
  for (const appointment of upcoming) {
    const label = dayLabel(new Date(appointment.appointment_date), now);
    const last = groups[groups.length - 1];
    if (last?.label === label) {
      last.items.push(appointment);
    } else {
      groups.push({ label, items: [appointment] });
    }
  }
  return groups;
}

const upcomingCols =
  "md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.3fr)_5.5rem]";

function UpcomingAppointmentRow({ appointment }: { appointment: Appointment }) {
  const date = new Date(appointment.appointment_date);
  const name = customerLabel(appointment);

  return (
    <li
      className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-0.5 rounded-xl border border-gray-100 bg-gray-50 px-3 py-3 ${upcomingCols}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black font-lexend text-xs font-bold text-yellow-400">
          {initials(name)}
        </div>
        <p className="truncate font-lexend text-sm font-semibold text-gray-900">
          {name}
        </p>
      </div>
      <p className="col-start-2 row-start-1 text-right font-lexend text-sm font-bold text-gray-900 md:col-start-4">
        {format(date, "h:mm a")}
      </p>
      <p className="col-span-2 truncate pl-12 font-questrial text-sm text-gray-500 md:col-span-1 md:col-start-2 md:row-start-1 md:pl-0">
        {appointment.service}
      </p>
      <p
        className="col-span-2 truncate pl-12 font-questrial text-xs text-gray-400 md:col-span-1 md:col-start-3 md:row-start-1 md:pl-0 md:text-sm md:text-gray-500"
        title={appointment.notes ?? undefined}
      >
        {appointment.notes || "—"}
      </p>
    </li>
  );
}

export default function DashboardSchedule({
  appointments,
  services,
  hours,
}: Props) {
  const isClient = useIsClient();
  const now = isClient ? new Date() : null;
  const [modalOpen, setModalOpen] = useState(false);
  const [range, setRange] = useState<AppointmentRange>("week");

  const todayCount = now
    ? appointments.filter((appointment) =>
        isSameDay(new Date(appointment.appointment_date), now),
      ).length
    : 0;

  const upcoming = now
    ? appointments.filter((appointment) =>
        appointmentInRange(
          new Date(appointment.appointment_date),
          now,
          range,
          true,
        ),
      )
    : [];

  const groups = now ? groupUpcoming(upcoming, now) : [];
  const nextUp = upcoming[0];

  return (
    <>
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <article className="relative overflow-hidden rounded-2xl bg-black p-6 text-white">
          <FiCalendar
            className="pointer-events-none absolute -right-3 -bottom-3 h-28 w-28 text-yellow-400/10"
            aria-hidden="true"
          />
          <div className="flex items-center gap-2 font-questrial text-xs font-bold tracking-widest text-gray-400 uppercase">
            <FiCalendar className="h-4 w-4 text-yellow-400" />
            Today&apos;s appointments
          </div>
          <p className="mt-4 font-lexend text-5xl font-bold text-yellow-400">
            {todayCount}
          </p>
          <p className="mt-2 font-questrial text-sm text-gray-400">
            {todayCount === 1
              ? "booking on the board"
              : "bookings on the board"}
          </p>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="font-questrial text-xs font-bold tracking-widest text-gray-400 uppercase">
              Completed washes
            </p>
            <FiCheckCircle
              className="h-5 w-5 text-gray-300"
              aria-hidden="true"
            />
          </div>
          <p className="mt-4 font-lexend text-5xl font-bold text-gray-900">0</p>
          <p className="mt-2 font-questrial text-sm text-gray-400">
            Coming soon
          </p>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="font-questrial text-xs font-bold tracking-widest text-gray-400 uppercase">
              Open slots left
            </p>
            <FiClock className="h-5 w-5 text-gray-300" aria-hidden="true" />
          </div>
          <p className="mt-4 font-lexend text-5xl font-bold text-gray-900">0</p>
          <p className="mt-2 font-questrial text-sm text-gray-400">
            Coming soon
          </p>
        </article>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,1fr)]">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-lexend text-lg font-semibold text-gray-900">
                Upcoming appointments
              </h2>
              {nextUp && now ? (
                <p className="mt-1 font-questrial text-sm text-gray-500">
                  Next up at{" "}
                  <span className="font-bold text-gray-800">
                    {format(new Date(nextUp.appointment_date), "h:mm a")}
                  </span>
                </p>
              ) : null}
            </div>
            <Link
              href="/admin/appointment"
              className="inline-flex items-center gap-1 font-questrial text-xs font-bold tracking-wider text-gray-500 uppercase hover:text-black"
            >
              View all
              <FiArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mb-5">
            <AppointmentRangeFilter value={range} onChange={setRange} />
          </div>

          {upcoming.length === 0 ? (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400">
                <FiCalendar className="h-5 w-5 text-black" />
              </div>
              <p className="font-lexend font-semibold text-gray-900">
                {rangeEmptyMessage(range)}
              </p>
              <p className="mt-1 max-w-xs font-questrial text-sm text-gray-500">
                Create a booking from a phone call and it will show up here.
              </p>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="btnSaveYlw mt-5 inline-flex items-center gap-2"
              >
                <FiPlus className="h-4 w-4" />
                Create appointment
              </button>
            </div>
          ) : (
            <div className="max-h-[32rem] overflow-y-auto pr-1">
              <div
                className={`sticky top-0 z-10 mb-2 hidden gap-x-4 bg-white px-3 py-2 font-questrial text-[11px] font-bold tracking-widest text-gray-400 uppercase md:grid ${upcomingCols}`}
              >
                <p>Name</p>
                <p>Service</p>
                <p>Additional info</p>
                <p className="text-right">Time</p>
              </div>
              <div className="space-y-6">
                {groups.map((group) => (
                  <div key={group.label}>
                    <p className="mb-2 font-questrial text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                      {group.label}
                    </p>
                    <ul className="space-y-2">
                      {group.items.map((appointment) => (
                        <UpcomingAppointmentRow
                          key={appointment.id}
                          appointment={appointment}
                        />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-lexend text-lg font-semibold text-gray-900">
            Quick actions
          </h2>
          <p className="mt-1 font-questrial text-sm text-gray-500">
            Book a walk-in call or jump to catalog work.
          </p>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="btnSaveYlw mt-5 flex w-full items-center justify-center gap-2"
          >
            <FiPlus className="h-4 w-4" />
            Create appointment
          </button>

          <div className="mt-3 space-y-2">
            <Link
              href="/admin/services"
              className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 font-questrial text-sm font-medium text-gray-700 transition-colors hover:border-yellow-400 hover:bg-yellow-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-yellow-400">
                <FiTool className="h-4 w-4" />
              </span>
              <span className="flex-1">Manage services</span>
              <FiArrowRight className="h-4 w-4 text-gray-400" />
            </Link>
            <Link
              href="/admin/gallery"
              className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 font-questrial text-sm font-medium text-gray-700 transition-colors hover:border-yellow-400 hover:bg-yellow-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-yellow-400">
                <FiImage className="h-4 w-4" />
              </span>
              <span className="flex-1">Manage gallery</span>
              <FiArrowRight className="h-4 w-4 text-gray-400" />
            </Link>
            <Link
              href="/admin/appointment"
              className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 font-questrial text-sm font-medium text-gray-700 transition-colors hover:border-yellow-400 hover:bg-yellow-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-yellow-400">
                <FiCalendar className="h-4 w-4" />
              </span>
              <span className="flex-1">All appointments</span>
              <FiArrowRight className="h-4 w-4 text-gray-400" />
            </Link>
          </div>
        </div>
      </section>

      <AppointmentFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode="create"
        appointment={null}
        services={services}
        hours={hours}
      />
    </>
  );
}
