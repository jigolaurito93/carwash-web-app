"use client";

import { useState } from "react";
import { toast } from "sonner";
import { deleteCategory } from "@/app/(admin-protected)/admin/services/actions";
import AdminModal from "@/components/admin/AdminModal";

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

  return (
    <AdminModal
      open={isOpen}
      onClose={closeIfIdle}
      title="Delete Category"
      titleTone="danger"
      closeDisabled={isDeleting}
      footer={
        <>
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
        </>
      }
    >
      {hasServices ? (
        <p className="font-questrial text-gray-700">
          <strong>{category.name}</strong> still has {serviceCount}{" "}
          {serviceCount === 1 ? "service" : "services"}. Delete or move those
          first, then you can remove the category.
        </p>
      ) : (
        <p className="font-questrial text-gray-700">
          Are you sure you want to delete <strong>{category.name}</strong>? This
          action cannot be undone.
        </p>
      )}
    </AdminModal>
  );
}
