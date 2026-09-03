"use server";

import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { invitedAdminRole } from "@/lib/admin-auth";
import type { Database } from "@/lib/database.types";
import { createServiceRoleClient } from "@/lib/supabase-admin";
import { adminProfileSchema } from "@/lib/validations/admin-profile-schema";

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

function parseProfileForm(formData: FormData) {
  return adminProfileSchema.safeParse({
    first_name: String(formData.get("first_name") ?? ""),
    last_name: String(formData.get("last_name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    job_title: String(formData.get("job_title") ?? "").trim() || null,
  });
}

export async function upsertAdminProfile(formData: FormData) {
  const parsed = parseProfileForm(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid profile.",
    };
  }

  const supabase = await getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be signed in." };
  }

  const { error } = await supabase.from("admin_profiles").upsert({
    id: user.id,
    first_name: parsed.data.first_name,
    last_name: parsed.data.last_name,
    phone: parsed.data.phone,
    job_title: parsed.data.job_title,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  try {
    const admin = createServiceRoleClient();
    const invitedRole = invitedAdminRole(
      (user.app_metadata ?? {}) as Record<string, unknown>,
    );

    if (invitedRole) {
      const { error: roleError } = await admin
        .from("admin_profiles")
        .update({ role: invitedRole })
        .eq("id", user.id);

      if (roleError) {
        return { success: false, error: roleError.message };
      }
    }

    const { error: metaError } = await admin.auth.admin.updateUserById(
      user.id,
      {
        app_metadata: {
          ...user.app_metadata,
          onboarding_complete: true,
        },
      },
    );

    if (metaError) {
      return { success: false, error: metaError.message };
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Could not update account.",
    };
  }

  await supabase.auth.refreshSession();
  revalidatePath("/admin/profile");
  return { success: true };
}

export async function completeOnboarding(formData: FormData) {
  return upsertAdminProfile(formData);
}
