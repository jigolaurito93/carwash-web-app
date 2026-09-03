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

function inviteErrorMessage(message: string) {
  if (/already been registered|already registered/i.test(message)) {
    return "That email already has an account.";
  }
  if (
    /redirect/i.test(message) &&
    /not (allowed|whitelisted|permitted)/i.test(message)
  ) {
    return "Invite redirect URL is not allowed. In Supabase, add http://localhost:3000/auth/callback to Authentication → URL Configuration → Redirect URLs.";
  }
  if (
    /error sending (invite |confirmation )?email|unable to send email|rate limit/i.test(
      message,
    )
  ) {
    return "Supabase could not send the invite email. On the free email provider, invites often only work for team-member addresses, or after you add custom SMTP.";
  }
  return message;
}

export async function inviteAdminUser(input: {
  email: string;
  role: "admin" | "master";
}) {
  try {
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

    const parsed = inviteSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Enter a valid email.",
      };
    }

    const { email, role } = parsed.data;
    const headerList = await headers();
    const origin = requestOrigin(headerList);
    const redirectTo = `${origin}/auth/callback`;

    const admin = createServiceRoleClient();
    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo,
    });

    if (error) {
      console.error("inviteUserByEmail failed:", error.message);
      return { success: false, error: inviteErrorMessage(error.message) };
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
      console.error("Failed to set invited user metadata:", metaError.message);
      return { success: false, error: metaError.message };
    }

    return { success: true, email };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not send invite.";
    console.error("inviteAdminUser failed:", message);
    return { success: false, error: message };
  }
}
