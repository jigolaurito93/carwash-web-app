"use client";

import { useState } from "react";
import { FiX } from "react-icons/fi";
import { toast } from "sonner";
import { deleteService } from "@/app/(admin-protected)/admin/services/actions";

type Service = {
  id: number;
  name: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
  service: Service;
};

export default function DeleteServiceModal({
  isOpen,
  onClose,
  onDeleted,
  service,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const closeIfIdle = () => {
    if (isDeleting) return;
    onClose();
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteService(service.id);
      if (result.success) {
        toast.success("Service deleted!");
        onDeleted();
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
          <h2 className="text-2xl font-bold text-red-700">Delete Service</h2>
          <button
            type="button"
            onClick={closeIfIdle}
            disabled={isDeleting}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-6 text-gray-700">
          Are you sure you want to delete <strong>{service.name}</strong>? This
          action cannot be undone.
        </p>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={closeIfIdle}
            disabled={isDeleting}
            className="btnCancel"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-xl bg-red-600 px-6 py-3 text-white hover:bg-red-700 disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
