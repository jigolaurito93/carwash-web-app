"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  FiCalendar,
  FiMail,
  FiMessageSquare,
  FiPhone,
  FiTool,
  FiUser,
  FiX,
} from "react-icons/fi";
import { DatePickerTime } from "@/components/ui/date-picker-time";
import type { Appointment, AppointmentServiceOption } from "@/lib/app.types";
import {
  isShopDateDisabled,
  validateAppointmentSlot,
  type ShopHoursDay,
} from "@/lib/appointment-hours";
import {
  createAppointment,
  updateAppointment,
} from "@/app/(admin-protected)/admin/appointment/actions";

type Props = {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  appointment: Appointment | null;
  services: AppointmentServiceOption[];
  hours: ShopHoursDay[];
};

type FormState = {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  service_id: string;
  notes: string;
};

const emptyForm: FormState = {
  first_name: "",
  last_name: "",
  phone_number: "",
  email: "",
  service_id: "",
  notes: "",
};

function toTitleCase(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\w\S*/g, (word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
}

function groupedServices(services: AppointmentServiceOption[]) {
  const groups = new Map<string, AppointmentServiceOption[]>();
  for (const service of services) {
    const label = service.categories?.name?.trim() || "Other";
    const list = groups.get(label) ?? [];
    list.push(service);
    groups.set(label, list);
  }
  return [...groups.entries()];
}

export default function AppointmentFormModal({
  open,
  onClose,
  mode,
  appointment,
  services,
  hours,
}: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [saving, setSaving] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const dropdownServices = useMemo(() => {
    const byId = new Map<number, AppointmentServiceOption>();
    for (const service of services) {
      if (service.is_active !== false) {
        byId.set(service.id, service);
      }
    }
    if (appointment?.service_id) {
      const current = services.find(
        (service) => service.id === appointment.service_id,
      );
      if (current) {
        byId.set(current.id, current);
      }
    }
    return [...byId.values()];
  }, [services, appointment]);

  const serviceGroups = groupedServices(dropdownServices);

  useEffect(() => {
    if (!open) {
      setForm(emptyForm);
      setSelectedDate(undefined);
      setIsCalendarOpen(false);
      setSaving(false);
      return;
    }

    if (mode === "edit" && appointment) {
      setForm({
        first_name: appointment.first_name,
        last_name: appointment.last_name ?? "",
        phone_number: appointment.phone_number ?? "",
        email: appointment.email ?? "",
        service_id: appointment.service_id
          ? String(appointment.service_id)
          : "",
        notes: appointment.notes ?? "",
      });
      const date = new Date(appointment.appointment_date);
      setSelectedDate(Number.isNaN(date.getTime()) ? undefined : date);
      return;
    }

    setForm(emptyForm);
    setSelectedDate(undefined);
  }, [open, mode, appointment]);

  if (!open) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedDate) {
      toast.error("Please select a date and time");
      return;
    }
    if (isShopDateDisabled(hours, selectedDate)) {
      toast.error("Please choose an open day that is today or in the future.");
      return;
    }

    const localDate = format(selectedDate, "yyyy-MM-dd");
    const localTime = format(selectedDate, "HH:mm");
    const slotError = validateAppointmentSlot(
      hours,
      localDate,
      localTime,
      selectedDate.toISOString(),
    );
    if (slotError) {
      toast.error(slotError);
      return;
    }

    setSaving(true);
    const formData = new FormData();
    if (mode === "edit" && appointment) {
      formData.set("id", String(appointment.id));
    }
    formData.set("first_name", form.first_name);
    formData.set("last_name", form.last_name);
    formData.set("phone_number", form.phone_number);
    formData.set("email", form.email);
    formData.set("service_id", form.service_id);
    formData.set("notes", form.notes);
    formData.set("appointment_date", selectedDate.toISOString());
    formData.set("local_date", localDate);
    formData.set("local_time", localTime);

    try {
      const result =
        mode === "create"
          ? await createAppointment(formData)
          : await updateAppointment(formData);

      if (result.success) {
        toast.success(
          mode === "create" ? "Appointment created." : "Appointment updated.",
        );
        onClose();
        router.refresh();
      } else {
        toast.error(result.error || "Failed to save appointment.");
      }
    } catch {
      toast.error("Failed to save appointment.");
    } finally {
      setSaving(false);
    }
  };

  const close = () => {
    if (saving || isCalendarOpen) return;
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 bg-black px-6 py-5 text-white">
          <div>
            <p className="font-questrial text-[11px] font-bold tracking-widest text-yellow-400 uppercase">
              {mode === "create" ? "New booking" : "Edit booking"}
            </p>
            <h2 className="mt-1 font-lexend text-2xl font-bold">
              {mode === "create" ? "Create appointment" : "Edit appointment"}
            </h2>
            <p className="mt-1 font-questrial text-sm text-gray-400">
              First name, phone, optional email and notes, service, and a time
              during shop hours.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
            aria-label="Close"
          >
            <FiX className="h-5 w-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="space-y-6 overflow-y-auto px-6 py-6">
            <section>
              <p className="mb-3 flex items-center gap-2 font-questrial text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                <FiUser className="h-3.5 w-3.5" />
                Customer
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label
                    className="labelx block text-xs"
                    htmlFor="apt-first-name"
                  >
                    First name
                  </label>
                  <input
                    id="apt-first-name"
                    required
                    maxLength={80}
                    value={form.first_name}
                    onChange={(event) =>
                      setForm({ ...form, first_name: event.target.value })
                    }
                    className="inputx h-12 text-sm"
                    placeholder="Jordan"
                    disabled={saving}
                  />
                </div>
                <div>
                  <label
                    className="labelx block text-xs"
                    htmlFor="apt-last-name"
                  >
                    Last name
                  </label>
                  <input
                    id="apt-last-name"
                    maxLength={80}
                    value={form.last_name}
                    onChange={(event) =>
                      setForm({ ...form, last_name: event.target.value })
                    }
                    className="inputx h-12 text-sm"
                    placeholder="Optional"
                    disabled={saving}
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="labelx block text-xs" htmlFor="apt-phone">
                  Contact number
                </label>
                <div
                  className={`flex h-12 items-center overflow-hidden rounded-sm border border-gray-200 shadow-sm focus-within:border-gray-400 ${
                    saving ? "bg-gray-100 opacity-60" : "bg-white"
                  }`}
                >
                  <span className="flex h-full shrink-0 items-center px-3 text-gray-400">
                    <FiPhone className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <input
                    id="apt-phone"
                    type="tel"
                    required
                    value={form.phone_number}
                    onChange={(event) =>
                      setForm({ ...form, phone_number: event.target.value })
                    }
                    className="h-full min-w-0 flex-1 border-0 bg-transparent py-3 pr-3 text-sm outline-none"
                    placeholder="(123) 456-7890"
                    disabled={saving}
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="labelx block text-xs" htmlFor="apt-email">
                  Email
                </label>
                <div
                  className={`flex h-12 items-center overflow-hidden rounded-sm border border-gray-200 shadow-sm focus-within:border-gray-400 ${
                    saving ? "bg-gray-100 opacity-60" : "bg-white"
                  }`}
                >
                  <span className="flex h-full shrink-0 items-center px-3 text-gray-400">
                    <FiMail className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <input
                    id="apt-email"
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      setForm({ ...form, email: event.target.value })
                    }
                    className="h-full min-w-0 flex-1 border-0 bg-transparent py-3 pr-3 text-sm outline-none"
                    placeholder="Optional"
                    disabled={saving}
                  />
                </div>
              </div>
            </section>

            <section>
              <p className="mb-3 flex items-center gap-2 font-questrial text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                <FiCalendar className="h-3.5 w-3.5" />
                Date & time
              </p>
              <DatePickerTime
                date={selectedDate}
                onDateChange={setSelectedDate}
                onCalendarOpenChange={setIsCalendarOpen}
                hours={hours}
              />
            </section>

            <section>
              <p className="mb-3 flex items-center gap-2 font-questrial text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                <FiTool className="h-3.5 w-3.5" />
                Service
              </p>
              <label className="sr-only" htmlFor="apt-service">
                Service
              </label>
              <select
                id="apt-service"
                required
                value={form.service_id}
                onChange={(event) =>
                  setForm({ ...form, service_id: event.target.value })
                }
                className="inputx h-12 text-sm"
                disabled={saving}
              >
                <option value="">Select a service</option>
                {serviceGroups.map(([category, items]) => (
                  <optgroup key={category} label={toTitleCase(category)}>
                    {items.map((service) => (
                      <option key={service.id} value={service.id}>
                        {toTitleCase(service.name)}
                        {service.is_active === false ? " (inactive)" : ""}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </section>

            <section>
              <p className="mb-3 flex items-center gap-2 font-questrial text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                <FiMessageSquare className="h-3.5 w-3.5" />
                Additional info
              </p>
              <label className="sr-only" htmlFor="apt-notes">
                Additional info
              </label>
              <textarea
                id="apt-notes"
                value={form.notes}
                onChange={(event) =>
                  setForm({ ...form, notes: event.target.value })
                }
                className="inputx min-h-24 resize-y text-sm"
                placeholder="Vehicle details, special requests, or anything else from the call…"
                maxLength={500}
                disabled={saving}
              />
              <p className="mt-1 font-questrial text-xs text-gray-400">
                Optional · {form.notes.length}/500
              </p>
            </section>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="btnCancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btnSaveYlw disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : mode === "create"
                  ? "Create appointment"
                  : "Save appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
