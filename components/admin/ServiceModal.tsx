// components/admin/ServiceModal.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FiX } from "react-icons/fi";
import { toast } from "sonner";

type Category = {
  id: number;
  name: string;
  // card_layout removed here too; category doesn’t control layout
};

type Service = {
  id: number;
  name: string;
  description: string | null;
  category_id: number;
  card_layout: "layout1" | "layout2" | null;
  layout1_data: {
    includes: string[];
    small_car_price: number;
    medium_car_price: number;
    large_car_price: number;
  } | null;
  layout2_data: {
    items: Record<string, number>;
  } | null;
  is_active: boolean;
  sort_order: number | null;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  service?: Service;
  categories: Category[];
};

function parseLayout2Items(raw: string = ""): Record<string, number> {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce<Record<string, number>>((acc, line) => {
      const [name, priceStr] = line.split("=");
      const nameTrimmed = name?.trim();
      const price = Number(priceStr?.trim());

      if (nameTrimmed && !isNaN(price) && price >= 0) {
        acc[nameTrimmed] = price;
      }
      return acc;
    }, {});
}

export default function ServiceModal({
  isOpen,
  onClose,
  mode,
  service,
  categories,
}: Props) {
  const [formData, setFormData] = useState({
    name: mode === "create" ? "" : service?.name || "",
    description: mode === "create" ? "" : service?.description || "",
    category_id: mode === "create" ? "" : service?.category_id.toString() || "",
    layout: mode === "create" ? "layout1" : service?.card_layout || "layout1",
    sort_order: mode === "create" ? "" : service?.sort_order?.toString() || "",
    // layout1
    layout1_includes: service?.layout1_data?.includes
      ? service.layout1_data.includes.filter((i) => i.trim()).join("\n")
      : "",
    layout1_small: service?.layout1_data?.small_car_price ?? 0,
    layout1_medium: service?.layout1_data?.medium_car_price ?? 0,
    layout1_large: service?.layout1_data?.large_car_price ?? 0,
    // layout2
    layout2_items: (() => {
      const items = service?.layout2_data?.items || {};
      return Object.entries(items)
        .filter(
          ([name, price]) =>
            typeof name === "string" && typeof price === "number",
        )
        .map(([name, price]) => `${name}=${price.toFixed(2)}`)
        .join("\n");
    })(),
  });

  const [takenValues, setTakenValues] = useState<number[]>([]);
  const [nextAvailable, setNextAvailable] = useState<number>(1);

  useEffect(() => {
    const fetchSortOrderValues = async () => {
      if (!formData.category_id) return;

      const { data } = await supabase
        .from("services1")
        .select("sort_order")
        .eq("category_id", Number(formData.category_id))
        .neq("id", mode === "edit" ? service?.id : -1);

      const taken = (data || [])
        .map((d) => d.sort_order)
        .filter((s) => s !== null)
        .sort((a, b) => a - b);
      setTakenValues(taken);

      // Find next available (max + 10)
      const maxValue = taken.length > 0 ? Math.max(...taken) : 0;
      setNextAvailable(maxValue + 10);
    };

    if (isOpen && formData.category_id) {
      fetchSortOrderValues();
    }
  }, [isOpen, formData.category_id, mode, service?.id]);

  const isLayout1 = formData.layout === "layout1";
  const isLayout2 = formData.layout === "layout2";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const sortOrderValue = formData.sort_order
      ? Number(formData.sort_order)
      : nextAvailable;

    // Validate sort_order is not taken for this category (unless it's the same service being edited)
    if (takenValues.includes(sortOrderValue)) {
      toast.error(
        `Sort order ${sortOrderValue} is already taken for this category.`,
      );
      return;
    }

    const basePayload = {
      name: formData.name,
      description: formData.description || null,
      category_id: Number(formData.category_id),
      card_layout: formData.layout as "layout1" | "layout2" | null,
      sort_order: sortOrderValue,
      is_active: true,
    };

    const payload = isLayout1
      ? {
          ...basePayload,
          layout1_data: {
            includes: formData.layout1_includes
              .split("\n")
              .filter((i) => i.trim()),
            small_car_price: Number(formData.layout1_small),
            medium_car_price: Number(formData.layout1_medium),
            large_car_price: Number(formData.layout1_large),
          },
          layout2_data: null,
        }
      : isLayout2
        ? {
            ...basePayload,
            layout1_data: null,
            layout2_data: {
              items: parseLayout2Items(formData.layout2_items),
            },
          }
        : {
            ...basePayload,
            layout1_data: null,
            layout2_data: null,
          };

    let error;
    if (mode === "create") {
      const { error: err } = await supabase.from("services1").insert(payload);
      error = err;
    } else {
      const id = service!.id;
      const { error: err } = await supabase
        .from("services1")
        .update(payload)
        .eq("id", id);
      error = err;
    }

    if (!error) {
      toast.success(
        mode === "create" ? "Service created!" : "Service updated!",
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
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === "create" ? "Create Service" : "Edit Service"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Name *
            </label>
            <input
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500"
              placeholder="Regular Wash"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Quick description..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Category *
            </label>
            <select
              required
              value={formData.category_id}
              onChange={(e) =>
                setFormData({ ...formData, category_id: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choose category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Sort Order
            </label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) =>
                setFormData({ ...formData, sort_order: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500"
              placeholder={`Suggested: ${nextAvailable}`}
            />
            {takenValues.length > 0 && (
              <p className="mt-1 text-xs text-gray-500">
                Taken values: {takenValues.join(", ")}
              </p>
            )}
            {formData.sort_order &&
              takenValues.includes(Number(formData.sort_order)) && (
                <p className="mt-1 text-xs text-red-500">
                  This sort order is already taken for this category.
                </p>
              )}
          </div>

          {/* Layout (now user choice per service) */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Card Layout *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="layout"
                  value="layout1"
                  checked={formData.layout === "layout1"}
                  onChange={(e) =>
                    setFormData({ ...formData, layout: e.target.value })
                  }
                />
                Layout 1 (Package)
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="layout"
                  value="layout2"
                  checked={formData.layout === "layout2"}
                  onChange={(e) =>
                    setFormData({ ...formData, layout: e.target.value })
                  }
                />
                Layout 2 (Add‑ons)
              </label>
            </div>
          </div>

          {/* Layout 1 fields */}
          {isLayout1 && (
            <div className="border-t pt-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Layout 1 Data (Package)
              </h3>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  What&apos;s included (one per line)
                </label>
                <textarea
                  value={formData.layout1_includes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      layout1_includes: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 p-3"
                  rows={4}
                  placeholder="Hand Exterior Wash & Dry
Basic Interior Vacuum (Floors & Seats)
Window Cleaning (Inside & Out)
Dusting of Dashboard"
                />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Small Car
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.layout1_small}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        layout1_small: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 p-3"
                    placeholder="14.99"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Medium Car
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.layout1_medium}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        layout1_medium: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 p-3"
                    placeholder="19.99"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Large Car
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.layout1_large}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        layout1_large: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 p-3"
                    placeholder="24.99"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Layout 2 fields */}
          {isLayout2 && (
            <div className="border-t pt-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Layout 2 Data (Add‑ons)
              </h3>

              <p className="mb-2 text-sm text-gray-600">
                Format: <code className="text-xs">Name=Value</code> (one per
                line, e.g. <code>Wax=5.00</code>)
              </p>
              <textarea
                value={formData.layout2_items}
                onChange={(e) =>
                  setFormData({ ...formData, layout2_items: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 p-3"
                rows={6}
                placeholder="Tire Dressing=5.00
Window Cleaning=5.00
Paint Protection & Sealant (Cars)=120.00
Paint Protection & Sealant (Mid Size)=150.00
Paint Protection & Sealant (Full Size)=180.00"
              />
            </div>
          )}

          <div className="flex justify-end gap-4 pt-6">
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
              {mode === "create" ? "Create Service" : "Update Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
