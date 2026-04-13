// app/admin/services1/page.tsx
"use client";

import { useState, useEffect } from "react";
import { ServiceRow, Category } from "@/lib/database.types";
import { supabase } from "@/lib/supabase";
import { FiPlusCircle, FiEdit2, FiTrash2 } from "react-icons/fi";

import ServiceModal from "@/components/admin/ServiceModal";
import DeleteServiceModal from "@/components/admin/DeleteServiceModal";

export default function ServicesAdminPage() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState<
    "create" | "edit" | "delete" | null
  >(null);
  const [editing, setEditing] = useState<ServiceRow | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      // No card_layout on categories now, so just select *
      const [{ data: servicesData }, { data: cats }] = await Promise.all([
        supabase.from("services1").select(`*, categories1(name)`), // layout will come from service field
        supabase.from("categories1").select("*"),
      ]);

      if (servicesData) setServices(servicesData);
      if (cats) setCategories(cats);
      setLoading(false);
    };
    fetchAll();
  }, []);

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

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-5xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Services</h1>
        <button
          onClick={openCreate}
          className="hover:shadow-3xl inline-flex items-center gap-3 rounded-2xl bg-linear-to-r from-black to-gray-900 px-8 py-4 text-lg font-bold text-white shadow-2xl transition-all hover:scale-[1.02]"
        >
          <FiPlusCircle className="h-6 w-6" />
          Add Service
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Category
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Layout
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-t border-gray-100">
                <td className="px-6 py-4 text-gray-900">{service.name}</td>
                <td className="px-6 py-4 text-gray-600">
                  {service.categories1?.name || "—"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      service.card_layout === "layout1"
                        ? "bg-blue-100 text-blue-800"
                        : service.card_layout === "layout2"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {service.card_layout || "—"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(service)}
                      className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                      title="Edit service"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </button>
                    <button
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

            {!services.length && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-20 text-center text-gray-500"
                >
                  No services yet. Click <strong>Add Service</strong> above to
                  create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <ServiceModal
        isOpen={openModal === "create"}
        onClose={() => setOpenModal(null)}
        mode="create"
        categories={categories}
      />

      {editing && openModal === "edit" && (
        <ServiceModal
          isOpen
          onClose={() => setOpenModal(null)}
          mode="edit"
          service={editing}
          categories={categories}
        />
      )}

      {editing && openModal === "delete" && (
        <DeleteServiceModal
          isOpen
          onClose={() => setOpenModal(null)}
          service={editing}
        />
      )}
    </div>
  );
}
