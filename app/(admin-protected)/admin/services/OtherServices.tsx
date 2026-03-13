"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Database } from "@/lib/database.types";
import { createOtherService, updateOtherService } from "./actions";

type OtherServiceRow = Database["public"]["Tables"]["otherServices"]["Row"];
type Json = Database["public"]["Tables"]["otherServices"]["Row"]["types"];

function typesToDisplay(types: Json): string {
  if (types == null) return "—";
  if (Array.isArray(types)) return types.join(", ");
  if (typeof types === "string") return types;
  return JSON.stringify(types);
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

  function parseFormPayload(formData: FormData) {
    let typesParsed: Json = null;
    const typesRaw = (formData.get("types") as string)?.trim();

    if (typesRaw) {
      try {
        typesParsed = JSON.parse(typesRaw) as Json;
      } catch {
        return null; // Triggers "Invalid JSON" error
      }
    }

    const sortOrder = formData.get("sort_order");

    return {
      name: (formData.get("name") as string) || "",
      subtitle: (formData.get("subtitle") as string) || null,
      types: typesParsed,
      is_active: formData.get("is_active") === "on",
      sort_order: sortOrder ? Number(sortOrder) : null,
    };
  }

  async function handleCreateSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = parseFormPayload(new FormData(e.currentTarget));

    if (!payload) {
      setError('Invalid JSON format in Types field. Example: ["SUV", "Sedan"]');
      setSaving(false);
      return;
    }

    const result = await createOtherService(payload);
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

    const payload = parseFormPayload(new FormData(e.currentTarget));

    if (!payload) {
      setError("Invalid JSON format in Types field.");
      setSaving(false);
      return;
    }

    const result = await updateOtherService(editing.id, payload);
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
          className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Add Other Service
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
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {row.name}
                  </td>
                  <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">
                    {row.subtitle ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
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
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setEditing(row)}
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
                  Service Name
                </label>
                <input
                  name="name"
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
                <label className="mb-1 block text-xs font-bold text-gray-400 uppercase">
                  Vehicle Types (JSON Array)
                </label>
                <textarea
                  name="types"
                  className="w-full rounded border-2 border-gray-100 bg-gray-50 p-2 font-mono text-sm transition-colors outline-none focus:border-yellow-400"
                  placeholder='["SUV", "Sedan", "Truck"]'
                  rows={3}
                />
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
              Edit {editing.name}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="rounded border border-red-100 bg-red-50 p-2 text-sm font-bold text-red-600">
                  {error}
                </p>
              )}

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-400 uppercase">
                  Service Name
                </label>
                <input
                  name="name"
                  defaultValue={editing.name}
                  required
                  className="w-full border-b-2 border-gray-200 py-1 transition-colors outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-400 uppercase">
                  Subtitle
                </label>
                <input
                  name="subtitle"
                  defaultValue={editing.subtitle ?? ""}
                  className="w-full border-b-2 border-gray-200 py-1 transition-colors outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-400 uppercase">
                  Vehicle Types (JSON Array)
                </label>
                <textarea
                  name="types"
                  defaultValue={typesToEditValue(editing.types)}
                  className="w-full rounded border-2 border-gray-100 bg-gray-50 p-2 font-mono text-sm transition-colors outline-none focus:border-yellow-400"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-bold text-gray-400 uppercase">
                    Sort Order
                  </label>
                  <input
                    name="sort_order"
                    type="number"
                    defaultValue={editing.sort_order ?? 0}
                    className="w-full border-b-2 border-gray-200 py-1 transition-colors outline-none focus:border-yellow-400"
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    name="is_active"
                    defaultChecked={editing.is_active}
                    id="edit_active"
                    className="h-4 w-4 accent-yellow-400"
                  />
                  <label
                    htmlFor="edit_active"
                    className="text-sm font-bold text-gray-700"
                  >
                    Active
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded bg-yellow-400 px-6 py-2 text-sm font-bold text-black shadow-md transition-all hover:bg-yellow-500 disabled:bg-gray-400"
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
