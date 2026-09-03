"use client";

import { updateAdminProfile } from "@/app/(admin-protected)/admin/profile/actions";
import type { AdminProfile } from "@/lib/app.types";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

type Props = {
  email: string;
  profile: AdminProfile | null;
};

export default function AdminProfileForm({ email, profile }: Props) {
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await updateAdminProfile(formData);

      if (result.success) {
        toast.success("Profile updated!");
      } else {
        toast.error(result.error || "Failed to update profile.");
      }
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="labelx block text-xs">Email Address</label>
        <input
          type="email"
          value={email}
          className="inputx cursor-not-allowed bg-gray-200 text-sm text-gray-500"
          disabled
          readOnly
        />
        <p className="mt-2 ml-1 text-xs text-gray-400">
          Email cannot be changed
        </p>
      </div>

      <div>
        <label className="labelx block text-xs">Access level</label>
        <input
          type="text"
          value={profile?.role === "master" ? "Master admin" : "Regular admin"}
          className="inputx cursor-not-allowed bg-gray-200 text-sm text-gray-500"
          disabled
          readOnly
        />
        <p className="mt-2 ml-1 text-xs text-gray-400">
          Only a master admin can change this when inviting someone
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="profile-first-name" className="labelx block text-xs">
            First name
          </label>
          <input
            id="profile-first-name"
            name="first_name"
            required
            defaultValue={profile?.first_name ?? ""}
            className="inputx w-full text-sm"
            disabled={saving}
          />
        </div>
        <div>
          <label htmlFor="profile-last-name" className="labelx block text-xs">
            Last name
          </label>
          <input
            id="profile-last-name"
            name="last_name"
            required
            defaultValue={profile?.last_name ?? ""}
            className="inputx w-full text-sm"
            disabled={saving}
          />
        </div>
      </div>

      <div>
        <label htmlFor="profile-phone" className="labelx block text-xs">
          Contact number
        </label>
        <input
          id="profile-phone"
          name="phone"
          type="tel"
          required
          defaultValue={profile?.phone ?? ""}
          className="inputx w-full text-sm"
          disabled={saving}
        />
      </div>

      <div>
        <label htmlFor="profile-job-title" className="labelx block text-xs">
          Job title
        </label>
        <input
          id="profile-job-title"
          name="job_title"
          defaultValue={profile?.job_title ?? ""}
          placeholder="e.g. Manager"
          className="inputx w-full text-sm"
          disabled={saving}
        />
      </div>

      <div className="border-t pt-6">
        <button type="submit" disabled={saving} className="btnSaveYlw">
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
