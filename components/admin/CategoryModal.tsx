"use client";

import { useMemo, useState } from "react";
import { FiX } from "react-icons/fi";
import { toast } from "sonner";
import type { Category } from "@/lib/app.types";
import {
  createCategory,
  updateCategory,
} from "@/app/(admin-protected)/admin/services/actions";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
  mode: "create" | "edit";
  category?: Category;
  categories?: Category[];
};

function slugFromName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CategoryModal({
  isOpen,
  onClose,
  onSaved,
  mode,
  category,
  categories = [],
}: Props) {
  const [name, setName] = useState(
    mode === "create" ? "" : (category?.name ?? ""),
  );
  const [slug, setSlug] = useState(
    mode === "create" ? "" : (category?.slug ?? ""),
  );
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [sortOrder, setSortOrder] = useState(
    mode === "create" ? "" : (category?.sort_order?.toString() ?? ""),
  );
  const [saving, setSaving] = useState(false);

  const { takenValues, nextAvailable } = useMemo(() => {
    const taken = categories
      .filter((row) => row.id !== category?.id && row.sort_order != null)
      .map((row) => row.sort_order as number)
      .sort((a, b) => a - b);
    const maxValue = taken.length > 0 ? Math.max(...taken) : 0;
    return { takenValues: taken, nextAvailable: maxValue + 10 };
  }, [categories, category?.id]);

  const closeIfIdle = () => {
    if (saving) return;
    onClose();
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugTouched) {
      setSlug(slugFromName(value));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const sortOrderValue = sortOrder ? Number(sortOrder) : nextAvailable;
    if (takenValues.includes(sortOrderValue)) {
      toast.error(`Sort order ${sortOrderValue} is already taken.`);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name,
        slug,
        sort_order: sortOrderValue,
      };
      const result =
        mode === "create"
          ? await createCategory(payload)
          : await updateCategory(category!.id, payload);

      if (result.success) {
        toast.success(
          mode === "create" ? "Category created!" : "Category updated!",
        );
        (onSaved ?? onClose)();
      } else {
        toast.error(
          result.error ||
            (mode === "create" ? "Create failed." : "Update failed."),
        );
      }
    } catch {
      toast.error(mode === "create" ? "Create failed." : "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={closeIfIdle}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-lexend text-2xl font-bold text-gray-900">
            {mode === "create" ? "Create Category" : "Edit Category"}
          </h2>
          <button
            type="button"
            onClick={closeIfIdle}
            disabled={saving}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Name *
            </label>
            <input
              required
              value={name}
              onChange={(event) => handleNameChange(event.target.value)}
              className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500"
              placeholder="Main Wash"
              disabled={saving}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Slug *
            </label>
            <input
              required
              value={slug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value);
              }}
              className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500"
              placeholder="main-wash"
              disabled={saving}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Sort Order *
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500"
              placeholder={`Suggested: ${nextAvailable}`}
              disabled={saving}
            />
            {takenValues.length > 0 && (
              <p className="mt-2 text-xs text-gray-500">
                Taken values: {takenValues.join(", ")}
              </p>
            )}
            {sortOrder && takenValues.includes(Number(sortOrder)) && (
              <p className="mt-1 text-xs text-red-500">
                This order value is already taken
              </p>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={closeIfIdle}
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
                : mode === "create"
                  ? "Create Category"
                  : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
