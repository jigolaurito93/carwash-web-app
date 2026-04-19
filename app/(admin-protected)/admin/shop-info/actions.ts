"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function handleAction(formData: FormData) {
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address1 = formData.get("address1") as string;
  const address2 = formData.get("address2") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const zip = formData.get("zip") as string;
  const facebook = formData.get("facebook") as string;
  const twitter = formData.get("twitter") as string;
  const instagram = formData.get("instagram") as string;

  const { error } = await supabase
    .from("shop_info") // same as your select
    .update({
      email,
      phone,
      address1,
      address2,
      city,
      state,
      zip,
      facebook,
      twitter,
      instagram,
    })
    .eq("id", 1); // or the correct shop id

  if (error) {
    console.error("Failed to update shop info:", error);
    throw error;
  }

  revalidatePath("/admin/shop-info");
}
