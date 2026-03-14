"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Database } from "@/lib/database.types";
import {
  createOtherService,
  updateOtherService,
} from "@/app/(admin-protected)/admin/services/actions";
import { FiPlusCircle } from "react-icons/fi";
import { IoMdCloseCircle } from "react-icons/io";
import { toast } from "sonner";

// Type help from your database schema
type OtherServiceRow = Database["public"]["Tables"]["otherServices"]["Row"];

interface OtherServiceModalProps {
  service: OtherServiceRow | null; // null = Create Mode, object = Edit Mode
  onClose: () => void;
}

export default function OtherServicesModal({
  service,
  onClose,
}: OtherServiceModalProps) {
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

  // 2. Dynamic Row Handlers
  const addRow = () =>
    setDynamicTypes([...dynamicTypes, { service: "", price: "" }]);
  const removeRow = (index: number) =>
    setDynamicTypes(dynamicTypes.filter((_, i) => i !== index));
  const updateRow = (index: number, field: string, value: string) => {
    const next = [...dynamicTypes];
    next[index] = { ...next[index], [field]: value };
    setDynamicTypes(next);
  };

  // 3. Submission Logic
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const formData = new FormData(e.currentTarget);

    const formattedTypes = dynamicTypes
      .filter((t: any) => (t.service || "").trim() !== "")
      .map((t: any) => ({
        service: t.service.trim(),
        price: Number(t.price) || 0,
      }));

    if (formattedTypes.length === 0) {
      setError("Please add at least one vehicle type.");
      setSaving(false);
      return;
    }

    const payload = {
      title: formData.get("title") as string,
      subtitle: (formData.get("subtitle") as string) || null,
      types: formattedTypes,
      sort_order: Number(formData.get("sort_order")) || 0,
      is_active: formData.get("is_active") === "on",
    };

    const result = isEdit
      ? await updateOtherService(service.id, payload)
      : await createOtherService(payload);

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
          {isEdit ? `EDIT: ${service.title}` : "Add Service"}
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
                defaultValue={service?.title || ""}
                required
                className="w-full border border-gray-200 px-2 py-1 shadow-sm transition-colors outline-none focus:border-gray-400"
                placeholder="e.g. Complete Detail
"
              />
            </div>

            <div>
              <label className="mb-1 block font-questrial text-xs font-bold text-gray-400 uppercase">
                Description (Optional)
              </label>
              <input
                name="subtitle"
                defaultValue={service?.subtitle || ""}
                className="w-full border border-gray-200 px-2 py-1 shadow-sm transition-colors outline-none focus:border-gray-400"
                placeholder="e.g. Full interior and exterior care"
              />
            </div>
          </div>

          {/* Vehicle Types & Prices */}
          <div>
            <label className="mb-2 block font-questrial text-xs font-bold text-gray-400 uppercase">
              Services and Pricing
            </label>
            <div className="scrollbar-thin max-h-48 space-y-2 overflow-y-auto pr-2">
              {dynamicTypes.map((type: any, index) => (
                <div key={index} className="flex items-end gap-2">
                  <input
                    placeholder="Service Type (e.g. Clay Bar Treatment)"
                    value={type.service || ""}
                    onChange={(e) =>
                      updateRow(index, "service", e.target.value)
                    }
                    className="flex-1 border border-gray-200 px-2 py-1 shadow-sm outline-none focus:border-gray-300"
                  />
                  <input
                    placeholder="Price"
                    type="number"
                    value={type.price || ""}
                    onChange={(e) => updateRow(index, "price", e.target.value)}
                    className="w-20 border border-gray-200 px-2 py-1 shadow-sm outline-none focus:border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="my-auto cursor-pointer px-1 text-xs text-red-400 hover:text-red-600"
                    title="Remove row"
                  >
                    <IoMdCloseCircle className="h-6 w-6" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addRow}
              className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded border border-gray-400 p-2 font-questrial text-xs font-bold tracking-wider text-gray-500 hover:border-yellow-400 hover:bg-yellow-50 hover:text-yellow-700"
            >
              <FiPlusCircle className="h-4 w-4" />
              ADD VEHICLE OPTION
            </button>
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
}
