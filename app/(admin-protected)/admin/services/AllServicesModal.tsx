"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Database } from "@/lib/database.types";
import { toast } from "sonner";
import { createAllServiceRow, updateAllServiceRow } from "./actions";
import { CATEGORIES, SUBCATEGORIES } from "@/data/services";

type AllServiceRow = Database["public"]["Tables"]["services_all"]["Row"];

interface AllServiceModalProps {
  service: AllServiceRow | null; // null = Create Mode, object = Edit Mode
  categories: Array<{ id: string; name: string }>;
  onClose: () => void;
}

const AllServicesModal = ({ service, onClose }: AllServiceModalProps) => {
  const router = useRouter();

  const isEdit = !!service;

  // 1. Logic-specific State
  const [dynamicTypes, setDynamicTypes] = useState(
    Array.isArray(service?.types)
      ? service.types
      : [{ service: "", price: "" }],
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 3. Submission Logic
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const formData = new FormData(e.currentTarget);

    const payload = {
      name: formData.get("name") as string,
      desciption: (formData.get("description") as string) || null,
      price: Number(formData.get("price")) || 0,
      category: formData.get("category") as string,
      sub_category: formData.get("sub_category")?.toString() || null,
      sort_order: Number(formData.get("sort_order")) || 0,
      is_active: formData.get("is_active") === "on",
    };

    const result = isEdit
      ? await updateAllServiceRow(service.id, payload)
      : await createAllServiceRow(payload);

    // --- ADD TOASTS HERE ---
    if (result.success) {
      // Show success message
      toast.success(
        isEdit ? "Service updated successfully" : "New service created",
      );

      router.refresh();
      onClose();
    } else {
      // Show error message via toast (optional, since you already have setError)
      toast.error(result.error);

      setError(result.error);
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
        <h2 className="mb-4 font-questrial text-2xl font-bold text-gray-900">
          {isEdit ? `EDIT: ${service.name}` : "Add Service"}
        </h2>

        <form
          key={service?.id || "create"}
          onSubmit={onSubmit}
          className="space-y-4"
        >
          {error && (
            <p className="rounded border border-red-100 bg-red-50 p-2 text-sm font-bold text-red-600">
              {error}
            </p>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="mb-1 block font-questrial text-xs font-bold text-gray-400 uppercase">
                Service Title
              </label>
              <input
                name="title"
                defaultValue={service?.name || ""}
                required
                className="w-full border border-gray-200 px-2 py-1 shadow-sm transition-colors outline-none focus:border-gray-400"
                placeholder="e.g. Complete Detail"
              />
            </div>

            <div>
              <label className="mb-1 block font-questrial text-xs font-bold text-gray-400 uppercase">
                Description (Optional)
              </label>
              <input
                name="subtitle"
                defaultValue={service?.description || ""}
                className="w-full border border-gray-200 px-2 py-1 shadow-sm transition-colors outline-none focus:border-gray-400"
                placeholder="e.g. Full interior and exterior care"
              />
            </div>
          </div>

          {/* Vehicle Types & Prices */}
          <div className="relative">
            <label className="mb-2 block font-questrial text-xs font-bold text-gray-400 uppercase">
              Services and Pricing
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
                $
              </span>
              <input
                name="price"
                type="number"
                step="0.01"
                defaultValue={service?.price ?? 0}
                className="w-full border border-gray-200 py-2 pr-4 pl-8 shadow-sm outline-none focus:border-gray-300"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex w-full flex-col items-start justify-center gap-2">
            <label
              htmlFor=""
              className="font-questrial text-xs font-bold text-gray-400 uppercase"
            >
              Category
            </label>
            <select
              name="category"
              id="category"
              className="w-full border border-gray-200 px-2 py-2 shadow-sm outline-none focus:border-gray-300"
            >
              {CATEGORIES.map((category, i) => (
                <option key={i} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="mb-1 block font-questrial text-xs font-bold text-gray-400 uppercase">
                Sort Order
              </label>
              <input
                name="sort_order"
                type="number"
                defaultValue={service?.sort_order ?? 0}
                className="w-full border border-gray-200 px-2 py-1 shadow-sm outline-none focus:border-gray-300"
              />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked={service ? service.is_active : true}
                id="other_modal_active"
                className="h-4 w-4 cursor-pointer rounded accent-yellow-400"
              />
              <label
                htmlFor="other_modal_active"
                className="font-questrial text-sm font-bold text-gray-700"
              >
                Active
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 flex justify-end gap-3 border-t pt-6">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 font-questrial text-sm font-medium text-gray-500 transition-colors hover:text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`cursor-pointer rounded px-6 py-2 font-questrial text-sm font-bold tracking-wider shadow-md transition-all active:scale-95 disabled:bg-gray-400 ${
                isEdit
                  ? "bg-yellow-400 text-black hover:bg-yellow-500"
                  : "bg-black text-white hover:bg-zinc-800"
              }`}
            >
              {saving
                ? "Saving..."
                : isEdit
                  ? "Update Service"
                  : "Create Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AllServicesModal;
