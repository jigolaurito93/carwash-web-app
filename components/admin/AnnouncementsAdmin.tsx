"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FiEdit2, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import type { SiteAnnouncement } from "@/lib/app.types";
import {
  createAnnouncement,
  deleteAnnouncement,
  toggleAnnouncementActive,
  updateAnnouncement,
} from "@/app/(admin-protected)/admin/announcements/actions";
import AdminModal from "@/components/admin/AdminModal";

type Props = {
  announcements: SiteAnnouncement[];
};

type FormState = {
  message: string;
  link_url: string;
  sort_order: number;
  is_active: boolean;
};

const emptyForm = (sortOrder: number): FormState => ({
  message: "",
  link_url: "",
  sort_order: sortOrder,
  is_active: true,
});

export default function AnnouncementsAdmin({ announcements }: Props) {
  const router = useRouter();
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = useState<SiteAnnouncement | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm(1));
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<SiteAnnouncement | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const nextSort =
    announcements.reduce((max, item) => Math.max(max, item.sort_order), 0) + 1;

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm(nextSort));
    setModal("create");
  };

  const openEdit = (item: SiteAnnouncement) => {
    setEditing(item);
    setForm({
      message: item.message,
      link_url: item.link_url ?? "",
      sort_order: item.sort_order,
      is_active: item.is_active,
    });
    setModal("edit");
  };

  const closeModal = () => {
    if (saving) return;
    setModal(null);
    setEditing(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    const formData = new FormData();
    if (editing) formData.set("id", String(editing.id));
    formData.set("message", form.message);
    formData.set("link_url", form.link_url);
    formData.set("sort_order", String(form.sort_order));
    if (form.is_active) formData.set("is_active", "on");

    try {
      const result =
        modal === "create"
          ? await createAnnouncement(formData)
          : await updateAnnouncement(formData);

      if (result.success) {
        toast.success(
          modal === "create"
            ? "Announcement created."
            : "Announcement updated.",
        );
        setModal(null);
        setEditing(null);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to save announcement.");
      }
    } catch {
      toast.error("Failed to save announcement.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (item: SiteAnnouncement) => {
    setTogglingId(item.id);
    try {
      const result = await toggleAnnouncementActive(item.id, !item.is_active);
      if (result.success) {
        toast.success(
          item.is_active ? "Announcement hidden." : "Announcement published.",
        );
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update announcement.");
      }
    } catch {
      toast.error("Failed to update announcement.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setIsDeleting(true);
    try {
      const result = await deleteAnnouncement(deleting.id);
      if (result.success) {
        toast.success("Announcement deleted.");
        setDeleting(null);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete announcement.");
      }
    } catch {
      toast.error("Failed to delete announcement.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="font-questrial text-sm text-gray-500">
          Active messages rotate in the public top banner. Inactive items stay
          here until you publish them.
        </p>
        <button
          type="button"
          onClick={openCreate}
          className="btnSaveYlw inline-flex items-center gap-2"
        >
          <FiPlusCircle className="h-4 w-4" />
          Add announcement
        </button>
      </div>

      {announcements.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center font-questrial text-gray-500">
          No announcements yet. Click Add announcement to create the first one.
        </p>
      ) : (
        <div className="space-y-4">
          {announcements.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-lexend text-lg font-semibold text-gray-900">
                    {item.message}
                  </p>
                  {item.link_url ? (
                    <p className="mt-2 truncate font-questrial text-sm text-gray-500">
                      {item.link_url}
                    </p>
                  ) : null}
                  <p className="mt-3 font-questrial text-xs tracking-wider text-gray-400 uppercase">
                    Sort order {item.sort_order}
                    {item.is_active ? "" : " · Hidden"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <label className="flex cursor-pointer items-center gap-2 font-questrial text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={item.is_active}
                      disabled={togglingId === item.id}
                      onChange={() => handleToggle(item)}
                      className="h-4 w-4 accent-yellow-400"
                    />
                    Active
                  </label>
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="rounded-lg p-2 text-blue-600 transition-all hover:bg-blue-50"
                    title="Edit announcement"
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(item)}
                    className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50"
                    title="Delete announcement"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <AdminModal
          open
          onClose={closeModal}
          title={modal === "create" ? "Add announcement" : "Edit announcement"}
          maxWidth="lg"
          closeDisabled={saving}
          asForm
          onSubmit={handleSubmit}
          footer={
            <>
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="btnCancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btnSaveYlw disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : modal === "create"
                    ? "Create announcement"
                    : "Save announcement"}
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label
                className="labelx block text-xs"
                htmlFor="announcement-message"
              >
                Message
              </label>
              <input
                id="announcement-message"
                required
                maxLength={200}
                value={form.message}
                onChange={(event) =>
                  setForm({ ...form, message: event.target.value })
                }
                className="inputx text-sm"
                disabled={saving}
              />
            </div>
            <div>
              <label
                className="labelx block text-xs"
                htmlFor="announcement-link"
              >
                Optional link
              </label>
              <input
                id="announcement-link"
                type="url"
                maxLength={500}
                placeholder="https://"
                value={form.link_url}
                onChange={(event) =>
                  setForm({ ...form, link_url: event.target.value })
                }
                className="inputx text-sm"
                disabled={saving}
              />
            </div>
            <div>
              <label
                className="labelx block text-xs"
                htmlFor="announcement-sort"
              >
                Sort order
              </label>
              <input
                id="announcement-sort"
                type="number"
                min={0}
                step={1}
                required
                value={form.sort_order}
                onChange={(event) =>
                  setForm({
                    ...form,
                    sort_order: Number(event.target.value),
                  })
                }
                className="inputx text-sm"
                disabled={saving}
              />
            </div>
            <label className="flex items-center gap-2 font-questrial text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) =>
                  setForm({ ...form, is_active: event.target.checked })
                }
                className="h-4 w-4 accent-yellow-400"
                disabled={saving}
              />
              Active (visible in the top banner)
            </label>
          </div>
        </AdminModal>
      )}

      {deleting && (
        <AdminModal
          open
          onClose={() => setDeleting(null)}
          title="Delete announcement"
          titleTone="danger"
          closeDisabled={isDeleting}
          footer={
            <>
              <button
                type="button"
                onClick={() => setDeleting(null)}
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
            Delete <strong>{deleting.message}</strong>? This cannot be undone.
          </p>
        </AdminModal>
      )}
    </div>
  );
}
