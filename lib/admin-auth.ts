import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

export type AdminRole = "admin" | "master";

export function isMasterRole(role: string | null | undefined): boolean {
  return role === "master";
}

export async function getAdminProfileRole(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<AdminRole | null> {
  const { data } = await supabase
    .from("admin_profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (data?.role === "master" || data?.role === "admin") {
    return data.role;
  }

  return null;
}

export function needsPasswordSetup(
  appMetadata: Record<string, unknown> | undefined,
): boolean {
  return appMetadata?.password_set === false;
}

export function isOnboardingComplete(
  appMetadata: Record<string, unknown> | undefined,
): boolean {
  return appMetadata?.onboarding_complete === true;
}

export function invitedAdminRole(
  appMetadata: Record<string, unknown> | undefined,
): AdminRole | null {
  const role = appMetadata?.role;
  if (role === "master" || role === "admin") return role;
  return null;
}

export function safeAdminPath(next: string | null): string {
  if (!next || !next.startsWith("/admin") || next.startsWith("//")) {
    return "/admin/set-password";
  }
  if (next.includes("://")) {
    return "/admin/set-password";
  }
  return next;
}
