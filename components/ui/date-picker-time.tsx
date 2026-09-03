"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, startOfDay } from "date-fns";
import { FiCalendar } from "react-icons/fi";
import {
  bookableHours,
  bookableMinutesForHour,
  earliestBookableMinutes,
  formatHourLabel,
  getDaySlot,
  isShopDateDisabled,
  shopHoursCaption,
  snapToShopTimeSlot,
  type ShopHoursDay,
} from "@/lib/appointment-hours";

interface DatePickerTimeProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  onCalendarOpenChange: (open: boolean) => void;
  hours: ShopHoursDay[];
}

export function DatePickerTime({
  date,
  onDateChange,
  onCalendarOpenChange,
  hours,
}: DatePickerTimeProps) {
  const [open, setOpen] = React.useState(false);
  const slot = date ? getDaySlot(hours, date) : null;
  const timeDisabled = !date || !slot || slot.closed;
  const minMinutes =
    date && slot && !slot.closed ? earliestBookableMinutes(slot, date) : null;
  const hourChoices =
    slot && !slot.closed && minMinutes !== null
      ? bookableHours(slot, minMinutes)
      : [];
  const selectedHour = date && !timeDisabled ? date.getHours() : null;
  const minuteChoices =
    slot && !slot.closed && minMinutes !== null && selectedHour !== null
      ? bookableMinutesForHour(slot, minMinutes, selectedHour)
      : [];

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="labelx block text-xs">Date</label>
          <Popover
            open={open}
            onOpenChange={(nextOpen) => {
              setOpen(nextOpen);
              onCalendarOpenChange(nextOpen);
            }}
          >
            <PopoverTrigger asChild>
              <button
                type="button"
                className="inputx flex h-12 w-full items-center justify-between text-left text-sm"
              >
                <span className={date ? "text-gray-900" : "text-gray-400"}>
                  {date ? format(date, "EEE, MMM d") : "Pick a date"}
                </span>
                <FiCalendar className="h-4 w-4 shrink-0 text-gray-400" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="z-[70] w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selected) => {
                  if (!selected) {
                    onDateChange(undefined);
                    return;
                  }
                  if (isShopDateDisabled(hours, selected)) return;
                  const next = new Date(selected);
                  if (date) {
                    next.setHours(date.getHours(), date.getMinutes(), 0, 0);
                  } else {
                    const now = new Date();
                    next.setHours(now.getHours(), now.getMinutes(), 0, 0);
                  }
                  onDateChange(snapToShopTimeSlot(next, hours));
                }}
                disabled={[
                  { before: startOfDay(new Date()) },
                  (day) => isShopDateDisabled(hours, day),
                ]}
                className="border-0"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="labelx block text-xs">Time</label>
          <div className="grid grid-cols-2 gap-2">
            <select
              aria-label="Hour"
              disabled={timeDisabled}
              value={selectedHour === null ? "" : String(selectedHour)}
              onChange={(event) => {
                if (!date || !event.target.value) return;
                const hour = Number(event.target.value);
                const minutes =
                  slot && !slot.closed && minMinutes !== null
                    ? bookableMinutesForHour(slot, minMinutes, hour)
                    : [];
                const currentMinute = date.getMinutes();
                const minute = minutes.includes(currentMinute)
                  ? currentMinute
                  : (minutes[0] ?? 0);
                const next = new Date(date);
                next.setHours(hour, minute, 0, 0);
                onDateChange(snapToShopTimeSlot(next, hours));
              }}
              className="inputx h-12 text-sm disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60"
            >
              <option value="" disabled>
                Hour
              </option>
              {hourChoices.map((hour) => (
                <option key={hour} value={hour}>
                  {formatHourLabel(hour)}
                </option>
              ))}
            </select>
            <select
              aria-label="Minutes"
              disabled={timeDisabled || minuteChoices.length === 0}
              value={date && !timeDisabled ? String(date.getMinutes()) : ""}
              onChange={(event) => {
                if (!date || event.target.value === "") return;
                const next = new Date(date);
                next.setMinutes(Number(event.target.value), 0, 0);
                onDateChange(snapToShopTimeSlot(next, hours));
              }}
              className="inputx h-12 text-sm disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60"
            >
              <option value="" disabled>
                Min
              </option>
              {minuteChoices.map((minute) => (
                <option key={minute} value={minute}>
                  :{String(minute).padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <p className="rounded-lg bg-gray-50 px-3 py-2 font-questrial text-xs text-gray-500">
        {shopHoursCaption(hours, date)}
      </p>
    </div>
  );
}
