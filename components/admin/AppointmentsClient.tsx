// app/admin/appointments/AppointmentsClient.tsx
"use client";

import { useState } from "react";
import { deleteAppointment } from "@/app/(admin-protected)/admin/dashboard/actions";
import AppointmentFormModal from "./AppointmentFormModal";

type Appointment = {
  id: string;
  customer_name: string;
  phone_number: string | null;
  appointment_date: string;
  service: string;
  notes: string | null;
  status: string;
};

export default function AppointmentsClient({
  appointments,
}: {
  appointments: Appointment[];
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<Appointment | null>(null);

  const handleCreate = () => {
    setMode("create");
    setSelected(null);
    setOpen(true);
  };

  const handleEdit = (apt: Appointment) => {
    setMode("edit");
    setSelected(apt);
    setOpen(true);
  };

  const handleDelete = async (apt: Appointment) => {
    if (!confirm(`Delete appointment for ${apt.customer_name}?`)) return;

    const result = await deleteAppointment(apt.id);
    if (result.success) {
      setOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Button - Right aligned */}
      <div className="flex justify-end">
        <button
          onClick={handleCreate}
          className="btnSaveYlw h-12 rounded-xl px-8 py-3 text-sm font-semibold shadow-lg transition-all hover:shadow-xl"
        >
          + Create Appointment
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-black text-yellow-400">
              <th className="px-6 py-4 text-left text-xs font-bold tracking-wider uppercase">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold tracking-wider uppercase">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold tracking-wider uppercase">
                Date & Time
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold tracking-wider uppercase">
                Service
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold tracking-wider uppercase">
                Notes
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold tracking-wider uppercase">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold tracking-wider uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {appointments.map((apt) => {
              const date = new Date(apt.appointment_date);
              const timeString = date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              const truncatedNotes = apt.notes
                ? apt.notes.length > 40
                  ? apt.notes.slice(0, 40) + "..."
                  : apt.notes
                : "-";

              return (
                <tr key={apt.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">
                      {apt.customer_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {apt.phone_number || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {date.toLocaleDateString()} {timeString}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                      {apt.service}
                    </span>
                  </td>
                  <td className="max-w-xs px-6 py-4 text-sm text-gray-600">
                    {truncatedNotes}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        apt.status === "scheduled"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {apt.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(apt)}
                        className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 transition-all hover:bg-blue-100 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(apt)}
                        className="rounded-lg bg-red-50 px-3 py-1 text-sm font-medium text-red-600 transition-all hover:bg-red-100 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AppointmentFormModal
        open={open}
        onClose={() => setOpen(false)}
        mode={mode}
        appointment={selected}
      />
    </div>
  );
}
