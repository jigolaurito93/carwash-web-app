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

  async function handleAction(formData: FormData) {
    const res = await updateProfile(formData);
    if (res.success) {
      toast.success("Profile updated!");
    } else {
      toast.error(res.error);
    }
  }

  if (loading) return <div className="p-10 font-questrial">Loading...</div>;

  return (
    <div className="max-w-2xl p-10">
      <h1 className="mb-8 font-lexend text-3xl font-bold tracking-tight text-gray-900 uppercase">
        Account Settings
      </h1>

      <form action={handleAction} className="space-y-6">
        {/* Email - Read Only */}
        <div>
          <label className="mb-1 block font-questrial text-xs font-bold text-gray-400 uppercase">
            Email Address
          </label>
          <input
            type="email"
            disabled
            value={user?.email || ""}
            className="w-full border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-500 outline-none"
          />
          <p className="mt-1 text-[10px] text-gray-400">
            Email cannot be changed manually.
          </p>
        </div>

        {/* Display Name - Editable */}
        <div>
          <label className="mb-1 block font-questrial text-xs font-bold text-gray-400 uppercase">
            Display Name
          </label>
          <input
            name="displayName"
            defaultValue={user?.user_metadata?.display_name || ""}
            placeholder="e.g. Admin User"
            className="w-full border border-gray-200 px-3 py-2 text-sm shadow-sm transition-colors outline-none focus:border-gray-400"
          />
        </div>

        <div className="border-t pt-6">
          <button
            type="submit"
            className="cursor-pointer rounded bg-black px-8 py-2 font-questrial text-sm font-bold tracking-widest text-white shadow-md transition-all hover:bg-zinc-800 active:scale-95"
          >
            SAVE CHANGES
          </button>
        </div>
      </form>
    </div>
  );
}
