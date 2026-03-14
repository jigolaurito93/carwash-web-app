"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Database } from "@/lib/database.types";
import { createOtherService, updateOtherService } from "./actions";

type OtherServiceRow = Database["public"]["Tables"]["otherServices"]["Row"];
type Json = Database["public"]["Tables"]["otherServices"]["Row"]["types"];

function typesToDisplay(types: Json) {
  if (!types || !Array.isArray(types))
    return <span className="text-gray-400">—</span>;

  return (
    <div className="flex flex-col gap-1">
      {types.map((t: any, i: number) => {
        const name = t.service || t.name || "Unknown";
        const price = t.price != null ? `$${t.price}` : "";

        return (
          <div key={i} className="flex justify-between gap-4 text-xs">
            <span className="font-medium text-gray-700">{name}</span>
            <span className="text-gray-500 tabular-nums">{price}</span>
          </div>
        );
      })}
    </div>
  );
}

function typesToEditValue(types: Json): string {
  if (types == null) return "";
  // Returns pretty-printed JSON for the textarea
  return JSON.stringify(types, null, 2);
}

type Props = { services: OtherServiceRow[] };

export default function OtherServicesTable({ services }: Props) {
  const router = useRouter();

  const [editing, setEditing] = useState<OtherServiceRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Each row will look like this: { service: "SUV", price: 50 }
  const [dynamicTypes, setDynamicTypes] = useState([
    { service: "", price: "" },
  ]);

  // Reset state when opening the "Create" modal
  const openCreateModal = () => {
    setDynamicTypes([{ service: "", price: "" }]);
    setCreating(true);
  };

  const addTypeRow = () => {
    setDynamicTypes([...dynamicTypes, { service: "", price: "" }]);
  };

  const removeTypeRow = (index: number) => {
    setDynamicTypes(dynamicTypes.filter((_, i) => i !== index));
  };

  const updateTypeRow = (
    index: number,
    field: "service" | "price",
    value: string,
  ) => {
    const newTypes = [...dynamicTypes];
    newTypes[index][field] = value;
    setDynamicTypes(newTypes);
  };

  async function handleCreateSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const formData = new FormData(e.currentTarget);

    // Add (t.service || "") to handle undefined/null cases
    const formattedTypes = dynamicTypes
      .filter((t) => t && (t.service || "").toString().trim() !== "")
      .map((t) => ({
        service: (t.service || "").toString().trim(),
        price: Number(t.price) || 0,
      }));

    const payload = {
      title: (formData.get("title") as string) || "",
      subtitle: (formData.get("subtitle") as string) || null,
      types: formattedTypes, // This is now your JSON array
      is_active: formData.get("is_active") === "on",
      sort_order: Number(formData.get("sort_order")) || null,
    };

    const result = await createOtherService(payload);
    setSaving(false);

    if (result.success) {
      setCreating(false);
      setDynamicTypes([{ service: "", price: "" }]); // Reset state for next time
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

    const formData = new FormData(e.currentTarget);

    // 1. Format the dynamicTypes from state
    const formattedTypes = dynamicTypes
      .filter((t) => t && (t.service || "").toString().trim() !== "") // Safe check: (t.service || "")
      .map((t) => ({
        service: (t.service || "").toString().trim(), // Safe check: (t.service || "")
        price: Number(t.price) || 0,
      }));

    if (formattedTypes.length === 0) {
      setError("Please add at least one vehicle type.");
      setSaving(false);
      return;
    }

    // 2. Build Payload
    const payload = {
      title: (formData.get("title") as string) || "",
      subtitle: (formData.get("subtitle") as string) || null,
      types: formattedTypes,
      is_active: formData.get("is_active") === "on",
      sort_order: Number(formData.get("sort_order")) || 0,
    };

    const result = await updateOtherService(editing.id, payload);
    setSaving(false);

    if (result.success) {
      setEditing(null);
      setDynamicTypes([{ service: "", price: "" }]); // Reset state
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
          className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Add Other Service
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-700">Title</th>
              <th className="hidden px-4 py-3 font-semibold text-gray-700 sm:table-cell">
                Subtitle
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700">Types</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                Active
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                Order
              </th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {!services.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No other services found.
                </td>
              </tr>
            ) : (
              services.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3 align-top font-medium text-gray-900">
                    {row.title}
                  </td>
                  <td className="hidden px-4 py-3 align-top text-gray-600 sm:table-cell">
                    {row.subtitle ?? "—"}
                  </td>
                  <td className="px-4 py-3 align-top text-gray-600">
                    {typesToDisplay(row.types)}
                  </td>
                  <td className="px-4 py-3 text-center">
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
                  <td className="px-4 py-3 text-center text-gray-600">
                    {row.sort_order ?? "—"}
                  </td>
                  {/* ... inside your tbody services.map((row) => ... */}
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        // 1. Mark which row we are editing
                        setEditing(row);

                        // 2. Clean the data so React doesn't crash on 'undefined'
                        const rawTypes = Array.isArray(row.types)
                          ? row.types
                          : [];
                        const safeTypes = rawTypes.map((t: any) => ({
                          // Fallback check: if DB uses 'name', move it to 'service'
                          service: t.service || "",
                          price: t.price || 0,
                        }));

                        // 3. Update the dynamic rows state
                        setDynamicTypes(
                          safeTypes.length > 0
                            ? safeTypes
                            : [{ service: "", price: "" }],
                        );

                        // 4. Clear any old errors
                        setError(null);
                      }}
                      className="rounded border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
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

      {/* CREATE MODAL */}
      {creating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Add Other Service
            </h2>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {error && (
                <p className="rounded border border-red-100 bg-red-50 p-2 text-sm font-bold text-red-600">
                  {error}
                </p>
              )}

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-400 uppercase">
                  Service Title
                </label>
                <input
                  name="title"
                  required
                  className="w-full border-b-2 border-gray-200 py-1 transition-colors outline-none focus:border-yellow-400"
                  placeholder="e.g. Clay Bar Treatment"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-400 uppercase">
                  Subtitle
                </label>
                <input
                  name="subtitle"
                  className="w-full border-b-2 border-gray-200 py-1 transition-colors outline-none focus:border-yellow-400"
                  placeholder="e.g. Removes surface contaminants"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-gray-400 uppercase">
                  Other Services
                </label>

                <div className="space-y-2">
                  {dynamicTypes.map((type, index) => (
                    <div key={index} className="flex items-end gap-2">
                      <div className="flex-1">
                        <input
                          placeholder="Type (e.g. SUV)"
                          value={type.service}
                          onChange={(e) =>
                            updateTypeRow(index, "service", e.target.value)
                          }
                          className="w-full border-b border-gray-300 py-1 text-sm outline-none focus:border-yellow-400"
                        />
                      </div>
                      <div className="w-24">
                        <input
                          placeholder="Price"
                          type="number"
                          value={type.price}
                          onChange={(e) =>
                            updateTypeRow(index, "price", e.target.value)
                          }
                          className="w-full border-b border-gray-300 py-1 text-sm outline-none focus:border-yellow-400"
                        />
                      </div>
                      {dynamicTypes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTypeRow(index)}
                          className="pb-1 text-xs text-red-400 hover:text-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addTypeRow}
                  className="mt-3 text-xs font-bold text-yellow-600 hover:text-yellow-700"
                >
                  + ADD ROW
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold text-gray-400 uppercase">
                    Sort Order
                  </label>
                  <input
                    name="sort_order"
                    type="number"
                    className="w-full border-b-2 border-gray-200 py-1 transition-colors outline-none focus:border-yellow-400"
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    name="is_active"
                    defaultChecked
                    id="create_active"
                    className="h-4 w-4 accent-yellow-400"
                  />
                  <label
                    htmlFor="create_active"
                    className="text-sm font-bold text-gray-700"
                  >
                    Active
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setCreating(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded bg-black px-6 py-2 text-sm font-bold text-white transition-all hover:bg-zinc-800 disabled:bg-gray-400"
                >
                  {saving ? "Saving..." : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Edit {editing.title}
            </h2>
            <form
              onSubmit={handleSubmit}
              key={editing.id}
              className="space-y-4"
            >
              {error && (
                <p className="rounded border border-red-100 bg-red-50 p-2 text-sm font-bold text-red-600">
                  {error}
                </p>
              )}

              {/* ... Name and Subtitle Inputs ... */}

              {/* REPLACED TEXTAREA WITH DYNAMIC ROWS */}
              <div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-gray-400 uppercase">
                    Service Name
                  </label>
                  <input
                    name="title"
                    required
                    defaultValue={editing.title}
                    className="w-full border-b-2 border-gray-200 py-1 transition-colors outline-none focus:border-yellow-400"
                    placeholder="e.g. Clay Bar Treatment"
                  />
                </div>

                <div>
                  <label className="my-2 block text-xs font-bold text-gray-400 uppercase">
                    Subtitle
                  </label>
                  <input
                    name="subtitle"
                    defaultValue={editing.subtitle ?? ""}
                    className="w-full border-b-2 border-gray-200 py-1 transition-colors outline-none focus:border-yellow-400"
                    placeholder="e.g. Removes surface contaminants"
                  />
                </div>
                <label className="my-2 block text-xs font-bold text-gray-400 uppercase">
                  Other Services
                </label>
                <div className="max-h-40 space-y-2 overflow-y-auto pr-2">
                  {dynamicTypes.map((type, index) => (
                    <div key={index} className="flex items-end gap-2">
                      <div className="flex-1">
                        <input
                          placeholder="Type (e.g. SUV)"
                          value={type.service}
                          onChange={(e) =>
                            updateTypeRow(index, "service", e.target.value)
                          }
                          className="w-full border-b border-gray-300 py-1 text-sm outline-none focus:border-yellow-400"
                        />
                      </div>
                      <div className="w-24">
                        <input
                          placeholder="Price"
                          type="number"
                          value={type.price}
                          onChange={(e) =>
                            updateTypeRow(index, "price", e.target.value)
                          }
                          className="w-full border-b border-gray-300 py-1 text-sm outline-none focus:border-yellow-400"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTypeRow(index)}
                        className="px-1 pb-1 text-xs text-red-400 hover:text-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addTypeRow}
                  className="mt-3 text-xs font-bold text-yellow-600 hover:text-yellow-700"
                >
                  + ADD ROW
                </button>
              </div>

              {/* ... Sort Order and Active Checkbox ... */}

              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded bg-yellow-400 px-6 py-2 text-sm font-bold text-black shadow-md hover:bg-yellow-500"
                >
                  {saving ? "Saving..." : "Update Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
