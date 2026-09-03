import AdminShell from "@/components/admin/AdminShell";
import { getAdminProfileRole, isMasterRole } from "@/lib/admin-auth";
import type { Database } from "@/lib/database.types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export const metadata = {
  title: "Onyx | Admin Dashboard",
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: Awaited<ReturnType<typeof getAdminProfileRole>> = null;
  if (user) {
    try {
      role = await getAdminProfileRole(supabase, user.id);
    } catch (error) {
      console.error("Failed to load admin role for nav:", error);
    }
  }

  return (
    <div className="flex min-h-screen min-w-0 overflow-x-hidden bg-gray-50">
      <Toaster position="top-center" />
      <AdminShell isMaster={isMasterRole(role)}>{children}</AdminShell>
    </div>
  );
}
