"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { FiEdit2, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import type { SiteAnnouncement } from "@/lib/app.types";
import {
  ANNOUNCEMENT_KINDS,
  announcementKindLabel,
  announcementStatus,
  datetimeLocalToIso,
  endOfLocalDay,
  isoToDatetimeLocalValue,
  parseYmdLocal,
  toDatetimeLocalValue,
  type AnnouncementKind,
} from "@/lib/announcements";
import {
  createAnnouncement,
  deleteAnnouncement,
  toggleAnnouncementActive,
  updateAnnouncement,
} from "@/app/(admin-protected)/admin/announcements/actions";
import AdminModal from "@/components/admin/AdminModal";
import { cn } from "@/lib/utils";

type Props = {
  announcements: SiteAnnouncement[];
};

type FormState = {
  title: string;
  message: string;
  kind: AnnouncementKind;
  link_url: string;
  sort_order: number;
  is_active: boolean;
  show_in_banner: boolean;
  starts_at: string;
  expires_at: string;
  closes_on: string;
};

const emptyForm = (sortOrder: number): FormState => ({
  title: "",
  message: "",
  kind: "notice",
  link_url: "",
  sort_order: sortOrder,
  is_active: true,
  show_in_banner: true,
  starts_at: "",
  expires_at: "",
  closes_on: "",
});

const expiryPresets = [
  {
    label: "24 hours",
    getDate: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
  {
    label: "End of today",
    getDate: () => endOfLocalDay(new Date()),
  },
  {
    label: "3 days",
    getDate: () => {
      const date = new Date();
      date.setDate(date.getDate() + 3);
      return endOfLocalDay(date);
    },
  },
  {
    label: "1 week",
    getDate: () => {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return endOfLocalDay(date);
    },
  },
];

function formatWhen(iso: string | null) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return format(date, "MMM d, yyyy h:mm a");
}

function formatClosedOn(ymd: string | null) {
  if (!ymd) return null;
  const date = parseYmdLocal(ymd);
  if (!date) return null;
  return format(date, "EEE, MMM d");
}

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
      title: item.title ?? "",
      message: item.message,
      kind: item.kind,
      link_url: item.link_url ?? "",
      sort_order: item.sort_order,
      is_active: item.is_active,
      show_in_banner: item.show_in_banner,
      starts_at: isoToDatetimeLocalValue(item.starts_at),
      expires_at: isoToDatetimeLocalValue(item.expires_at),
      closes_on: item.closes_on ?? "",
    });
    setModal("edit");
  };

  const closeModal = () => {
    if (saving) return;
    setModal(null);
    setEditing(null);
  };

  const setKind = (kind: AnnouncementKind) => {
    setForm((prev) => {
      const next: FormState = {
        ...prev,
        kind,
        closes_on: kind === "closure" ? prev.closes_on : "",
      };
      if (modal === "create") {
        next.show_in_banner = true;
      }
      return next;
    });
  };

  const setClosesOn = (closes_on: string) => {
    setForm((prev) => {
      const next = { ...prev, closes_on };
      if (closes_on && !prev.expires_at) {
        const day = parseYmdLocal(closes_on);
        if (day) next.expires_at = toDatetimeLocalValue(endOfLocalDay(day));
      }
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    const startsAt = datetimeLocalToIso(form.starts_at);
    const expiresAt = datetimeLocalToIso(form.expires_at);
    if (form.starts_at && !startsAt) {
      toast.error("Enter a valid start date and time.");
      setSaving(false);
      return;
    }
    if (form.expires_at && !expiresAt) {
      toast.error("Enter a valid expiration date and time.");
      setSaving(false);
      return;
    }

    const formData = new FormData();
    if (editing) formData.set("id", String(editing.id));
    formData.set("title", form.title);
    formData.set("message", form.message);
    formData.set("kind", form.kind);
    formData.set("link_url", form.link_url);
    formData.set("sort_order", String(form.sort_order));
    formData.set("starts_at", startsAt ?? "");
    formData.set("expires_at", expiresAt ?? "");
    formData.set("closes_on", form.kind === "closure" ? form.closes_on : "");
    if (form.is_active) formData.set("is_active", "on");
    if (form.show_in_banner) formData.set("show_in_banner", "on");

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
        <p className="max-w-2xl font-questrial text-sm text-gray-500">
          Use the top banner for rotating alerts. Closed-day notices also show
          on the hours section. Homepage popups are edited under Popups.
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
          {announcements.map((item) => {
            const status = announcementStatus(item);
            const closedLabel = formatClosedOn(item.closes_on);
            const expiresLabel = formatWhen(item.expires_at);
            const startsLabel = formatWhen(item.starts_at);

            return (
              <div
                key={item.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 font-questrial text-[11px] font-bold tracking-wider uppercase",
                          item.kind === "closure" && "bg-red-50 text-red-700",
                          item.kind === "promo" &&
                            "bg-yellow-100 text-yellow-800",
                          item.kind === "notice" && "bg-gray-100 text-gray-600",
                        )}
                      >
                        {announcementKindLabel(item.kind)}
                      </span>
                      <span
                        className={cn(
                          "font-questrial text-[11px] tracking-wider uppercase",
                          status === "live" && "text-emerald-600",
                          status === "scheduled" && "text-blue-600",
                          status === "expired" && "text-gray-400",
                          status === "hidden" && "text-gray-400",
                        )}
                      >
                        {status === "live" && "Live"}
                        {status === "scheduled" && "Scheduled"}
                        {status === "expired" && "Expired"}
                        {status === "hidden" && "Hidden"}
                      </span>
                    </div>
                    {item.title ? (
                      <p className="mt-2 font-lexend text-lg font-semibold text-gray-900">
                        {item.title}
                      </p>
                    ) : null}
                    <p
                      className={cn(
                        "font-questrial text-gray-700",
                        item.title
                          ? "mt-1"
                          : "mt-2 font-lexend text-lg font-semibold text-gray-900",
                      )}
                    >
                      {item.message}
                    </p>
                    <p className="mt-3 font-questrial text-xs tracking-wider text-gray-400 uppercase">
                      {[
                        item.show_in_banner ? "Banner" : null,
                        closedLabel ? `Closed ${closedLabel}` : null,
                        startsLabel && status === "scheduled"
                          ? `Starts ${startsLabel}`
                          : null,
                        expiresLabel
                          ? status === "expired"
                            ? `Ended ${expiresLabel}`
                            : `Until ${expiresLabel}`
                          : "No end date",
                        `Sort ${item.sort_order}`,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    {item.link_url ? (
                      <p className="mt-2 truncate font-questrial text-sm text-gray-500">
                        {item.link_url}
                      </p>
                    ) : null}
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
            );
          })}
        </div>
      )}

      {modal && (
        <AdminModal
          open
          onClose={closeModal}
          title={modal === "create" ? "Add announcement" : "Edit announcement"}
          description="Banner alerts rotate at the top of the public site. Set an expiration so a notice turns off on its own."
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
                htmlFor="announcement-kind"
              >
                Type
              </label>
              <select
                id="announcement-kind"
                value={form.kind}
                onChange={(event) =>
                  setKind(event.target.value as AnnouncementKind)
                }
                className="inputx text-sm"
                disabled={saving}
              >
                {ANNOUNCEMENT_KINDS.map((kind) => (
                  <option key={kind} value={kind}>
                    {announcementKindLabel(kind)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="labelx block text-xs"
                htmlFor="announcement-title"
              >
                Title (optional)
              </label>
              <input
                id="announcement-title"
                maxLength={80}
                placeholder={
                  form.kind === "closure"
                    ? "Thanksgiving hours"
                    : form.kind === "promo"
                      ? "Early bird special"
                      : "Announcement"
                }
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                className="inputx text-sm"
                disabled={saving}
              />
            </div>

            <div>
              <label
                className="labelx block text-xs"
                htmlFor="announcement-message"
              >
                Message
              </label>
              <textarea
                id="announcement-message"
                required
                maxLength={500}
                rows={4}
                placeholder={
                  form.kind === "closure"
                    ? "Closed Thursday for Thanksgiving. See you Friday."
                    : form.kind === "promo"
                      ? "Wash before 10 AM and save 15% this week."
                      : "Short message for the banner."
                }
                value={form.message}
                onChange={(event) =>
                  setForm({ ...form, message: event.target.value })
                }
                className="inputx min-h-24 text-sm"
                disabled={saving}
              />
            </div>

            {form.kind === "closure" ? (
              <div>
                <label
                  className="labelx block text-xs"
                  htmlFor="announcement-closes-on"
                >
                  Closed on
                </label>
                <input
                  id="announcement-closes-on"
                  type="date"
                  required
                  value={form.closes_on}
                  onChange={(event) => setClosesOn(event.target.value)}
                  className="inputx text-sm"
                  disabled={saving}
                />
                <p className="mt-1 font-questrial text-xs text-gray-500">
                  Shown on the hours section. The banner can start earlier using
                  Show from.
                </p>
              </div>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-2 font-questrial text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.show_in_banner}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      show_in_banner: event.target.checked,
                    })
                  }
                  className="h-4 w-4 accent-yellow-400"
                  disabled={saving}
                />
                Show in top banner
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  className="labelx block text-xs"
                  htmlFor="announcement-starts"
                >
                  Show from (optional)
                </label>
                <input
                  id="announcement-starts"
                  type="datetime-local"
                  value={form.starts_at}
                  onChange={(event) =>
                    setForm({ ...form, starts_at: event.target.value })
                  }
                  className="inputx text-sm"
                  disabled={saving}
                />
              </div>
              <div>
                <label
                  className="labelx block text-xs"
                  htmlFor="announcement-expires"
                >
                  Hide after
                </label>
                <input
                  id="announcement-expires"
                  type="datetime-local"
                  value={form.expires_at}
                  onChange={(event) =>
                    setForm({ ...form, expires_at: event.target.value })
                  }
                  className="inputx text-sm"
                  disabled={saving}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {expiryPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    setForm({
                      ...form,
                      expires_at: toDatetimeLocalValue(preset.getDate()),
                    })
                  }
                  className="rounded-full border border-gray-200 px-3 py-1 font-questrial text-xs text-gray-600 transition-colors hover:border-yellow-400 hover:text-black disabled:opacity-60"
                >
                  {preset.label}
                </button>
              ))}
              {form.kind === "closure" && form.closes_on ? (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    const day = parseYmdLocal(form.closes_on);
                    if (!day) return;
                    setForm({
                      ...form,
                      expires_at: toDatetimeLocalValue(endOfLocalDay(day)),
                    });
                  }}
                  className="rounded-full border border-gray-200 px-3 py-1 font-questrial text-xs text-gray-600 transition-colors hover:border-yellow-400 hover:text-black disabled:opacity-60"
                >
                  End of closed day
                </button>
              ) : null}
              {form.expires_at ? (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setForm({ ...form, expires_at: "" })}
                  className="rounded-full border border-gray-200 px-3 py-1 font-questrial text-xs text-gray-600 transition-colors hover:border-yellow-400 hover:text-black disabled:opacity-60"
                >
                  No end date
                </button>
              ) : null}
            </div>
            <p className="font-questrial text-xs text-gray-500">
              Leave Hide after empty to keep it up until you turn it off. Dates
              use this computer&apos;s local time.
            </p>

            <div>
              <label
                className="labelx block text-xs"
                htmlFor="announcement-link"
              >
                Optional link
              </label>
              <input
                id="announcement-link"
                type="text"
                maxLength={500}
                placeholder="https:// or /services"
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
              Active
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
            Delete <strong>{deleting.title || deleting.message}</strong>? This
            cannot be undone.
          </p>
        </AdminModal>
      )}
    </div>
  );
}
