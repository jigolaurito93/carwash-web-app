"use server";

import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers"; // Added this
import type { Database } from "@/lib/database.types";

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

// Inside your existing actions.ts
export async function updateProfile(formData: FormData) {
  const supabase = await getSupabase();
  const displayName = formData.get("displayName") as string;

  const { error } = await supabase.auth.updateUser({
    data: { display_name: displayName },
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/profile");
  return { success: true };
}
