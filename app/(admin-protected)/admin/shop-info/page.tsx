import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { LiaLongArrowAltLeftSolid } from "react-icons/lia";
import ShopHoursEditor from "@/components/admin/ShopHoursEditor";
import ShopInfoForm from "@/components/admin/ShopInfoForm";

const ShopInfo = async () => {
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

      <ShopInfoForm shopInfo={shopInfo} />

      {shopHoursError || !shopHours ? (
        <div className="mt-12 text-red-500">Failed to load shop hours.</div>
      ) : (
        <ShopHoursEditor hours={shopHours} />
      )}
    </div>
  );
};

export default ShopInfo;
