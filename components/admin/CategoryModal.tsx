"use client";

import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { toast } from "sonner";

type Category = {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  category?: Category;
};

export default function CategoryModal({
  isOpen,
  onClose,
  mode,
  category,
}: Props) {
  const [formData, setFormData] = useState<Partial<Category>>({
    name: mode === "create" ? "" : category?.name || "",
    slug: mode === "create" ? "" : category?.slug || "",
    sort_order: mode === "create" ? 0 : category?.sort_order || 0,
  });
  const [takenValues, setTakenValues] = useState<number[]>([]);
  const [nextAvailable, setNextAvailable] = useState<number>(1);

  useEffect(() => {
    const fetchOrderValues = async () => {
      const { data } = await supabase
        .from("categories1")
        .select("sort_order")
        .neq("id", mode === "edit" ? category?.id : -1);

      const taken = (data || []).map((d) => d.sort_order).sort((a, b) => a - b);
      setTakenValues(taken);

      // Find next available (max + 10)
      const maxValue = taken.length > 0 ? Math.max(...taken) : 0;
      setNextAvailable(maxValue + 10);
    };

    if (isOpen) {
      fetchOrderValues();
    }
  }, [isOpen, mode, category?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate sort_order is not taken (unless it's the same category being edited)
    if (mode === "create" && takenValues.includes(formData.sort_order || 0)) {
      toast.error(`Order value ${formData.sort_order} is already taken.`);
      return;
    }

    const payload = {
      name: formData.name!,
      slug: formData.slug!,
      sort_order: formData.sort_order || nextAvailable,
    };

    let error;
    if (mode === "create") {
      const { error: err } = await supabase.from("categories1").insert(payload);
      error = err;
    } else {
      const id = category!.id;
      const { error: err } = await supabase
        .from("categories1")
        .update(payload)
        .eq("id", id);
      error = err;
    }

    if (!error) {
      toast.success(
        mode === "create" ? "Category created!" : "Category updated!",
      );
      onClose();
      window.location.reload();
    } else {
      toast.error(mode === "create" ? "Create failed." : "Update failed.");
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
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === "create" ? "Create Category" : "Edit Category"}
          </h2>
          <button
            onClick={onClose}
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
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500"
              placeholder="Main Wash"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Slug *
            </label>
            <input
              required
              value={formData.slug || ""}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500"
              placeholder="main-wash"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Order *
            </label>
            <div className="space-y-2">
              <input
                required
                type="number"
                inputMode="numeric"
                value={formData.sort_order || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sort_order: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500"
                placeholder={`${nextAvailable} (recommended)`}
              />
              {takenValues.length > 0 && (
                <p className="text-xs text-gray-500">
                  Taken: {takenValues.join(", ")}
                </p>
              )}
              {formData.sort_order &&
                takenValues.includes(formData.sort_order) && (
                  <p className="text-xs text-red-500">
                    ⚠ This order value is already taken
                  </p>
                )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-linear-to-r from-black to-gray-900 px-6 py-3 font-semibold text-white hover:shadow-lg"
            >
              {mode === "create" ? "Create Category" : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
