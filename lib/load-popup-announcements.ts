import { cache } from "react";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";
import {
  mapPopupAnnouncement,
  type PopupAnnouncement,
} from "@/lib/popup-announcements";
import { isAnnouncementLive } from "@/lib/announcements";

const SELECT =
  "id, title, message, link_url, kind, layout_key, starts_at, expires_at, closes_on, sort_order, is_active, created_at";

export const getLivePopupAnnouncements = cache(async () => {
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
    .select(SELECT)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.error("Failed to load popup announcements:", error);
    return [] as PopupAnnouncement[];
  }

  return (data ?? [])
    .map(mapPopupAnnouncement)
    .filter((row): row is PopupAnnouncement => row !== null)
    .filter((row) => isAnnouncementLive(row));
});
