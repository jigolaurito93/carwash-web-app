"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { FiPlusCircle, FiX } from "react-icons/fi";
import type { Appointment, AppointmentServiceOption } from "@/lib/app.types";
import type { ShopHoursDay } from "@/lib/appointment-hours";
import AppointmentFormModal from "@/components/admin/AppointmentFormModal";
import { deleteAppointment } from "@/app/(admin-protected)/admin/appointment/actions";

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

export default function AppointmentsClient({
  appointments,
  services,
  hours,
}: Props) {
  const router = useRouter();
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [deleting, setDeleting] = useState<Appointment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreate = () => {
    setSelected(null);
    setModal("create");
  };

  const openEdit = (appointment: Appointment) => {
    setSelected(appointment);
    setModal("edit");
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setIsDeleting(true);
    try {
      const result = await deleteAppointment(deleting.id);
      if (result.success) {
        toast.success("Appointment deleted.");
        setDeleting(null);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete appointment.");
      }
    } catch {
      toast.error("Failed to delete appointment.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="font-questrial">
      <div className="mb-6 flex items-center justify-end">
        <button
          type="button"
          onClick={openCreate}
          className="btnSaveYlw inline-flex items-center gap-2"
        >
          <FiPlusCircle className="h-4 w-4" />
          Add Appointment
        </button>
      </div>

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
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No appointments found.
                </td>
              </tr>
            ) : (
              appointments.map((appointment) => {
                const date = new Date(appointment.appointment_date);
                return (
                  <tr
                    key={appointment.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {customerLabel(appointment)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      <p>{appointment.phone_number || "—"}</p>
                      {appointment.email ? (
                        <p className="text-xs text-gray-500">
                          {appointment.email}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {format(date, "MMM d, yyyy")} {format(date, "h:mm a")}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700">
                      {appointment.service}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          appointment.status === "scheduled"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {appointment.status === "scheduled"
                          ? "Active"
                          : appointment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="ml-auto flex w-20 flex-col items-stretch gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(appointment)}
                          className="cursor-pointer rounded border border-gray-200 bg-white px-2 py-1 text-xs font-bold transition-all hover:bg-yellow-400"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleting(appointment)}
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

      <AppointmentFormModal
        open={modal !== null}
        onClose={closeModal}
        mode={modal === "edit" ? "edit" : "create"}
        appointment={selected}
        services={services}
        hours={hours}
      />

      {deleting && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => !isDeleting && setDeleting(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-red-700">
                Delete Appointment
              </h2>
              <button
                type="button"
                onClick={() => setDeleting(null)}
                disabled={isDeleting}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-6 text-gray-700">
              Delete{" "}
              <strong>{customerLabel(deleting)}&apos;s appointment</strong>?
              This cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setDeleting(null)}
                disabled={isDeleting}
                className="btnCancel"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-xl bg-red-600 px-6 py-3 text-white hover:bg-red-700 disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
