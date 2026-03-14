"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Database } from "@/lib/database.types";
import { createService, deleteService, updateService } from "./actions";
import { IoMdCloseCircle } from "react-icons/io";
import { FiPlusCircle } from "react-icons/fi";
import { toast } from "sonner";

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
  const [dynamicTypes, setDynamicTypes] = useState<string[]>([""]);

  function parseFormPayload(formData: FormData) {
    // Filter out empty rows
    const typesParsed = dynamicTypes.filter((t) => t.trim() !== "");

    return {
      name: (formData.get("name") as string) || "",
      subtitle: (formData.get("subtitle") as string) || null,
      types: typesParsed, // Use the state array directly
      price_car: Number(formData.get("price_car")) || null,
      price_mid: Number(formData.get("price_mid")) || null,
      price_full: Number(formData.get("price_full")) || null,
      is_active: formData.get("is_active") === "on",
      sort_order: Number(formData.get("sort_order")) || 0,
    };
  }

  const handleCreateClick = () => {
    setDynamicTypes([""]); // Reset for new service
    setCreating(true);
  };

  const handleEditClick = (service: ServiceRow) => {
    const existing = Array.isArray(service.types)
      ? (service.types as string[])
      : [];
    setDynamicTypes(existing.length > 0 ? existing : [""]);
    setEditing(service);
  };

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

  const handleDelete = (id: number, name: string) => {
    toast.custom(
      (t) => (
        <div className="w-87.5 rounded-xl bg-black p-6 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            {/* Warning Icon */}
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-black">
              <span className="text-xl font-bold">!</span>
            </div>

            <h3 className="font-lexend text-lg font-bold text-white">
              Confirm Deletion
            </h3>
            <p className="mt-2 font-questrial text-sm text-gray-400">
              Are you sure you want to remove{" "}
              <span className="text-yellow-400">"{name}"</span>? This cannot be
              undone.
            </p>

            <div className="mt-6 flex w-full gap-3">
              <button
                onClick={() => toast.dismiss(t)}
                className="flex-1 cursor-pointer rounded-md border border-zinc-700 bg-white py-2 font-questrial text-xs font-bold tracking-wider text-black transition-colors hover:bg-zinc-200"
              >
                CANCEL
              </button>
              <button
                onClick={async () => {
                  toast.dismiss(t);
                  const res = await deleteService(id);
                  if (res.success) {
                    toast.success("Service removed.");
                    router.refresh();
                  } else {
                    toast.error("Error: " + res.error);
                  }
                }}
                className="flex-1 cursor-pointer rounded-md bg-red-600 py-2 font-questrial text-xs font-bold tracking-wider text-white transition-all hover:bg-red-500 active:scale-95"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="cursor-pointer rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
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
                    className="hidden max-w-50 truncate px-4 py-3 text-gray-600 lg:table-cell"
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
                    <div className="flex w-20 flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditClick(row)}
                        className="cursor-pointer rounded border border-gray-300 bg-white px-2 py-1 text-xs font-semibold text-gray-700 transition-all hover:bg-yellow-400 hover:text-black"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(row.id, row.name)}
                        className="cursor-pointer rounded border border-red-100 bg-red-50 px-2 py-1 text-xs font-semibold text-red-600 transition-all hover:bg-red-600 hover:text-white"
                      >
                        Delete
                      </button>
                    </div>
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
                <label className="mb-2 block font-questrial text-xs font-bold text-gray-400 uppercase">
                  Service Features
                </label>
                <div className="scrollbar-thin max-h-48 space-y-2 overflow-y-auto pr-2">
                  {dynamicTypes.map((type, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        placeholder="e.g. Hand Wash"
                        value={type}
                        onChange={(e) => {
                          const next = [...dynamicTypes];
                          next[index] = e.target.value;
                          setDynamicTypes(next);
                        }}
                        className="flex-1 border border-gray-200 px-2 py-1 text-sm shadow-sm outline-none focus:border-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setDynamicTypes(
                            dynamicTypes.filter((_, i) => i !== index),
                          )
                        }
                        className="cursor-pointer text-red-400 hover:text-red-600"
                      >
                        <IoMdCloseCircle className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setDynamicTypes([...dynamicTypes, ""])}
                  className="mt-3 flex items-center gap-2 font-questrial text-[10px] font-bold tracking-widest text-gray-500 hover:text-black"
                >
                  <FiPlusCircle /> ADD FEATURE
                </button>
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
                  className="w-full max-w-30 rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => !saving && setCreating(false)}
                  className="cursor-pointer rounded border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="cursor-pointer rounded bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
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
                  className="w-full max-w-30 rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => !saving && setEditing(null)}
                  className="cursor-pointer rounded border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="cursor-pointer rounded bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
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
