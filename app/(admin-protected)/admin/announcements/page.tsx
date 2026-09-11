import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import { isAnnouncementKind } from "@/lib/announcements";
import type { SiteAnnouncement } from "@/lib/app.types";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AnnouncementsAdmin from "@/components/admin/AnnouncementsAdmin";

export default async function AdminAnnouncementsPage() {
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
    .from("site_announcements")
    .select("*")
    .order("sort_order")
    .order("id");

  if (error) {
    return (
      <div className="p-8 font-questrial text-red-600">
        Failed to load announcements. If you just added popup/expiry fields, run{" "}
        <code>supabase/announcements-popup.sql</code> in the Supabase SQL
        editor, then <code>pnpm gen:types</code>.
      </div>
    );
  }

  const announcements = (data ?? []).map((row) => ({
    id: row.id,
    title: row.title ?? null,
    message: row.message ?? "",
    link_url: row.link_url,
    kind: isAnnouncementKind(row.kind) ? row.kind : "notice",
    show_in_banner: row.show_in_banner ?? true,
    show_as_modal: row.show_as_modal ?? false,
    starts_at: row.starts_at,
    expires_at: row.expires_at,
    closes_on: row.closes_on,
    sort_order: row.sort_order ?? 0,
    is_active: row.is_active ?? false,
    created_at: row.created_at,
  })) satisfies SiteAnnouncement[];

  return (
    <div>
      <AdminPageHeader title="Announcements" />
      <AnnouncementsAdmin announcements={announcements} />
    </div>
  );
}
