"use client";

import { useState, useEffect, useRef } from "react";
import { DatePickerTime } from "../ui/date-picker-time";
import { createAppointment } from "@/app/(admin-protected)/admin/dashboard/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AppointmentFormModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [customerName, setCustomerName] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [service, setService] = useState("Basic Wash ($20)");
  const modalRef = useRef<HTMLDivElement>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [phone, setPhone] = useState("");

  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate) {
      alert("Please select a date and time");
      return;
    }
    if (!service) {
      alert("Please select service");
      return;
    }

    const payload = {
      customer_name: customerName || "unknown",
      appointment_date: selectedDate!.toISOString(),
      service,
      notes: notes || null,
    };

    const result = await createAppointment(payload);

    if (result.success) {
      // Show success message
      toast.success("Appointment created successfully");
      router.refresh();
      onClose();
    } else {
      // Show error message via toast (optional, since you already have setError)
      toast.error(result.error);
    }
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

          {/* Phone Number */}
          <div>
            <label className="mb-2 block text-xs font-medium tracking-wide text-gray-700 uppercase">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="inputx"
              placeholder="(123) 456-7890"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
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
              onCalendarOpenChange={setIsCalendarOpen}
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

          {/* Notes */}
          <div>
            <label className="mb-2 block text-xs font-medium tracking-wide text-gray-700 uppercase">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="inputx resize-vertical h-24"
              placeholder="Customer preferences, special instructions, vehicle details..."
              maxLength={500}
            />
            <p className="mt-1 text-xs text-gray-500">
              {notes.length}/500 characters
            </p>
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
