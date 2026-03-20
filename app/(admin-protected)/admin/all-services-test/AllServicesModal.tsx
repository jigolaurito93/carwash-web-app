"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FiX } from "react-icons/fi";
import type { Database } from "@/lib/database.types";

type ServiceRow = Database["public"]["Tables"]["all_services"]["Row"];

interface AllServicesModalProps {
  service: ServiceRow | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AllServicesModal({
  service,
  onClose,
  onSuccess,
}: AllServicesModalProps) {
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [size, setSize] = useState("");

  useEffect(() => {
    if (service) {
      setName(service.name);
      setPrice(
        typeof service.price === "string"
          ? Number(service.price)
          : service.price || 0,
      );
      setSize(""); // services_all view doesn't have 'size' field
    } else {
      setName("");
      setPrice(0);
      setSize("");
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // TODO: Call your server actions here
    // const result = await updateAllServiceRow(service?.id, { name, price, size });

    toast.success(service ? "Service updated!" : "Service created!");
    onSuccess();
    onClose();
  };

  const isEdit = !!service;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? "Edit Service" : "New Service"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="mb-2 block text-xs font-bold tracking-wide text-gray-500 uppercase">
              Service Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-lg shadow-sm focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 focus:outline-none"
              placeholder="Regular Wash (Small)"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-xs font-bold tracking-wide text-gray-500 uppercase">
                Price
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 px-12 py-3 text-lg shadow-sm focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 focus:outline-none"
                  placeholder="25.00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold tracking-wide text-gray-500 uppercase">
                Size
              </label>
              <input
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-lg shadow-sm focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 focus:outline-none"
                placeholder="small"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg px-8 py-3 font-bold text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-black px-8 py-3 font-bold text-white shadow-lg hover:bg-zinc-800 disabled:opacity-50"
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
