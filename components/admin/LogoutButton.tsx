"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { IoLogOutOutline } from "react-icons/io5"; // Optional icon

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh(); // Clears server cache
    router.push("/admin/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-2 text-red-400 transition-colors hover:bg-white/10 hover:text-red-300"
    >
      <IoLogOutOutline size={20} />
      <span>Log Out</span>
    </button>
  );
}
