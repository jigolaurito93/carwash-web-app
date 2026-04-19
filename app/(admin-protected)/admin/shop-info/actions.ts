"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function handleAction(formData: FormData) {
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address1 = formData.get("address1") as string;

  const { error } = await supabase
    .from("shopInfo") // or your actual table name
    .update({
      email: email,
      phone: phone,
      address1: address1,
    })
    .eq("id", 1); // or the correct shop id

  if (error) {
    console.error("Failed to update shop info:", error);
    throw error;
  }

  revalidatePath("/admin/shop-info");
}
