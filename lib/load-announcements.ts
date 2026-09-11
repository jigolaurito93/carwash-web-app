import { cache } from "react";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import {
  isAnnouncementKind,
  isAnnouncementLive,
  type PublicAnnouncement,
} from "@/lib/announcements";

const FULL_SELECT =
  "id, title, message, link_url, kind, show_in_banner, show_as_modal, starts_at, expires_at, closes_on, sort_order, is_active";

type AnnouncementRow = {
  id: number;
  title?: string | null;
  message: string | null;
  link_url: string | null;
  kind?: string | null;
  show_in_banner?: boolean | null;
  show_as_modal?: boolean | null;
  starts_at?: string | null;
  expires_at?: string | null;
  closes_on?: string | null;
  sort_order: number | null;
  is_active: boolean | null;
};

function mapRow(row: AnnouncementRow): PublicAnnouncement | null {
  if (!row.message) return null;
  return {
    id: row.id,
    title: row.title ?? null,
    message: row.message,
    link_url: row.link_url,
    kind: isAnnouncementKind(row.kind) ? row.kind : "notice",
    show_in_banner: row.show_in_banner ?? true,
    show_as_modal: row.show_as_modal ?? false,
    starts_at: row.starts_at ?? null,
    expires_at: row.expires_at ?? null,
    closes_on: row.closes_on ?? null,
    sort_order: row.sort_order ?? 0,
    is_active: row.is_active ?? false,
  };
}

function missingAnnouncementColumns(message: string | undefined) {
  return /does not exist|schema cache|column/i.test(message ?? "");
}

export async function loadLiveAnnouncements(
  supabase: SupabaseClient<Database>,
): Promise<PublicAnnouncement[]> {
  const full = await supabase
    .from("site_announcements")
    .select(FULL_SELECT)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  let rows: AnnouncementRow[] | null = full.data;

  if (full.error) {
    if (!missingAnnouncementColumns(full.error.message)) {
      console.error("Failed to load announcements:", full.error);
      return [];
    }

    const legacy = await supabase
      .from("site_announcements")
      .select("id, message, link_url, sort_order, is_active")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });

    if (legacy.error) {
      console.error("Failed to load announcements:", legacy.error);
      return [];
    }

    rows = legacy.data;
  }

  return (rows ?? [])
    .map(mapRow)
    .filter((row): row is PublicAnnouncement => row !== null)
    .filter((row) => isAnnouncementLive(row));
}

export const getLiveAnnouncements = cache(async () => {
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

  return loadLiveAnnouncements(supabase);
});
