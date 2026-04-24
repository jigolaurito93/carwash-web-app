// components/TopBanner.tsx
import { supabase } from "@/lib/supabase";

const TopBanner = async () => {
  const { data } = await supabase
    .from("site_announcements")
    .select("message")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(1)
    .single();

  if (!data?.message) return null;

  return (
    <div className="w-screen bg-black py-2 text-center text-white">
      {data.message}
    </div>
  );
};

export default TopBanner;
