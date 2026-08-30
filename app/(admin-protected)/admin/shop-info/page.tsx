import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import Link from "next/link";
import { LiaLongArrowAltLeftSolid } from "react-icons/lia";
import ShopHoursEditor from "@/components/admin/ShopHoursEditor";
import ShopInfoForm from "@/components/admin/ShopInfoForm";

const ShopInfo = async () => {
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

  const { data: shopInfo, error: shopInfoError } = await supabase
    .from("shop_info")
    .select("*")
    .single();

  const { data: shopHours, error: shopHoursError } = await supabase
    .from("shop_hours")
    .select("*")
    .order("id", { ascending: true });

  if (shopInfoError || !shopInfo) {
    return <div>Failed to load shop info.</div>;
  }

  return (
    <div className="p-10">
      <div className="mb-12 flex items-center justify-between">
        <h1 className="adminHeader">Account Settings</h1>
        <Link
          href="/admin/dashboard"
          className="btnSaveYlw flex items-center gap-2"
        >
          <LiaLongArrowAltLeftSolid className="h-6 w-6" />
          <span>Back To Dashboard</span>
        </Link>
      </div>

      <ShopInfoForm shopInfo={shopInfo} userEmail={user?.email ?? ""} />

      {shopHoursError || !shopHours ? (
        <div className="mt-12 text-red-500">Failed to load shop hours.</div>
      ) : (
        <ShopHoursEditor hours={shopHours} />
      )}
    </div>
  );
};

export default ShopInfo;
