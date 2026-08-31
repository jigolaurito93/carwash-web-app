"use client";

import { useMemo, useState } from "react";
import { FiX } from "react-icons/fi";
import { toast } from "sonner";
import type { CardLayout, Category, ServiceRow } from "@/lib/app.types";
import type { ServiceFormValues } from "@/lib/validations/service-schema";
import {
  createService,
  updateService,
} from "@/app/(admin-protected)/admin/services/actions";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  mode: "create" | "edit";
  service?: ServiceRow;
  categories: Category[];
  services: ServiceRow[];
};

type ServiceFormState = {
  name: string;
  description: string;
  notes: string;
  category_id: string;
  layout: CardLayout;
  sort_order: string;
  is_active: boolean;
  layout3_info: string;
  layout4_info: string;
  layout4_small: number;
  layout4_medium: number;
  layout4_large: number;
  layout1_includes: string;
  layout1_small: number;
  layout1_medium: number;
  layout1_large: number;
  layout2_items: string;
};

const LAYOUT_OPTIONS: { value: CardLayout; label: string }[] = [
  { value: "layout1", label: "Layout 1 (Package)" },
  { value: "layout2", label: "Layout 2 (Add‑ons)" },
  { value: "layout3", label: "Layout 3 (Custom Info)" },
  { value: "layout4", label: "Layout 4 (Info + Prices)" },
];

function isCardLayout(value: string | null | undefined): value is CardLayout {
  return (
    value === "layout1" ||
    value === "layout2" ||
    value === "layout3" ||
    value === "layout4"
  );
}

function initialForm(
  mode: "create" | "edit",
  service?: ServiceRow,
): ServiceFormState {
  const isCreate = mode === "create";
  const items = service?.layout2_data?.items || {};
  const layout: CardLayout =
    !isCreate && service && isCardLayout(service.card_layout)
      ? service.card_layout
      : "layout1";

  return {
    name: isCreate ? "" : service?.name || "",
    description: isCreate ? "" : service?.description || "",
    notes: isCreate ? "" : service?.notes || "",
    category_id: isCreate ? "" : service?.category_id?.toString() || "",
    layout,
    sort_order: isCreate ? "" : service?.sort_order?.toString() || "",
    is_active: isCreate ? true : (service?.is_active ?? true),
    layout3_info: service?.layout3_data || "",
    layout4_info: service?.layout4_data?.info || "",
    layout4_small: service?.layout4_data?.small_car_price ?? 0,
    layout4_medium: service?.layout4_data?.medium_car_price ?? 0,
    layout4_large: service?.layout4_data?.large_car_price ?? 0,
    layout1_includes: service?.layout1_data?.includes
      ? service.layout1_data.includes.filter((item) => item.trim()).join("\n")
      : "",
    layout1_small: service?.layout1_data?.small_car_price ?? 0,
    layout1_medium: service?.layout1_data?.medium_car_price ?? 0,
    layout1_large: service?.layout1_data?.large_car_price ?? 0,
    layout2_items: Object.entries(items)
      .map(([name, price]) => `${name}=${String(price)}`)
      .join("\n"),
  };
}

function parseLayout2Items(
  raw: string,
): { items: Record<string, number> } | { error: string } {
  const items: Record<string, number> = {};
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    const eq = line.indexOf("=");
    if (eq <= 0) {
      return {
        error: `Invalid add-on line: "${line}". Use Name=Value.`,
      };
    }
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim();
    const num = Number(value);
    if (!key || !Number.isFinite(num)) {
      return {
        error: `Invalid add-on line: "${line}". Price must be a number.`,
      };
    }
    items[key] = num;
  }

  return { items };
}

function buildPayload(
  form: ServiceFormState,
  nextAvailable: number,
): ServiceFormValues | { error: string } {
  const sortOrderValue = form.sort_order
    ? Number(form.sort_order)
    : nextAvailable;

  if (!Number.isFinite(sortOrderValue) || !Number.isInteger(sortOrderValue)) {
    return { error: "Sort order must be a whole number." };
  }

  const base = {
    name: form.name,
    description: form.description.trim() || null,
    notes: form.notes.trim() || null,
    category_id: Number(form.category_id),
    sort_order: sortOrderValue,
    is_active: form.is_active,
  };

  switch (form.layout) {
    case "layout1":
      return {
        ...base,
        card_layout: "layout1",
        layout1_data: {
          includes: form.layout1_includes
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
          small_car_price: Number(form.layout1_small),
          medium_car_price: Number(form.layout1_medium),
          large_car_price: Number(form.layout1_large),
        },
        layout2_data: null,
        layout3_data: null,
        layout4_data: null,
      };
    case "layout2": {
      const parsed = parseLayout2Items(form.layout2_items);
      if ("error" in parsed) return parsed;
      return {
        ...base,
        card_layout: "layout2",
        layout1_data: null,
        layout2_data: { items: parsed.items },
        layout3_data: null,
        layout4_data: null,
      };
    }
    case "layout3":
      return {
        ...base,
        card_layout: "layout3",
        layout1_data: null,
        layout2_data: null,
        layout3_data: form.layout3_info.trim() || null,
        layout4_data: null,
      };
    case "layout4":
      return {
        ...base,
        card_layout: "layout4",
        layout1_data: null,
        layout2_data: null,
        layout3_data: null,
        layout4_data: {
          info: form.layout4_info,
          small_car_price: Number(form.layout4_small),
          medium_car_price: Number(form.layout4_medium),
          large_car_price: Number(form.layout4_large),
        },
      };
  }
}

export default function ServiceModal({
  isOpen,
  onClose,
  onSaved,
  mode,
  service,
  categories,
  services,
}: Props) {
  const [formData, setFormData] = useState<ServiceFormState>(() =>
    initialForm(mode, service),
  );
  const [saving, setSaving] = useState(false);

  const { takenValues, nextAvailable } = useMemo(() => {
    const categoryId = Number(formData.category_id);
    if (!Number.isFinite(categoryId) || categoryId <= 0) {
      return { takenValues: [] as number[], nextAvailable: 10 };
    }

    const taken = services
      .filter(
        (row) =>
          row.category_id === categoryId &&
          row.id !== service?.id &&
          row.sort_order != null,
      )
      .map((row) => row.sort_order as number)
      .sort((a, b) => a - b);

    const maxValue = taken.length > 0 ? Math.max(...taken) : 0;
    return { takenValues: taken, nextAvailable: maxValue + 10 };
  }, [formData.category_id, services, service?.id]);

  const isLayout1 = formData.layout === "layout1";
  const isLayout2 = formData.layout === "layout2";
  const isLayout3 = formData.layout === "layout3";
  const isLayout4 = formData.layout === "layout4";

  const closeIfIdle = () => {
    if (saving) return;
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const sortOrderValue = formData.sort_order
      ? Number(formData.sort_order)
      : nextAvailable;

    if (takenValues.includes(sortOrderValue)) {
      toast.error(
        `Sort order ${sortOrderValue} is already taken for this category.`,
      );
      return;
    }

    const payload = buildPayload(formData, nextAvailable);
    if ("error" in payload) {
      toast.error(payload.error);
      return;
    }

    setSaving(true);
    try {
      const result =
        mode === "create"
          ? await createService(payload)
          : await updateService(service!.id, payload);

      if (result.success) {
        toast.success(
          mode === "create" ? "Service created!" : "Service updated!",
        );
        onSaved();
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
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-lexend text-2xl font-bold text-gray-900">
            {mode === "create" ? "Create Service" : "Edit Service"}
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
              value={formData.name}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
              className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500"
              placeholder="Regular Wash"
              disabled={saving}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(event) =>
                setFormData({ ...formData, description: event.target.value })
              }
              className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Quick description..."
              disabled={saving}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(event) =>
                setFormData({ ...formData, notes: event.target.value })
              }
              className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Optional internal notes..."
              disabled={saving}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Category *
            </label>
            <select
              required
              value={formData.category_id}
              onChange={(event) =>
                setFormData({ ...formData, category_id: event.target.value })
              }
              className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500"
              disabled={saving}
            >
              <option value="">-- Choose category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Sort Order
            </label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(event) =>
                setFormData({ ...formData, sort_order: event.target.value })
              }
              className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-blue-500"
              placeholder={`Suggested: ${nextAvailable}`}
              disabled={saving}
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

          <label className="flex items-center gap-2 font-questrial text-sm text-gray-700">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(event) =>
                setFormData({ ...formData, is_active: event.target.checked })
              }
              className="h-4 w-4 accent-yellow-400"
              disabled={saving}
            />
            Active (visible on the services page)
          </label>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Card Layout *
            </label>
            <div className="flex flex-wrap gap-4">
              {LAYOUT_OPTIONS.map((option) => (
                <label key={option.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="layout"
                    value={option.value}
                    checked={formData.layout === option.value}
                    onChange={() =>
                      setFormData({ ...formData, layout: option.value })
                    }
                    disabled={saving}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

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
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      layout1_includes: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 p-3"
                  rows={4}
                  placeholder="Hand Exterior Wash & Dry
Basic Interior Vacuum (Floors & Seats)
Window Cleaning (Inside & Out)
Dusting of Dashboard"
                  disabled={saving}
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
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        layout1_small: Number(event.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 p-3"
                    placeholder="14.99"
                    disabled={saving}
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
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        layout1_medium: Number(event.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 p-3"
                    placeholder="19.99"
                    disabled={saving}
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
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        layout1_large: Number(event.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 p-3"
                    placeholder="24.99"
                    disabled={saving}
                  />
                </div>
              </div>
            </div>
          )}

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
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    layout2_items: event.target.value,
                  })
                }
                className="w-full rounded-xl border border-gray-200 p-3"
                rows={6}
                placeholder="Tire Dressing=5.00
Window Cleaning=5.00
Paint Protection & Sealant (Cars)=120.00
Paint Protection & Sealant (Mid Size)=150.00
Paint Protection & Sealant (Full Size)=180.00"
                disabled={saving}
              />
            </div>
          )}

          {isLayout3 && (
            <div className="border-t pt-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Layout 3 Data (Custom Info)
              </h3>
              <p className="mb-2 text-sm text-gray-600">
                Enter any additional information for this service. Line breaks
                are preserved.
              </p>
              <textarea
                value={formData.layout3_info}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    layout3_info: event.target.value,
                  })
                }
                className="w-full rounded-xl border border-gray-200 p-3"
                rows={6}
                placeholder="Enter custom details, notes, or instructions here..."
                disabled={saving}
              />
            </div>
          )}

          {isLayout4 && (
            <div className="border-t pt-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Layout 4 Data (Info + Prices)
              </h3>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Info
                </label>
                <textarea
                  value={formData.layout4_info}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      layout4_info: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 p-3"
                  rows={4}
                  placeholder="Enter custom details, notes, or instructions here..."
                  disabled={saving}
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
                    value={formData.layout4_small}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        layout4_small: Number(event.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 p-3"
                    placeholder="14.99"
                    disabled={saving}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Medium Car
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.layout4_medium}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        layout4_medium: Number(event.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 p-3"
                    placeholder="19.99"
                    disabled={saving}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Large Car
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.layout4_large}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        layout4_large: Number(event.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 p-3"
                    placeholder="24.99"
                    disabled={saving}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-6">
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
                  ? "Create Service"
                  : "Update Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
