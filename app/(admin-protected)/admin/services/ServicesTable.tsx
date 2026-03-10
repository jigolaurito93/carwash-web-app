"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Database } from "@/lib/database.types";
import { createService, updateService } from "./actions";

type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
type Json = Database["public"]["Tables"]["services"]["Row"]["types"];

function formatPrice(value: number | null): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function typesToDisplay(types: Json): string {
  if (types == null) return "—";
  if (Array.isArray(types)) return types.join(", ");
  if (typeof types === "string") return types;
  return JSON.stringify(types);
}

function typesToEditValue(types: Json): string {
  if (types == null) return "";
  return JSON.stringify(types, null, 2);
}

type Props = { services: ServiceRow[] };

export default function ServicesTable({ services }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState<ServiceRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function parseFormPayload(formData: FormData) {
    let typesParsed: Json = null;
    const typesRaw = (formData.get("types") as string)?.trim();
    if (typesRaw) {
      try {
        typesParsed = JSON.parse(typesRaw) as Json;
      } catch {
        return null;
      }
    }
    const priceCar = formData.get("price_car");
    const priceMid = formData.get("price_mid");
    const priceFull = formData.get("price_full");
    const sortOrder = formData.get("sort_order");
    return {
      name: (formData.get("name") as string) || "",
      subtitle: (formData.get("subtitle") as string) || null,
      types: typesParsed,
      price_car: priceCar ? Number(priceCar) : null,
      price_mid: priceMid ? Number(priceMid) : null,
      price_full: priceFull ? Number(priceFull) : null,
      is_active: formData.get("is_active") === "on",
      sort_order: sortOrder ? Number(sortOrder) : null,
    };
  }

  async function handleCreateSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = parseFormPayload(formData);
    if (!payload) {
      setError("Invalid JSON in Types field.");
      setSaving(false);
      return;
    }
    const result = await createService(payload);
    setSaving(false);
    if (result.success) {
      setCreating(false);
      router.refresh();
    } else {
      setError(result.error);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;

    setError(null);
    setSaving(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = parseFormPayload(formData);
    if (!payload) {
      setError("Invalid JSON in Types field.");
      setSaving(false);
      return;
    }
    const result = await updateService(editing.id, payload);

    setSaving(false);

    if (result.success) {
      setEditing(null);
      router.refresh();
    } else {
      setError(result.error);
    }
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Add service
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
              <th className="hidden px-4 py-3 font-semibold text-gray-700 sm:table-cell">
                Subtitle
              </th>
              <th className="hidden px-4 py-3 font-semibold text-gray-700 lg:table-cell">
                Types
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700">Car</th>
              <th className="hidden px-4 py-3 font-semibold text-gray-700 md:table-cell">
                Mid
              </th>
              <th className="hidden px-4 py-3 font-semibold text-gray-700 md:table-cell">
                Full
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700">Active</th>
              <th className="hidden px-4 py-3 font-semibold text-gray-700 sm:table-cell">
                Order
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {!services.length ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  No services yet. Click &quot;Add service&quot; to create one.
                </td>
              </tr>
            ) : (
              services.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">
                      {row.name}
                    </span>
                    {row.subtitle && (
                      <span className="mt-1 block text-xs text-gray-500 sm:hidden">
                        {row.subtitle}
                      </span>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">
                    {row.subtitle ?? "—"}
                  </td>
                  <td
                    className="hidden max-w-[200px] truncate px-4 py-3 text-gray-600 lg:table-cell"
                    title={typesToDisplay(row.types)}
                  >
                    {typesToDisplay(row.types)}
                  </td>
                  <td className="px-4 py-3 text-gray-700 tabular-nums">
                    {formatPrice(row.price_car)}
                  </td>
                  <td className="hidden px-4 py-3 text-gray-700 tabular-nums md:table-cell">
                    {formatPrice(row.price_mid)}
                  </td>
                  <td className="hidden px-4 py-3 text-gray-700 tabular-nums md:table-cell">
                    {formatPrice(row.price_full)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        row.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {row.is_active ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">
                    {row.sort_order ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setEditing(row)}
                      className="rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {creating && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !saving && setCreating(false)}
        >
          <div
            className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-bold">Add service</h2>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {error && (
                <div className="rounded bg-red-50 p-2 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  name="name"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Subtitle
                </label>
                <input
                  name="subtitle"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Types (JSON)
                </label>
                <textarea
                  name="types"
                  rows={4}
                  className="w-full rounded border border-gray-300 px-3 py-2 font-mono text-sm"
                  placeholder='["Feature one", "Feature two"]'
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Price Car
                  </label>
                  <input
                    name="price_car"
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Price Mid
                  </label>
                  <input
                    name="price_mid"
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Price Full
                  </label>
                  <input
                    name="price_full"
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  name="is_active"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Sort order
                </label>
                <input
                  name="sort_order"
                  type="number"
                  min="0"
                  className="w-full max-w-[120px] rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => !saving && setCreating(false)}
                  className="rounded border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? "Adding…" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !saving && setEditing(null)}
        >
          <div
            className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-bold">Edit service</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded bg-red-50 p-2 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  name="name"
                  defaultValue={editing.name}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Subtitle
                </label>
                <input
                  name="subtitle"
                  defaultValue={editing.subtitle ?? ""}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Types (JSON)
                </label>
                <textarea
                  name="types"
                  defaultValue={typesToEditValue(editing.types)}
                  rows={4}
                  className="w-full rounded border border-gray-300 px-3 py-2 font-mono text-sm"
                  placeholder='["Feature one", "Feature two"]'
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Price Car
                  </label>
                  <input
                    name="price_car"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={editing.price_car ?? ""}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Price Mid
                  </label>
                  <input
                    name="price_mid"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={editing.price_mid ?? ""}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Price Full
                  </label>
                  <input
                    name="price_full"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={editing.price_full ?? ""}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  name="is_active"
                  type="checkbox"
                  defaultChecked={editing.is_active}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Sort order
                </label>
                <input
                  name="sort_order"
                  type="number"
                  min="0"
                  defaultValue={editing.sort_order ?? ""}
                  className="w-full max-w-[120px] rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => !saving && setEditing(null)}
                  className="rounded border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
