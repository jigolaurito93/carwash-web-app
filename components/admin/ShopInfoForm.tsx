"use client";

import { useState, FormEvent } from "react";
import { toast } from "sonner";
import { normalizeStateCode, US_STATES } from "@/lib/us-states";
import type { ShopInfo } from "@/lib/supabase.types";
import { handleAction } from "@/app/(admin-protected)/admin/shop-info/actions";

export default function ShopInfoForm({ shopInfo }: { shopInfo: ShopInfo }) {
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await handleAction(formData);

      if (result.success) {
        toast.success("Shop info updated!");
      } else {
        toast.error(result.error || "Failed to update shop info.");
      }
    } catch {
      toast.error("Failed to update shop info.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="labelx block text-xs">Email Address</label>
        <input
          type="email"
          defaultValue={shopInfo?.email || ""}
          className="inputx text-sm"
          disabled
        />
      </div>

      <div>
        <label className="labelx block text-xs">Phone</label>
        <input
          name="phone"
          defaultValue={shopInfo?.phone || ""}
          className="inputx w-full text-sm"
          disabled={saving}
        />
      </div>

      <div className="space-y-6">
        <h2 className="adminHeader">Address</h2>
        <div>
          <label className="labelx block text-xs">Address Line 1</label>
          <input
            name="address1"
            defaultValue={shopInfo?.address1 || ""}
            className="inputx w-full text-sm"
            disabled={saving}
          />
        </div>

        <div>
          <label className="labelx block text-xs">Address Line 2</label>
          <input
            name="address2"
            defaultValue={shopInfo?.address2 || ""}
            className="inputx w-full text-sm"
            disabled={saving}
          />
        </div>

        <div>
          <label className="labelx block text-xs">City</label>
          <input
            name="city"
            defaultValue={shopInfo?.city || ""}
            className="inputx w-full text-sm"
            disabled={saving}
          />
        </div>

        <div>
          <label className="labelx block text-xs">State</label>
          <select
            name="state"
            defaultValue={normalizeStateCode(shopInfo?.state)}
            className="inputx w-full text-sm"
            required
            disabled={saving}
          >
            <option value="" disabled>
              Select a state
            </option>
            {US_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="labelx block text-xs">Zip</label>
          <input
            name="zip"
            defaultValue={shopInfo?.zip || ""}
            className="inputx w-full text-sm"
            disabled={saving}
          />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="adminHeader">Social Media</h2>
        <div>
          <label className="labelx block text-xs">Facebook Link</label>
          <input
            name="facebook"
            defaultValue={shopInfo?.facebook || ""}
            className="inputx w-full text-sm"
            disabled={saving}
          />
        </div>
        <div>
          <label className="labelx block text-xs">Twitter Link</label>
          <input
            name="twitter"
            defaultValue={shopInfo?.twitter || ""}
            className="inputx w-full text-sm"
            disabled={saving}
          />
        </div>
        <div>
          <label className="labelx block text-xs">Instagram Link</label>
          <input
            name="instagram"
            defaultValue={shopInfo?.instagram || ""}
            className="inputx w-full text-sm"
            disabled={saving}
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <button
          type="submit"
          disabled={saving}
          className="btnSaveYlw disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
