"use client";

import { useState, useEffect, useRef } from "react";
import { DatePickerTime } from "../ui/date-picker-time";

export default function AppointmentFormModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [customerName, setCustomerName] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [service, setService] = useState("Basic Wash ($20)");
  const modalRef = useRef<HTMLDivElement>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // ← NEW

  // Close on outside click (EXCEPT calendar)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if calendar is open
      if (isCalendarOpen) return;

      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, isCalendarOpen]); // ← Add isCalendarOpen

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      customerName,
      dateTime: selectedDate,
      service,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        ref={modalRef}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="border-b border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-lexend text-2xl font-bold text-gray-900">
              New Appointment
            </h2>
            <button
              onClick={onClose}
              className="-m-2 rounded-full p-2 text-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            >
              ×
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Customer Name */}
          <div>
            <label className="mb-2 block text-xs font-medium tracking-wide text-gray-700 uppercase">
              Customer Name
            </label>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="inputx"
              placeholder="John Doe"
              required
            />
          </div>

          {/* Date Picker - PASS isCalendarOpen */}
          <div>
            <label className="mb-4 block text-xs font-medium tracking-wide text-gray-700 uppercase">
              Appointment Date & Time
            </label>
            <DatePickerTime
              date={selectedDate}
              onDateChange={setSelectedDate}
              isCalendarOpen={isCalendarOpen}
              onCalendarOpenChange={setIsCalendarOpen} // ← NEW PROP
            />
          </div>

          {/* Service */}
          <div>
            <label className="mb-2 block text-xs font-medium tracking-wide text-gray-700 uppercase">
              Service
            </label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="inputx"
              required
            >
              {[
                "Basic Wash ($20)",
                "Premium Wash ($35)",
                "Deluxe Wash ($50)",
              ].map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="btnSaveYlw flex-1 rounded-xl px-6 py-3 text-lg font-semibold"
            >
              Create Appointment
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-300 px-6 py-3 text-lg font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
