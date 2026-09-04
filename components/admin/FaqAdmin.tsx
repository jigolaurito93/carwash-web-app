"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FiEdit2, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import type { Faq } from "@/lib/app.types";
import {
  createFaq,
  deleteFaq,
  toggleFaqActive,
  updateFaq,
} from "@/app/(admin-protected)/admin/faq/actions";
import AdminModal from "@/components/admin/AdminModal";

type Props = {
  faqs: Faq[];
};

type FaqFormState = {
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
};

const emptyForm = (sortOrder: number): FaqFormState => ({
  question: "",
  answer: "",
  sort_order: sortOrder,
  is_active: true,
});

export default function FaqAdmin({ faqs }: Props) {
  const router = useRouter();
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [form, setForm] = useState<FaqFormState>(emptyForm(1));
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<Faq | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const nextSort =
    faqs.reduce((max, faq) => Math.max(max, faq.sort_order), 0) + 1;

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm(nextSort));
    setModal("create");
  };

  const openEdit = (faq: Faq) => {
    setEditing(faq);
    setForm({
      question: faq.question,
      answer: faq.answer,
      sort_order: faq.sort_order,
      is_active: faq.is_active,
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
    formData.set("question", form.question);
    formData.set("answer", form.answer);
    formData.set("sort_order", String(form.sort_order));
    if (form.is_active) formData.set("is_active", "on");

    try {
      const result =
        modal === "create"
          ? await createFaq(formData)
          : await updateFaq(formData);

      if (result.success) {
        toast.success(modal === "create" ? "FAQ created." : "FAQ updated.");
        setModal(null);
        setEditing(null);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to save FAQ.");
      }
    } catch {
      toast.error("Failed to save FAQ.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (faq: Faq) => {
    setTogglingId(faq.id);
    try {
      const result = await toggleFaqActive(faq.id, !faq.is_active);
      if (result.success) {
        toast.success(faq.is_active ? "FAQ hidden." : "FAQ published.");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update FAQ.");
      }
    } catch {
      toast.error("Failed to update FAQ.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setIsDeleting(true);
    try {
      const result = await deleteFaq(deleting.id);
      if (result.success) {
        toast.success("FAQ deleted.");
        setDeleting(null);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete FAQ.");
      }
    } catch {
      toast.error("Failed to delete FAQ.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="font-questrial text-sm text-gray-500">
          Published FAQs appear on the contact page. Hidden items stay in this
          list until you publish them.
        </p>
        <button
          type="button"
          onClick={openCreate}
          className="btnSaveYlw inline-flex items-center gap-2"
        >
          <FiPlusCircle className="h-4 w-4" />
          Add FAQ
        </button>
      </div>

      {faqs.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center font-questrial text-gray-500">
          No FAQs yet. Click Add FAQ to create the first one.
        </p>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="font-lexend text-lg font-semibold text-gray-900">
                    {faq.question}
                  </h2>
                  <p className="mt-2 line-clamp-3 font-questrial text-sm text-gray-600">
                    {faq.answer}
                  </p>
                  <p className="mt-3 font-questrial text-xs tracking-wider text-gray-400 uppercase">
                    Sort order {faq.sort_order}
                    {faq.is_active ? "" : " · Hidden"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <label className="flex cursor-pointer items-center gap-2 font-questrial text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={faq.is_active}
                      disabled={togglingId === faq.id}
                      onChange={() => handleToggle(faq)}
                      className="h-4 w-4 accent-yellow-400"
                    />
                    Active
                  </label>
                  <button
                    type="button"
                    onClick={() => openEdit(faq)}
                    className="rounded-lg p-2 text-blue-600 transition-all hover:bg-blue-50"
                    title="Edit FAQ"
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(faq)}
                    className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50"
                    title="Delete FAQ"
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
          title={modal === "create" ? "Add FAQ" : "Edit FAQ"}
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
                    ? "Create FAQ"
                    : "Save FAQ"}
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="labelx block text-xs" htmlFor="faq-question">
                Question
              </label>
              <input
                id="faq-question"
                required
                maxLength={300}
                value={form.question}
                onChange={(event) =>
                  setForm({ ...form, question: event.target.value })
                }
                className="inputx text-sm"
                disabled={saving}
              />
            </div>
            <div>
              <label className="labelx block text-xs" htmlFor="faq-answer">
                Answer
              </label>
              <textarea
                id="faq-answer"
                required
                maxLength={2000}
                rows={5}
                value={form.answer}
                onChange={(event) =>
                  setForm({ ...form, answer: event.target.value })
                }
                className="inputx min-h-32 text-sm"
                disabled={saving}
              />
            </div>
            <div>
              <label className="labelx block text-xs" htmlFor="faq-sort">
                Sort order
              </label>
              <input
                id="faq-sort"
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
              Active (visible on the contact page)
            </label>
          </div>
        </AdminModal>
      )}

      {deleting && (
        <AdminModal
          open
          onClose={() => setDeleting(null)}
          title="Delete FAQ"
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
            Delete <strong>{deleting.question}</strong>? This cannot be undone.
          </p>
        </AdminModal>
      )}
    </div>
  );
}
