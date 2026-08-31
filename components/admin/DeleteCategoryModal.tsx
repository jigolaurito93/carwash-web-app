"use client";

import { useState } from "react";
import { FiX } from "react-icons/fi";
import { toast } from "sonner";
import { deleteCategory } from "@/app/(admin-protected)/admin/services/actions";

type Category = {
  id: number;
  name: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onDeleted?: () => void;
  category: Category;
  serviceCount?: number;
};

export default function DeleteCategoryModal({
  isOpen,
  onClose,
  onDeleted,
  category,
  serviceCount = 0,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const hasServices = serviceCount > 0;

  const closeIfIdle = () => {
    if (isDeleting) return;
    onClose();
  };

  const handleDelete = async () => {
    if (hasServices) return;
    setIsDeleting(true);
    try {
      const result = await deleteCategory(category.id);
      if (result.success) {
        toast.success("Category deleted!");
        (onDeleted ?? onClose)();
      } else {
        toast.error(result.error || "Delete failed.");
      }
    } catch {
      toast.error("Delete failed.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={closeIfIdle}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-red-700">Delete Category</h2>
          <button
            type="button"
            onClick={closeIfIdle}
            disabled={isDeleting}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {hasServices ? (
          <p className="mb-6 text-gray-700">
            <strong>{category.name}</strong> still has {serviceCount}{" "}
            {serviceCount === 1 ? "service" : "services"}. Delete or move those
            first, then you can remove the category.
          </p>
        ) : (
          <p className="mb-6 text-gray-700">
            Are you sure you want to delete <strong>{category.name}</strong>?
            This action cannot be undone.
          </p>
        )}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={closeIfIdle}
            disabled={isDeleting}
            className="btnCancel"
          >
            Cancel
          </button>
          {!hasServices && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-xl bg-red-600 px-6 py-3 text-white hover:bg-red-700 disabled:opacity-60"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
