import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { LiaLongArrowAltLeftSolid } from "react-icons/lia";
import { handleAction } from "./actions";

// Import the Server Action

const ShopInfo = async () => {
  const { data: shopInfo, error: shopInfoError } = await supabase
    .from("shop_info") // match your table exactly
    .select("*")
    .single();

  if (shopInfoError) {
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

      <form action={handleAction} className="max-w-2xl space-y-6">
        {/* Email - Read Only */}
        <div>
          <label className="labelx block text-xs">Email Address</label>
          <input
            type="email"
            value={shopInfo?.email || ""}
            className="inputx text-sm"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="labelx block text-xs">Phone</label>
          <input
            name="phone"
            defaultValue={shopInfo?.phone || ""}
            className="inputx w-full text-sm"
          />
        </div>

        {/* Address Section */}
        <div className="space-y-6">
          <h2 className="adminHeader">Address</h2>
          {/* Address 1 */}
          <div>
            <label className="labelx block text-xs">Address Line 1</label>
            <input
              name="address1"
              defaultValue={shopInfo?.address1 || ""}
              className="inputx w-full text-sm"
            />
          </div>

          {/* Address 2 */}
          <div>
            <label className="labelx block text-xs">Address Line 2</label>
            <input
              name="address2"
              defaultValue={shopInfo?.address2 || ""}
              className="inputx w-full text-sm"
            />
          </div>

          {/* City */}
          <div>
            <label className="labelx block text-xs">City</label>
            <input
              name="city"
              defaultValue={shopInfo?.city || ""}
              className="inputx w-full text-sm"
            />
          </div>

          {/* State */}
          <div>
            <label className="labelx block text-xs">State</label>
            <input
              name="state"
              defaultValue={shopInfo?.state || ""}
              className="inputx w-full text-sm"
            />
          </div>

          {/* Zip */}
          <div>
            <label className="labelx block text-xs">Zip</label>
            <input
              name="zip"
              defaultValue={shopInfo?.zip || ""}
              className="inputx w-full text-sm"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="adminHeader">Social Media</h2>
          <div>
            <label className="labelx block text-xs">Facebook Link</label>
            <input
              name="facebook"
              defaultValue={shopInfo?.facebook || ""}
              className="inputx w-full text-sm"
            />
          </div>
          <div>
            <label className="labelx block text-xs">Twitter Link</label>
            <input
              name="twitter"
              defaultValue={shopInfo?.twitter || ""}
              className="inputx w-full text-sm"
            />
          </div>
          <div>
            <label className="labelx block text-xs">Instagram Link</label>
            <input
              name="instagram"
              defaultValue={shopInfo?.instagram || ""}
              className="inputx w-full text-sm"
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <button type="submit" className="btnSaveYlw">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShopInfo;
