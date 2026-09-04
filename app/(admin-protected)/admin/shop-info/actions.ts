"use server";

import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import { normalizeStateCode, US_STATE_CODES } from "@/lib/us-states";
import { z } from "zod";

const shopEmailSchema = z
  .string()
  .trim()
  .email("Enter a valid shop email address.");

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
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
}

export async function handleAction(formData: FormData) {
  const phone = formData.get("phone") as string;
  const emailResult = shopEmailSchema.safeParse(formData.get("email"));
  if (!emailResult.success) {
    return {
      success: false,
      error:
        emailResult.error.issues[0]?.message ??
        "Enter a valid shop email address.",
    };
  }
  const email = emailResult.data;
  const address1 = formData.get("address1") as string;
  const address2 = formData.get("address2") as string;
  const city = formData.get("city") as string;
  const state = normalizeStateCode(formData.get("state") as string);
  const zip = formData.get("zip") as string;
  const facebook = formData.get("facebook") as string;
  const twitter = formData.get("twitter") as string;
  const instagram = formData.get("instagram") as string;

  if (!US_STATE_CODES.includes(state)) {
    return { success: false, error: "Please select a valid US state." };
  }

  const supabase = await getSupabase();
  const { error } = await supabase
    .from("shop_info")
    .update({
      phone,
      email,
      address1,
      address2,
      city,
      state,
      zip,
      facebook,
      twitter,
      instagram,
    })
    .eq("id", 1);

  if (error) {
    console.error("Failed to update shop info:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/shop-info");
  revalidatePath("/");
  revalidatePath("/contact");
  return { success: true };
}

export type ShopHourUpdate = {
  id: number;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
};

export async function updateShopHours(hours: ShopHourUpdate[]) {
  const supabase = await getSupabase();

  for (const hour of hours) {
    const { error } = await supabase
      .from("shop_hours")
      .update({
        open_time: hour.is_closed ? null : hour.open_time,
        close_time: hour.is_closed ? null : hour.close_time,
        is_closed: hour.is_closed,
      })
      .eq("id", hour.id);

    if (error) {
      console.error("Failed to update shop hours:", error);
      return { success: false, error: error.message };
    }
  }

  revalidatePath("/admin/shop-info");
  revalidatePath("/");
  revalidatePath("/contact");
  return { success: true };
}
