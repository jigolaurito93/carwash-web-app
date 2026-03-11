"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Database } from "@/lib/database.types";
import { createOtherService, updateOtherService } from "./actions";

type OtherServiceRow = Database["public"]["Tables"]["otherServices"]["Row"];

type Json = Database["public"]["Tables"]["otherServices"]["Row"]["types"];

function typesToDisplay(types: Json): string {
  if (types == null) return "—";
  if (Array.isArray(types)) return JSON.stringify(types);
  if (typeof types === "string") return types;
  return JSON.stringify(types);
}

function typesToEditValue(types: Json): string {
  if (types == null) return "";
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
        return null;
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

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = parseFormPayload(formData);

    if (!payload) {
      setError("Invalid JSON in Types field.");
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

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = parseFormPayload(formData);

    if (!payload) {
      setError("Invalid JSON in Types field.");
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
          className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Add other service
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

              <th className="px-4 py-3 font-semibold text-gray-700">Active</th>

              <th className="px-4 py-3 font-semibold text-gray-700">Order</th>

              <th className="px-4 py-3 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {!services.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No services yet.
                </td>
              </tr>
            ) : (
              services.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {row.name}
                  </td>

                  <td className="hidden px-4 py-3 text-gray-600 sm:table-cell">
                    {row.subtitle ?? "—"}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {typesToDisplay(row.types)}
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

                  <td className="px-4 py-3 text-gray-600">
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

      {/* The same modal structure can be reused */}
    </>
  );
}
