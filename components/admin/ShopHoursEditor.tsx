"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { ShopHour } from "@/lib/supabase.types";
import {
  updateShopHours,
  type ShopHourUpdate,
} from "@/app/(admin-protected)/admin/shop-info/actions";

type HourRow = {
  id: number;
  day_name: string;
  open_time: string;
  close_time: string;
  is_closed: boolean;
};

function toTimeInput(value: string | null) {
  if (!value) return "";
  return value.slice(0, 5);
}

function toDbTime(value: string) {
  if (!value) return null;
  return value.length === 5 ? `${value}:00` : value;
}

export default function ShopHoursEditor({ hours }: { hours: ShopHour[] }) {
  const [rows, setRows] = useState<HourRow[]>(
    hours.map((h) => ({
      id: h.id,
      day_name: h.day_name,
      open_time: toTimeInput(h.open_time),
      close_time: toTimeInput(h.close_time),
      is_closed: !!h.is_closed,
    })),
  );
  const [saving, setSaving] = useState(false);

  const updateRow = (id: number, patch: Partial<HourRow>) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
  };

  const handleSave = async () => {
    for (const row of rows) {
      if (!row.is_closed && (!row.open_time || !row.close_time)) {
        toast.error(`Set open and close times for ${row.day_name}, or mark it closed.`);
        return;
      }
    }

    setSaving(true);
    const payload: ShopHourUpdate[] = rows.map((row) => ({
      id: row.id,
      open_time: row.is_closed ? null : toDbTime(row.open_time),
      close_time: row.is_closed ? null : toDbTime(row.close_time),
      is_closed: row.is_closed,
    }));

    const result = await updateShopHours(payload);
    setSaving(false);

    if (result.success) {
      toast.success("Shop hours updated!");
    } else {
      toast.error(result.error || "Failed to update shop hours.");
    }
  };

  return (
    <div className="mt-12 max-w-2xl space-y-6">
      <h2 className="adminHeader">Shop Hours</h2>

      <div className="space-y-4">
        {rows.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[7rem_1fr_1fr_auto]"
          >
            <div>
              <span className="labelx block text-xs">{row.day_name}</span>
            </div>

            <div>
              <label className="labelx block text-xs">Open</label>
              <input
                type="time"
                value={row.open_time}
                disabled={row.is_closed || saving}
                onChange={(e) =>
                  updateRow(row.id, { open_time: e.target.value })
                }
                className="inputx text-sm disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="labelx block text-xs">Close</label>
              <input
                type="time"
                value={row.close_time}
                disabled={row.is_closed || saving}
                onChange={(e) =>
                  updateRow(row.id, { close_time: e.target.value })
                }
                className="inputx text-sm disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60"
              />
            </div>

            <label className="mb-3 flex cursor-pointer items-center gap-2 font-questrial text-sm text-gray-600">
              <input
                type="checkbox"
                checked={row.is_closed}
                disabled={saving}
                onChange={(e) =>
                  updateRow(row.id, { is_closed: e.target.checked })
                }
                className="h-4 w-4 accent-yellow-400"
              />
              Closed
            </label>
          </div>
        ))}
      </div>

      <div className="border-t pt-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="btnSaveYlw disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Hours"}
        </button>
      </div>
    </div>
  );
}
