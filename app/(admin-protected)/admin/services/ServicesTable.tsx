"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Database } from "@/lib/database.types";
import { deleteService } from "./actions"; // Make sure this is in your actions.ts
import ServicesModal from "@/components/admin/ServicesModal"; // Adjust path
import { FiPlusCircle } from "react-icons/fi";
import { toast } from "sonner";

type ServiceRow = Database["public"]["Tables"]["services"]["Row"];

// Helper to format prices for the table cells
function formatPrice(value: number | null): string {
  if (value == null) return "—";
  return `$${value.toFixed(2)}`;
}

export default function ServicesTable({
  services,
}: {
  services: ServiceRow[];
}) {
  const router = useRouter();

  // 1. Unified Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceRow | null>(
    null,
  );

  // 2. Handlers
  const handleEdit = (service: ServiceRow) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number, name: string) => {
    toast.custom(
      (t) => (
        <div className="w-87.5 rounded-xl bg-black p-6 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 font-bold text-black">
              !
            </div>
            <h3 className="font-lexend text-lg font-bold text-white uppercase">
              Confirm Deletion
            </h3>
            <p className="mt-2 font-questrial text-sm text-gray-400">
              Remove <span className="text-yellow-400">"{name}"</span>?
            </p>
            <div className="mt-6 flex w-full gap-3">
              <button
                onClick={() => toast.dismiss(t)}
                className="flex-1 rounded-md bg-white py-2 text-xs font-bold text-black"
              >
                CANCEL
              </button>
              <button
                onClick={async () => {
                  toast.dismiss(t);
                  const res = await deleteService(id);
                  if (res.success) {
                    toast.success("Deleted");
                    router.refresh();
                  }
                }}
                className="flex-1 rounded-md bg-red-600 py-2 text-xs font-bold text-white"
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
    <div className="mt-12">
      {/* Header Area */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-questrial text-3xl font-bold tracking-wider text-gray-900">
          Main Services
        </h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 rounded bg-black px-4 py-2 font-questrial text-sm font-bold text-white transition-all hover:bg-zinc-800"
        >
          <FiPlusCircle /> Add Service
        </button>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-gray-50 font-questrial">
            <tr>
              <th className="px-4 py-3 font-bold text-gray-700">
                Service Name
              </th>
              <th className="px-4 py-3 font-bold text-gray-700">Car</th>
              <th className="px-4 py-3 font-bold text-gray-700">Mid</th>
              <th className="px-4 py-3 font-bold text-gray-700">Full</th>
              <th className="px-4 py-3 text-center font-bold text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-right font-bold text-gray-700 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {services.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-gray-50">
                <td className="px-4 py-3 align-top font-medium text-gray-900">
                  {row.name}
                  <div className="text-xs font-normal text-gray-400">
                    {row.subtitle}
                  </div>
                </td>
                <td className="px-4 py-3 align-top tabular-nums">
                  {formatPrice(row.price_car)}
                </td>
                <td className="px-4 py-3 align-top tabular-nums">
                  {formatPrice(row.price_mid)}
                </td>
                <td className="px-4 py-3 align-top tabular-nums">
                  {formatPrice(row.price_full)}
                </td>
                <td className="px-4 py-3 text-center align-top">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${row.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}
                  >
                    {row.is_active ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="ml-auto flex w-20 flex-col gap-2 font-questrial tracking-widest">
                    <button
                      onClick={() => handleEdit(row)}
                      className="rounded border border-gray-200 bg-white px-2 py-1 text-[10px] font-bold transition-all hover:bg-yellow-400"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDelete(row.id, row.name)}
                      className="rounded border border-red-100 bg-red-50 px-2 py-1 text-[10px] font-bold text-red-600 transition-all hover:bg-red-600 hover:text-white"
                    >
                      DELETE
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. Reusable Modal */}
      {isModalOpen && (
        <ServicesModal
          service={selectedService}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
