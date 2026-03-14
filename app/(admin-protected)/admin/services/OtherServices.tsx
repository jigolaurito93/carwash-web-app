"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Database } from "@/lib/database.types";
import { deleteOtherService } from "./actions";
import OtherServicesModal from "@/components/admin/OtherServicesModal";
import { FiPlusCircle } from "react-icons/fi";

type OtherServiceRow = Database["public"]["Tables"]["otherServices"]["Row"];

// Helper to render the JSON list inside the table cell
function renderTypes(types: any) {
  if (!types || !Array.isArray(types))
    return <span className="text-gray-400">—</span>;
  return (
    <div className="flex flex-col gap-1">
      {types.map((t: any, i: number) => (
        <div key={i} className="flex justify-between gap-4 text-xs">
          <span className="font-medium text-gray-700">
            {t.service || t.name}
          </span>
          <span className="text-gray-500 tabular-nums">${t.price || 0}</span>
        </div>
      ))}
    </div>
  );
}

export default function OtherServicesTable({
  services,
}: {
  services: OtherServiceRow[];
}) {
  const router = useRouter();

  // State for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] =
    useState<OtherServiceRow | null>(null);

  const handleEdit = (service: OtherServiceRow) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      const result = await deleteOtherService(id);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error);
      }
    }
  };

  return (
    <div className="mt-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Other Services</h2>
        <button
          onClick={handleCreate}
          className="flex cursor-pointer items-center justify-center gap-2 rounded bg-black px-4 py-2 text-sm font-bold text-white transition-all hover:bg-zinc-800"
        >
          <FiPlusCircle className="h-4 w-4" />
          Add Service
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-700">Title</th>
              <th className="hidden px-4 py-3 font-semibold text-gray-700 sm:table-cell">
                Subtitle
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700">
                Pricing Options
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                Order
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {services.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No other services found.
                </td>
              </tr>
            ) : (
              services.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3 align-top font-medium text-gray-900">
                    {row.title}
                  </td>
                  <td className="hidden px-4 py-3 align-top text-gray-500 sm:table-cell">
                    {row.subtitle ?? "—"}
                  </td>
                  <td className="px-4 py-3 align-top">
                    {renderTypes(row.types)}
                  </td>
                  <td className="px-4 py-3 text-center align-top">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        row.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {row.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center align-top text-gray-500">
                    {row.sort_order}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="ml-auto flex w-20 flex-col items-stretch gap-2">
                      <button
                        onClick={() => handleEdit(row)}
                        className="cursor-pointer rounded border border-gray-300 bg-white px-2 py-1 text-xs font-semibold text-gray-700 transition-all hover:bg-yellow-400 hover:text-black"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(row.id, row.title)}
                        className="cursor-pointer rounded border border-red-100 bg-red-50 px-2 py-1 text-xs font-semibold text-red-600 transition-all hover:bg-red-600 hover:text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Reusable Modal Component */}
      {isModalOpen && (
        <OtherServicesModal
          service={selectedService}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
