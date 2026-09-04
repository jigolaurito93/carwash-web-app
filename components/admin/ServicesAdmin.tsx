"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FiEdit2, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import type { Category, ServiceRow } from "@/lib/app.types";
import { toggleServiceActive } from "@/app/(admin-protected)/admin/services/actions";
import ServiceModal from "@/components/admin/ServiceModal";
import DeleteServiceModal from "@/components/admin/DeleteServiceModal";

type Props = {
  categories: Category[];
  services: ServiceRow[];
};

function toTitleCase(value: string) {
  return value.toLowerCase().replace(/(^|\s)\S/g, (char) => char.toUpperCase());
}

function layoutBadgeClass(layout: string | null) {
  switch (layout) {
    case "layout1":
      return "bg-blue-100 text-blue-800";
    case "layout2":
      return "bg-green-100 text-green-800";
    case "layout3":
      return "bg-purple-100 text-purple-800";
    case "layout4":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default function ServicesAdmin({ categories, services }: Props) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState<
    "create" | "edit" | "delete" | null
  >(null);
  const [editing, setEditing] = useState<ServiceRow | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const grouped = useMemo(() => {
    const byCategory = new Map<number, ServiceRow[]>();
    for (const service of services) {
      if (service.category_id == null) continue;
      const list = byCategory.get(service.category_id);
      if (list) list.push(service);
      else byCategory.set(service.category_id, [service]);
    }

    return categories.map((category) => ({
      category,
      services: byCategory.get(category.id) ?? [],
    }));
  }, [categories, services]);

  const openCreate = () => {
    setEditing(null);
    setOpenModal("create");
  };

  const openEdit = (service: ServiceRow) => {
    setEditing(service);
    setOpenModal("edit");
  };

  const openDelete = (service: ServiceRow) => {
    setEditing(service);
    setOpenModal("delete");
  };

  const closeModal = () => {
    setOpenModal(null);
    setEditing(null);
  };

  const handleSaved = () => {
    closeModal();
    router.refresh();
  };

  const handleToggle = async (service: ServiceRow) => {
    setTogglingId(service.id);
    try {
      const result = await toggleServiceActive(
        service.id,
        !(service.is_active ?? false),
      );
      if (result.success) {
        toast.success(
          service.is_active ? "Service hidden." : "Service published.",
        );
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update service.");
      }
    } catch {
      toast.error("Failed to update service.");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="min-w-0">
      <h2 className="mb-4 font-lexend text-xl font-semibold text-gray-900">
        Services
      </h2>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="min-w-0 font-questrial text-sm text-gray-500">
          Published services appear on the public services page. Hidden items
          stay in this list until you publish them.
        </p>
        <button
          type="button"
          onClick={openCreate}
          disabled={!categories.length}
          className="btnSaveYlw inline-flex shrink-0 items-center gap-2 disabled:opacity-60"
        >
          <FiPlusCircle className="h-4 w-4" />
          Add Service
        </button>
      </div>

      {grouped.map(({ category, services: categoryServices }) => (
        <div key={category.id} className="mb-8 min-w-0">
          <h2 className="mb-4 font-lexend text-xl font-semibold text-gray-900">
            {toTitleCase(category.name)}
          </h2>

          {!categoryServices.length ? (
            <p className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-8 text-center font-questrial text-gray-500 md:rounded-2xl">
              No services in this category yet.
            </p>
          ) : (
            <>
              <div className="space-y-3 md:hidden">
                {categoryServices.map((service) => (
                  <div
                    key={service.id}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-lexend text-base font-semibold text-gray-900">
                          {service.name}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${layoutBadgeClass(service.card_layout)}`}
                          >
                            {service.card_layout || "—"}
                          </span>
                          <span className="font-questrial text-xs tracking-wider text-gray-400 uppercase">
                            Sort {service.sort_order ?? "—"}
                            {service.is_active ? "" : " · Hidden"}
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(service)}
                          className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                          title="Edit service"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openDelete(service)}
                          className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                          title="Delete service"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <label className="mt-3 flex cursor-pointer items-center gap-2 font-questrial text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={service.is_active ?? false}
                        disabled={togglingId === service.id}
                        onChange={() => handleToggle(service)}
                        className="h-4 w-4 accent-yellow-400"
                      />
                      Active
                    </label>
                  </div>
                ))}
              </div>

              <div className="hidden overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-lg md:block">
                <table className="w-full min-w-60">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Layout
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Sort Order
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Active
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryServices.map((service) => (
                      <tr key={service.id} className="border-t border-gray-100">
                        <td className="px-6 py-4 text-gray-900">
                          {service.name}
                          {!service.is_active && (
                            <span className="ml-2 font-questrial text-xs tracking-wider text-gray-400 uppercase">
                              Hidden
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${layoutBadgeClass(service.card_layout)}`}
                          >
                            {service.card_layout || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {service.sort_order ?? "—"}
                        </td>
                        <td className="px-6 py-4">
                          <label className="flex cursor-pointer items-center gap-2 font-questrial text-sm text-gray-600">
                            <input
                              type="checkbox"
                              checked={service.is_active ?? false}
                              disabled={togglingId === service.id}
                              onChange={() => handleToggle(service)}
                              className="h-4 w-4 accent-yellow-400"
                            />
                            Active
                          </label>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEdit(service)}
                              className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                              title="Edit service"
                            >
                              <FiEdit2 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => openDelete(service)}
                              className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                              title="Delete service"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      ))}

      {!categories.length && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-lg">
          <p className="font-questrial text-gray-500">
            Add a category above to start adding services.
          </p>
        </div>
      )}

      {openModal === "create" && (
        <ServiceModal
          isOpen
          onClose={closeModal}
          onSaved={handleSaved}
          mode="create"
          categories={categories}
          services={services}
        />
      )}

      {editing && openModal === "edit" && (
        <ServiceModal
          isOpen
          onClose={closeModal}
          onSaved={handleSaved}
          mode="edit"
          service={editing}
          categories={categories}
          services={services}
        />
      )}

      {editing && openModal === "delete" && (
        <DeleteServiceModal
          isOpen
          onClose={closeModal}
          onDeleted={handleSaved}
          service={editing}
        />
      )}
    </div>
  );
}
