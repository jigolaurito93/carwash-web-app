import AdminPageHeader from "@/components/admin/AdminPageHeader";
import InviteAdmin from "@/components/admin/InviteAdmin";
import { getAdminProfileRole, isMasterRole } from "@/lib/admin-auth";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Database } from "@/lib/database.types";

export default async function InviteAdminPage() {
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

  if (!user) {
    redirect("/admin/login");
  }

  const role = await getAdminProfileRole(supabase, user.id);
  if (!isMasterRole(role)) {
    redirect("/admin/dashboard");
  }

  return (
    <div>
      <AdminPageHeader title="Invite Admin" />
      <InviteAdmin />
    </div>
  );
}
