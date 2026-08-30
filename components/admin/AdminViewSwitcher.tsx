"use client";

import { cn } from "@/lib/utils";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlineGlobeAlt } from "react-icons/hi2";
import { MdOutlineSpaceDashboard } from "react-icons/md";

export default function AdminViewSwitcher() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const isLogin = pathname === "/admin/login";
  const isAdminView = pathname.startsWith("/admin") && !isLogin;

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    supabase.auth.getUser().then(({ data }) => {
      setIsAdmin(Boolean(data.user));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(Boolean(session?.user));
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!isAdmin || isLogin) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 md:right-6 md:bottom-6">
      <div
        className="flex items-center rounded-full bg-black p-1 shadow-lg ring-1 ring-white/15"
        role="navigation"
        aria-label="Switch between website and admin"
      >
        <Link
          href="/"
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-2 font-questrial text-sm font-medium transition-colors",
            !isAdminView
              ? "bg-yellow-400 text-black"
              : "text-white hover:bg-white/10",
          )}
          aria-current={!isAdminView ? "page" : undefined}
        >
          <HiOutlineGlobeAlt className="size-4" />
          Website
        </Link>
        <Link
          href="/admin/dashboard"
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-2 font-questrial text-sm font-medium transition-colors",
            isAdminView
              ? "bg-yellow-400 text-black"
              : "text-white hover:bg-white/10",
          )}
          aria-current={isAdminView ? "page" : undefined}
        >
          <MdOutlineSpaceDashboard className="size-4" />
          Admin
        </Link>
      </div>
    </div>
  );
}
