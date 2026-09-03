import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminProfileForm from "@/components/admin/AdminProfileForm";
import type { AdminProfile } from "@/lib/app.types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Database } from "@/lib/database.types";

export default async function AdminProfilePage() {
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

  if (!user?.email) {
    redirect("/admin/login");
  }

  const { data, error } = await supabase
    .from("admin_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return (
      <div className="p-8 font-questrial text-red-600">
        Failed to load profile. Make sure the <code>admin_profiles</code> table
        exists, then run <code>pnpm gen:types</code>.
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader title="Account Setting" />
      <AdminProfileForm
        email={user.email}
        profile={(data as AdminProfile | null) ?? null}
      />
    </div>
  );
}
