"use server";

import { getAdminProfileRole, isMasterRole } from "@/lib/admin-auth";
import { createServiceRoleClient } from "@/lib/supabase-admin";
import { inviteSchema } from "@/lib/validations/invite-schema";
import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
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

function requestOrigin(headerList: Headers) {
  const host =
    headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "";
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  if (!host) return "http://localhost:3000";
  return `${proto}://${host}`;
}

export async function inviteAdminUser(formData: FormData) {
  const supabase = await getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be signed in." };
  }

  const callerRole = await getAdminProfileRole(supabase, user.id);
  if (!isMasterRole(callerRole)) {
    return { success: false, error: "Only master admins can invite users." };
  }

  const parsed = inviteSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    role: String(formData.get("role") ?? "admin"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Enter a valid email.",
    };
  }

  const { email, role } = parsed.data;

  const headerList = await headers();
  const origin = requestOrigin(headerList);
  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent("/admin/set-password")}`;

  try {
    const admin = createServiceRoleClient();
    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo,
    });

    if (error) {
      const alreadyRegistered =
        /already been registered|already registered/i.test(error.message);
      return {
        success: false,
        error: alreadyRegistered
          ? "That email already has an account."
          : error.message,
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: "Invite was sent, but no user was created.",
      };
    }

    const { error: metaError } = await admin.auth.admin.updateUserById(
      data.user.id,
      {
        app_metadata: {
          ...data.user.app_metadata,
          role,
          password_set: false,
          onboarding_complete: false,
        },
      },
    );

    if (metaError) {
      return { success: false, error: metaError.message };
    }

    return { success: true, email };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Could not send invite.",
    };
  }
}
