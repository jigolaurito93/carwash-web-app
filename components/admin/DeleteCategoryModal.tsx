// components/admin/DeleteCategoryModal.tsx
"use client";

import { supabase } from "@/lib/supabase";
import { FiX } from "react-icons/fi";
import { toast } from "sonner";

type Category = {
  id: number;
  name: string;
  slug: string;
  card_layout: "layout1" | "layout2" | "layout3" | "layout4";
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
};

export default function DeleteCategoryModal({
  isOpen,
  onClose,
  category,
}: Props) {
  const handleDelete = async () => {
    const { error } = await supabase
      .from("categories1")
      .delete()
      .eq("id", category.id);

    if (!error) {
      toast.success("Category deleted!");
      onClose();
      window.location.reload();
    } else {
      toast.error("Delete failed.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-red-700">Delete Category</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-6 text-gray-700">
          Are you sure you want to delete <strong>{category.name}</strong>? This
          action cannot be undone and may affect related services.
        </p>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-xl bg-red-600 px-6 py-3 text-white transition-colors hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
