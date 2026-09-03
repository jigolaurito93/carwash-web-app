"use client";

import { inviteAdminUser } from "@/app/(admin-protected)/admin/invite/actions";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

type InviteRole = "admin" | "master";

export default function InviteAdmin() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InviteRole>("admin");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    try {
      const result = await inviteAdminUser({ email, role });
      if (result.success) {
        toast.success(
          role === "master"
            ? `Master admin invite sent to ${result.email}.`
            : `Invite sent to ${result.email}.`,
        );
        setEmail("");
        setRole("admin");
      } else {
        toast.error(result.error || "Failed to send invite.");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to send invite.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-6">
      <p className="font-questrial text-sm text-gray-500">
        Enter an email and choose their access. They will set a password,
        complete a profile, then get CMS access. Master admins can also invite
        other staff.
      </p>

      <div>
        <label htmlFor="invite-email" className="labelx block text-xs">
          Email
        </label>
        <input
          id="invite-email"
          type="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={saving}
          placeholder="staff@onyxwash.com"
          className="inputx w-full text-sm"
        />
      </div>

      <fieldset className="space-y-3">
        <legend className="labelx block text-xs">Access level</legend>
        <label className="flex cursor-pointer items-start gap-3 font-questrial text-sm text-gray-700">
          <input
            type="radio"
            name="role"
            value="admin"
            checked={role === "admin"}
            onChange={() => setRole("admin")}
            disabled={saving}
            className="mt-1"
          />
          <span>
            <span className="font-bold">Regular admin</span>
            <span className="mt-0.5 block text-gray-500">
              Full CMS access. Cannot invite other users.
            </span>
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 font-questrial text-sm text-gray-700">
          <input
            type="radio"
            name="role"
            value="master"
            checked={role === "master"}
            onChange={() => setRole("master")}
            disabled={saving}
            className="mt-1"
          />
          <span>
            <span className="font-bold">Master admin</span>
            <span className="mt-0.5 block text-gray-500">
              Full CMS access, plus the invite page. Use this for the owner or
              managers.
            </span>
          </span>
        </label>
      </fieldset>

      <button
        type="submit"
        disabled={saving || !email.trim()}
        className="btnSaveYlw"
      >
        {saving ? "Sending…" : "Send invite"}
      </button>
    </form>
  );
}
