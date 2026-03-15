"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { updateProfile } from "./actions";

export default function AdminProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    }
    getUser();
  }, []);

  // Add this helper function at the top of your component
  function capitalizeDisplayName(name: string): string {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  async function handleAction(formData: FormData) {
    let displayName = formData.get("displayName") as string;

    // Capitalize first letter of each word
    displayName = capitalizeDisplayName(displayName.trim());

    // Optimistically update UI immediately
    setUser((prev) => ({
      ...prev,
      user_metadata: { ...prev.user_metadata, display_name: displayName },
    }));

    const res = await updateProfile(formData);
    if (res.success) {
      toast.success("Profile updated!");
    } else {
      // Revert on error
      toast.error(res.error);
      // Trigger refetch
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
  }

  if (loading) return <div className="p-10 font-questrial">Loading...</div>;

  return (
    <div className="max-w-2xl p-10">
      <h1 className="adminHeader mb-8">Account Settings</h1>

      <form action={handleAction} className="space-y-6">
        {/* Email - Read Only */}
        <div>
          <label className="labelx block text-xs">Email Address</label>
          <input
            type="email"
            disabled
            value={user?.email || ""}
            className="inputx bg-gray-300"
          />
          <p className="mt-2 ml-3 text-xs text-gray-400">
            Email cannot be changed manually
          </p>
        </div>

        {/* Display Name - Editable */}
        <div>
          <label className="labelx block text-xs">Display Name</label>
          <input
            name="displayName"
            defaultValue={user?.user_metadata?.display_name || ""}
            placeholder="e.g. Admin User"
            className="inputx w-full text-sm"
          />
        </div>

        <div className="border-t pt-6">
          <button type="submit" className="btnSaveYlw">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
