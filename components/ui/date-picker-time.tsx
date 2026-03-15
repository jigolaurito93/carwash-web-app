"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";

// components/ui/date-picker-time.tsx
interface DatePickerTimeProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  onCalendarOpenChange: (open: boolean) => void;
}

export function DatePickerTime({
  date,
  onDateChange,
  onCalendarOpenChange,
}: DatePickerTimeProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <FieldGroup className="flex w-full flex-col gap-4 lg:flex-row">
      {/* Date */}
      <Field className="flex-1">
        <FieldLabel>Date</FieldLabel>
        <Popover
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
            onCalendarOpenChange(open); // ← Notify modal
          }}
        >
          <PopoverTrigger asChild>
            <Button variant="outline" className="inputx h-10">
              {date ? format(date, "PPP") : "Pick a date"}
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              className="border-0"
            />
          </PopoverContent>
        </Popover>
      </Field>

      {/* Time */}
      <Field className="w-full lg:w-48">
        <FieldLabel>Time</FieldLabel>
        <Input
          type="time"
          step="1800"
          value={date ? format(date, "HH:mm") : ""}
          onChange={(e) => {
            if (date) {
              const [h, m] = e.target.value.split(":").map(Number);
              const newDate = new Date(date);
              newDate.setHours(h, m);
              onDateChange(newDate);
            }
          }}
          className="h-12 border-2 border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400"
        />
      </Field>
    </FieldGroup>
  );
}
