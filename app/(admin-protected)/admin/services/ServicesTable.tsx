"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Database } from "@/lib/database.types";
import { deleteService } from "./actions"; // Make sure this is in your actions.ts
import ServicesModal from "@/components/admin/ServicesModal"; // Adjust path
import { FiPlusCircle } from "react-icons/fi";
import { toast } from "sonner";

type ServiceRow = Database["public"]["Tables"]["services"]["Row"];

// Properly display services JSON in bullet form
function renderTypes(types: any) {
  if (!types || !Array.isArray(types) || types.length === 0)
    return <span className="text-gray-400">—</span>;

  return (
    <div className="flex flex-col gap-1">
      {types.map((feature: string, i: number) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span className="h-1 w-1 shrink-0 rounded-full bg-black" />
          <span className="font-medium text-gray-700">{feature}</span>
        </div>
      ))}
    </div>
  );
}

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
              Are you sure you want to remove{" "}
              <span className="text-yellow-400">&quot;{name}&quot;</span>? This
              cannot be undone.
            </p>
            <div className="mt-6 flex w-full gap-3">
              <button
                onClick={() => toast.dismiss(t)}
                className="flex-1 cursor-pointer rounded-md border border-zinc-700 bg-white py-2 text-xs font-bold tracking-wider text-black transition-colors hover:bg-zinc-200"
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
                className="flex-1 cursor-pointer rounded-md bg-red-600 py-2 text-xs font-bold text-white transition-all hover:bg-red-500 active:scale-95"
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
      {/* Header Area */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-questrial text-3xl font-bold tracking-wider text-gray-900">
          Main Services
        </h2>
        <button
          onClick={handleCreate}
          className="flex cursor-pointer items-center gap-2 rounded bg-black px-4 py-2 font-questrial text-sm font-bold text-white transition-all hover:bg-zinc-800"
        >
          <FiPlusCircle className="h-4 w-4" /> Add Service
        </button>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-gray-50 font-questrial">
            <tr>
              <th className="px-4 py-3 font-bold text-gray-700">Title</th>
              <th className="px-4 py-3 font-bold text-gray-700">
                Description (Optional)
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700">
                Services
              </th>
              <th className="px-4 py-3 font-bold text-gray-700">Car</th>
              <th className="px-4 py-3 font-bold text-gray-700">Mid</th>
              <th className="px-4 py-3 font-bold text-gray-700">Full</th>
              <th className="px-4 py-3 text-center font-bold text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-center font-bold text-gray-700">
                Order
              </th>
              <th className="px-4 py-3 text-right font-bold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {services.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-gray-50">
                <td className="px-4 py-3 align-top font-medium text-gray-900">
                  {row.name}
                </td>
                <td className="hidden px-4 py-3 align-top font-medium text-gray-500 sm:table-cell">
                  {row.subtitle ?? "—"}
                </td>

                <td className="px-4 py-3 align-top">
                  {renderTypes(row.types)}
                </td>

                <td className="px-4 py-3 align-top text-gray-500 tabular-nums">
                  {formatPrice(row.price_car)}
                </td>
                <td className="px-4 py-3 align-top text-gray-500 tabular-nums">
                  {formatPrice(row.price_mid)}
                </td>
                <td className="px-4 py-3 align-top text-gray-500 tabular-nums">
                  {formatPrice(row.price_full)}
                </td>
                <td className="px-4 py-3 text-center align-top">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${row.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
                  >
                    {row.is_active ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center align-top text-gray-500">
                  {row.sort_order}
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="ml-auto flex w-20 flex-col gap-2 font-questrial tracking-widest">
                    <button
                      onClick={() => handleEdit(row)}
                      className="cursor-pointer rounded border border-gray-200 bg-white px-2 py-1 text-xs font-bold transition-all hover:bg-yellow-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(row.id, row.name)}
                      className="cursor-pointer rounded border border-red-100 bg-red-50 px-2 py-1 text-xs font-bold text-red-600 transition-all hover:bg-red-600 hover:text-white"
                    >
                      Delete
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
