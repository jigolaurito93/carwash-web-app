import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import { mapPopupAnnouncement } from "@/lib/popup-announcements";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import PopupsAdmin from "@/components/admin/PopupsAdmin";

export default async function AdminPopupsPage() {
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

  const { data, error } = await supabase
    .from("popup_announcements")
    .select("*")
    .order("sort_order")
    .order("id");

  if (error) {
    return (
      <div className="p-8 font-questrial text-red-600">
        Failed to load popups. Run <code>supabase/popup-announcements.sql</code>{" "}
        in the Supabase SQL editor, then <code>pnpm gen:types</code>.
      </div>
    );
  }

  const popups = (data ?? [])
    .map(mapPopupAnnouncement)
    .filter((row): row is NonNullable<typeof row> => row !== null);

  return (
    <div>
      <AdminPageHeader title="Popup announcements" />
      <PopupsAdmin popups={popups} />
    </div>
  );
}
