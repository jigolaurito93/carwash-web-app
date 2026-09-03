import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import TopBannerRotator from "@/components/TopBannerRotator";

const TopBanner = async () => {
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

  const { data } = await supabase
    .from("site_announcements")
    .select("id, message, link_url")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  const announcements = (data ?? [])
    .filter((row) => Boolean(row.message))
    .map((row) => ({
      id: row.id,
      message: row.message as string,
      link_url: row.link_url,
    }));

  if (announcements.length === 0) return null;

  return <TopBannerRotator announcements={announcements} />;
};

export default TopBanner;
