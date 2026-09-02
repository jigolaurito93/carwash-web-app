"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiEdit2, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import type { Category, ServiceRow } from "@/lib/app.types";
import CategoryModal from "@/components/admin/CategoryModal";
import DeleteCategoryModal from "@/components/admin/DeleteCategoryModal";

type Props = {
  categories: Category[];
  services: ServiceRow[];
};

export default function CategoriesAdmin({ categories, services }: Props) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState<
    "create" | "edit" | "delete" | null
  >(null);
  const [editing, setEditing] = useState<Category | null>(null);

  const serviceCounts = useMemo(() => {
    const counts = new Map<number, number>();
    for (const service of services) {
      if (service.category_id == null) continue;
      counts.set(
        service.category_id,
        (counts.get(service.category_id) ?? 0) + 1,
      );
    }
    return counts;
  }, [services]);

  const openCreate = () => {
    setEditing(null);
    setOpenModal("create");
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setOpenModal("edit");
  };

  const openDelete = (category: Category) => {
    setEditing(category);
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

  const emptyMessage = "No categories yet. Click Add Category to create one.";

  return (
    <div className="mb-12 min-w-0">
      <h2 className="mb-4 font-lexend text-xl font-semibold text-gray-900">
        Categories
      </h2>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="min-w-0 font-questrial text-sm text-gray-500">
          Categories group services on the public services page. Each service
          must belong to a category.
        </p>
        <button
          type="button"
          onClick={openCreate}
          className="btnSaveYlw inline-flex shrink-0 items-center gap-2"
        >
          <FiPlusCircle className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {!categories.length ? (
        <p className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center font-questrial text-gray-500 md:rounded-2xl">
          {emptyMessage}
        </p>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {categories.map((category) => (
              <div
                key={category.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-lexend text-base font-semibold text-gray-900">
                      {category.name}
                    </h3>
                    <p className="mt-1 truncate font-questrial text-sm text-gray-600">
                      {category.slug}
                    </p>
                    <p className="mt-2 font-questrial text-xs tracking-wider text-gray-400 uppercase">
                      Sort order {category.sort_order ?? "—"}
                      {" · "}
                      {serviceCounts.get(category.id) ?? 0} services
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(category)}
                      className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                      title="Edit category"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openDelete(category)}
                      className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                      title="Delete category"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-lg md:block">
            <table className="w-full min-w-[36rem]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Slug
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Sort Order
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-t border-gray-100">
                    <td className="px-6 py-4 text-gray-900">{category.name}</td>
                    <td className="px-6 py-4 font-questrial text-gray-600">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {category.sort_order ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(category)}
                          className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                          title="Edit category"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openDelete(category)}
                          className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                          title="Delete category"
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

      {openModal === "create" && (
        <CategoryModal
          isOpen
          onClose={closeModal}
          onSaved={handleSaved}
          mode="create"
          categories={categories}
        />
      )}

      {editing && openModal === "edit" && (
        <CategoryModal
          isOpen
          onClose={closeModal}
          onSaved={handleSaved}
          mode="edit"
          category={editing}
          categories={categories}
        />
      )}

      {editing && openModal === "delete" && (
        <DeleteCategoryModal
          isOpen
          onClose={closeModal}
          onDeleted={handleSaved}
          category={editing}
          serviceCount={serviceCounts.get(editing.id) ?? 0}
        />
      )}
    </div>
  );
}
