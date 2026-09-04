"use client";

import { useState } from "react";
import { toast } from "sonner";
import { deleteService } from "@/app/(admin-protected)/admin/services/actions";
import AdminModal from "@/components/admin/AdminModal";

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

  return (
    <AdminModal
      open={isOpen}
      onClose={closeIfIdle}
      title="Delete Service"
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
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-xl bg-red-600 px-6 py-3 text-white hover:bg-red-700 disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </>
      }
    >
      <p className="font-questrial text-gray-700">
        Are you sure you want to delete <strong>{service.name}</strong>? This
        action cannot be undone.
      </p>
    </AdminModal>
  );
}
