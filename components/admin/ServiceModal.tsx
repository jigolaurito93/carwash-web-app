// components/admin/ServiceModal.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { FiX } from "react-icons/fi";
import { toast } from "sonner";

type Category = {
  id: number;
  name: string;
  card_layout: "layout1" | "layout2";
};

type Service = {
  id: number;
  name: string;
  description: string | null;
  category_id: number;
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
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  service?: Service; // `edit` only
  categories: Category[]; // to populate the category dropdown
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

      // Only include valid entries
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

  const currentCategory = categories.find(
    (c) => c.id === Number(formData.category_id),
  );
  const isLayout1 = currentCategory?.card_layout === "layout1";
  const isLayout2 = currentCategory?.card_layout === "layout2";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const basePayload = {
      name: formData.name,
      description: formData.description || null,
      category_id: Number(formData.category_id),
      is_active: true,
    };

    const payload =
      isLayout1 && currentCategory
        ? {
            ...basePayload,
            layout1_data: {
              includes: isLayout1
                ? formData.layout1_includes.split("\n").filter((i) => i.trim())
                : [],
              small_car_price: Number(formData.layout1_small),
              medium_car_price: Number(formData.layout1_medium),
              large_car_price: Number(formData.layout1_large),
            },
            layout2_data: null,
          }
        : isLayout2 && currentCategory
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
        className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl"
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
                  {cat.name} ({cat.card_layout})
                </option>
              ))}
            </select>
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
                  placeholder="Hand wash exterior\nBasic vacuum\nWindow cleaning"
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
                    placeholder="19.99"
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
                    placeholder="24.99"
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
                    placeholder="29.99"
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
                placeholder="Spray Wax=5.00\nTire Shine=3.00"
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
