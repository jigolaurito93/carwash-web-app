"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAppointment } from "@/app/(admin-protected)/admin/dashboard/actions";
import { FiPlusCircle } from "react-icons/fi";
import AppointmentFormModal from "./AppointmentFormModal";
import { toast } from "sonner";

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
  const router = useRouter();

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

  const handleDeleteClick = (apt: Appointment) => {
    toast.custom(
      (t) => (
        <div className="w-87.5 rounded-xl bg-black p-6 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            {/* Warning Icon */}
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-black">
              <span className="text-xl font-bold">!</span>
            </div>

            <h3 className="font-lexend text-lg font-bold text-white uppercase">
              Confirm Deletion
            </h3>
            <p className="mt-2 font-questrial text-sm text-gray-400">
              Are you sure you want to remove{" "}
              <span className="text-yellow-400">
                "{apt.customer_name}'s appointment"
              </span>
              ? This cannot be undone.
            </p>

            <div className="mt-6 flex w-full gap-3">
              <button
                onClick={() => toast.dismiss(t)}
                className="flex-1 cursor-pointer rounded-md border border-zinc-700 bg-white py-2 font-questrial text-xs font-bold tracking-wider text-black transition-colors hover:bg-zinc-200"
              >
                CANCEL
              </button>
              <button
                onClick={async () => {
                  toast.dismiss(t);
                  const result = await deleteAppointment(apt.id);
                  if (result.success) {
                    toast.success("Appointment deleted.");
                    router.refresh();
                  } else {
                    toast.error("Error: " + result.error);
                  }
                }}
                className="flex-1 cursor-pointer rounded-md bg-red-600 py-2 font-questrial text-xs font-bold tracking-wider text-white transition-all hover:bg-red-500 active:scale-95"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
  };

  return (
    <div className="mt-12 font-questrial">
      {/* Header with Create Button - matching OtherServicesTable */}
      <div className="mb-6 flex items-center justify-end">
        <button
          onClick={handleCreate}
          className="flex cursor-pointer items-center justify-center gap-2 rounded bg-black px-4 py-2 font-questrial text-sm font-bold text-white transition-all hover:bg-zinc-800"
        >
          <FiPlusCircle className="h-4 w-4" />
          Add Appointment
        </button>
      </div>

      {/* Table - matching OtherServicesTable styling */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-gray-50 font-questrial">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-700">
                Customer
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700">Contact</th>
              <th className="px-4 py-3 font-semibold text-gray-700">
                Date & Time
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700">Service</th>
              <th className="px-4 py-3 font-semibold text-gray-500">Notes</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No appointments found.
                </td>
              </tr>
            ) : (
              appointments.map((apt) => {
                const date = new Date(apt.appointment_date);
                const timeString = date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const truncatedNotes = apt.notes
                  ? apt.notes.length > 40
                    ? apt.notes.slice(0, 40) + "..."
                    : apt.notes
                  : "—";

                return (
                  <tr
                    key={apt.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {apt.customer_name}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {apt.phone_number || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {date.toLocaleDateString()} {timeString}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700">
                      {apt.service}
                    </td>
                    <td className="max-w-xs px-4 py-3 text-gray-500">
                      {truncatedNotes}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          apt.status === "scheduled"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {apt.status === "scheduled" ? "Active" : "Cancelled"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-questrial tracking-wider">
                      <div className="ml-auto flex w-20 flex-col items-stretch gap-2">
                        <button
                          onClick={() => handleEdit(apt)}
                          className="cursor-pointer rounded border border-gray-200 bg-white px-2 py-1 text-xs font-bold transition-all hover:bg-yellow-400"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(apt)} // ← Changed from handleDelete
                          className="cursor-pointer rounded border border-red-100 bg-red-50 px-2 py-1 text-xs font-bold text-red-600 transition-all hover:bg-red-600 hover:text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
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
