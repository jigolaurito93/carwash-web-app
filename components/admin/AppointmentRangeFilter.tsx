"use client";

import { cn } from "@/lib/utils";
import {
  APPOINTMENT_RANGES,
  type AppointmentRange,
} from "@/lib/appointment-range";

type Props = {
  value: AppointmentRange;
  onChange: (value: AppointmentRange) => void;
};

export default function AppointmentRangeFilter({ value, onChange }: Props) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filter appointments by date range"
    >
      {APPOINTMENT_RANGES.map((range) => {
        const selected = value === range.id;
        return (
          <button
            key={range.id}
            type="button"
            onClick={() => onChange(range.id)}
            aria-pressed={selected}
            className={cn(
              "rounded-full px-3 py-1.5 font-questrial text-xs font-bold tracking-wide transition-colors",
              selected
                ? "bg-black text-yellow-400"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900",
            )}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  );
}
