// app/admin/categories1/page.tsx
"use client";

import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiPlusCircle } from "react-icons/fi";

import CategoryModal from "@/components/admin/CategoryModal";
import DeleteCategoryModal from "@/components/admin/DeleteCategoryModal";

type Category = {
  id: number;
  name: string;
  slug: string;
};

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState<
    "create" | "edit" | "delete" | null
  >(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Load categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        const { data, error } = await res.json();

        if (!error && Array.isArray(data)) {
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setOpenModal("edit");
  };

  const openDelete = (cat: Category) => {
    setEditingCategory(cat);
    setOpenModal("delete");
  };

  const openCreate = () => {
    setEditingCategory(null);
    setOpenModal("create");
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl p-8">
        <div className="text-center text-gray-500">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl p-8">
      {/* Page header + CREATOR button */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <button
          onClick={openCreate}
          className="hover:shadow-3xl inline-flex items-center gap-3 rounded-2xl bg-linear-to-r from-black to-gray-900 px-8 py-4 text-lg font-bold text-white shadow-2xl transition-all hover:scale-[1.02]"
        >
          <FiPlusCircle className="h-6 w-6" />
          Add Category
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
        {categories.length ? (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Slug
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-t border-gray-100">
                  <td className="px-6 py-4 text-gray-900">{cat.name}</td>
                  <td className="px-6 py-4 text-gray-600">{cat.slug}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(cat)}
                        className="rounded-lg p-2 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-50"
                        title="Edit category"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openDelete(cat)}
                        className="rounded-lg p-2 text-sm font-semibold text-red-600 transition-all hover:bg-red-50"
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
        ) : (
          <div className="py-20 text-center text-gray-500">
            No categories yet. Click the button above to add one.
          </div>
        )}
      </div>

      {/* Modals */}
      <CategoryModal
        isOpen={openModal === "create"}
        onClose={() => setOpenModal(null)}
        mode="create"
      />

      {editingCategory && (
        <CategoryModal
          isOpen={openModal === "edit"}
          onClose={() => setOpenModal(null)}
          mode="edit"
          category={editingCategory}
        />
      )}

      {editingCategory && (
        <DeleteCategoryModal
          isOpen={openModal === "delete"}
          onClose={() => setOpenModal(null)}
          category={editingCategory}
        />
      )}
    </div>
  );
}
