"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { FiEdit2, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import type { PopupAnnouncement } from "@/lib/popup-announcements";
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
  POPUP_LAYOUT_KEYS,
  POPUP_LAYOUT_META,
  type PopupLayoutKey,
} from "@/lib/popup-layouts";
import {
  createPopupAnnouncement,
  deletePopupAnnouncement,
  togglePopupAnnouncementActive,
  updatePopupAnnouncement,
} from "@/app/(admin-protected)/admin/popups/actions";
import AdminModal from "@/components/admin/AdminModal";
import { cn } from "@/lib/utils";

type Props = {
  popups: PopupAnnouncement[];
};

type FormState = {
  title: string;
  message: string;
  kind: AnnouncementKind;
  layout_key: PopupLayoutKey;
  link_url: string;
  sort_order: number;
  is_active: boolean;
  starts_at: string;
  expires_at: string;
  closes_on: string;
};

const emptyForm = (sortOrder: number): FormState => ({
  title: "",
  message: "",
  kind: "notice",
  layout_key: "default",
  link_url: "",
  sort_order: sortOrder,
  is_active: true,
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

export default function PopupsAdmin({ popups }: Props) {
  const router = useRouter();
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = useState<PopupAnnouncement | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm(1));
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<PopupAnnouncement | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const nextSort =
    popups.reduce((max, item) => Math.max(max, item.sort_order), 0) + 1;

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm(nextSort));
    setModal("create");
  };

  const openEdit = (item: PopupAnnouncement) => {
    setEditing(item);
    setForm({
      title: item.title ?? "",
      message: item.message,
      kind: item.kind,
      layout_key: item.layout_key,
      link_url: item.link_url ?? "",
      sort_order: item.sort_order,
      is_active: item.is_active,
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
    setForm((prev) => ({
      ...prev,
      kind,
      closes_on: kind === "closure" ? prev.closes_on : "",
    }));
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
    formData.set("layout_key", form.layout_key);
    formData.set("link_url", form.link_url);
    formData.set("sort_order", String(form.sort_order));
    formData.set("starts_at", startsAt ?? "");
    formData.set("expires_at", expiresAt ?? "");
    formData.set("closes_on", form.kind === "closure" ? form.closes_on : "");
    if (form.is_active) formData.set("is_active", "on");

    try {
      const result =
        modal === "create"
          ? await createPopupAnnouncement(formData)
          : await updatePopupAnnouncement(formData);

      if (result.success) {
        toast.success(modal === "create" ? "Popup created." : "Popup updated.");
        setModal(null);
        setEditing(null);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to save popup.");
      }
    } catch {
      toast.error("Failed to save popup.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (item: PopupAnnouncement) => {
    setTogglingId(item.id);
    try {
      const result = await togglePopupAnnouncementActive(
        item.id,
        !item.is_active,
      );
      if (result.success) {
        toast.success(item.is_active ? "Popup hidden." : "Popup published.");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update popup.");
      }
    } catch {
      toast.error("Failed to update popup.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setIsDeleting(true);
    try {
      const result = await deletePopupAnnouncement(deleting.id);
      if (result.success) {
        toast.success("Popup deleted.");
        setDeleting(null);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete popup.");
      }
    } catch {
      toast.error("Failed to delete popup.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-2xl font-questrial text-sm text-gray-500">
          This is the homepage popup, not the top banner. Use Default for a
          simple message, or pick a custom layout when a developer adds one (for
          example a 4th of July promo).
        </p>
        <button
          type="button"
          onClick={openCreate}
          className="btnSaveYlw inline-flex items-center gap-2"
        >
          <FiPlusCircle className="h-4 w-4" />
          Add popup
        </button>
      </div>

      {popups.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center font-questrial text-gray-500">
          No popups yet. Click Add popup to create the first one.
        </p>
      ) : (
        <div className="space-y-4">
          {popups.map((item) => {
            const status = announcementStatus(item);
            const closedLabel = formatClosedOn(item.closes_on);
            const expiresLabel = formatWhen(item.expires_at);
            const startsLabel = formatWhen(item.starts_at);
            const layoutLabel = POPUP_LAYOUT_META[item.layout_key].label;

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
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 font-questrial text-[11px] font-bold tracking-wider text-gray-600 uppercase">
                        {layoutLabel}
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
                      title="Edit popup"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(item)}
                      className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50"
                      title="Delete popup"
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
          title={modal === "create" ? "Add popup" : "Edit popup"}
          description="Write the message for the default card, or pick a custom layout. Set an expiration so it turns off on its own."
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
                    ? "Create popup"
                    : "Save popup"}
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <p className="labelx mb-2 block text-xs">Layout</p>
              <div className="grid gap-2">
                {POPUP_LAYOUT_KEYS.map((key) => {
                  const meta = POPUP_LAYOUT_META[key];
                  const selected = form.layout_key === key;
                  return (
                    <label
                      key={key}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors",
                        selected
                          ? "border-yellow-400 bg-yellow-50"
                          : "border-gray-200 hover:border-gray-300",
                        saving && "cursor-not-allowed opacity-60",
                      )}
                    >
                      <input
                        type="radio"
                        name="popup-layout"
                        value={key}
                        checked={selected}
                        disabled={saving}
                        onChange={() => setForm({ ...form, layout_key: key })}
                        className="mt-1 h-4 w-4 accent-yellow-400"
                      />
                      <span>
                        <span className="block font-lexend text-sm font-semibold text-gray-900">
                          {meta.label}
                        </span>
                        <span className="mt-0.5 block font-questrial text-xs text-gray-500">
                          {meta.hint}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="labelx block text-xs" htmlFor="popup-kind">
                Type
              </label>
              <select
                id="popup-kind"
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
              <label className="labelx block text-xs" htmlFor="popup-title">
                Title (optional)
              </label>
              <input
                id="popup-title"
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
              <label className="labelx block text-xs" htmlFor="popup-message">
                Message
              </label>
              <textarea
                id="popup-message"
                required
                maxLength={500}
                rows={4}
                placeholder={
                  form.kind === "closure"
                    ? "Closed Thursday for Thanksgiving. See you Friday."
                    : form.kind === "promo"
                      ? "Wash before 10 AM and save 15% this week."
                      : "Short message for the popup."
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
                  htmlFor="popup-closes-on"
                >
                  Closed on
                </label>
                <input
                  id="popup-closes-on"
                  type="date"
                  required
                  value={form.closes_on}
                  onChange={(event) => setClosesOn(event.target.value)}
                  className="inputx text-sm"
                  disabled={saving}
                />
                <p className="mt-1 font-questrial text-xs text-gray-500">
                  The popup can start earlier using Show from.
                </p>
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="labelx block text-xs" htmlFor="popup-starts">
                  Show from (optional)
                </label>
                <input
                  id="popup-starts"
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
                <label className="labelx block text-xs" htmlFor="popup-expires">
                  Hide after
                </label>
                <input
                  id="popup-expires"
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
              <label className="labelx block text-xs" htmlFor="popup-link">
                Optional link
              </label>
              <input
                id="popup-link"
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
              <label className="labelx block text-xs" htmlFor="popup-sort">
                Sort order
              </label>
              <input
                id="popup-sort"
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
          title="Delete popup"
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
