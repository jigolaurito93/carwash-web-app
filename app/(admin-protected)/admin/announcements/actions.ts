"use server";

import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import { announcementSchema } from "@/lib/validations/announcement-schema";

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

function revalidateAnnouncements() {
  revalidatePath("/admin/announcements");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/services");
  revalidatePath("/gallery");
  revalidatePath("/contact");
}

function parseAnnouncementForm(formData: FormData) {
  return announcementSchema.safeParse({
    message: String(formData.get("message") ?? ""),
    link_url: String(formData.get("link_url") ?? ""),
    sort_order: Number(formData.get("sort_order")),
    is_active:
      formData.get("is_active") === "on" ||
      formData.get("is_active") === "true",
  });
}

export async function createAnnouncement(formData: FormData) {
  const parsed = parseAnnouncementForm(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid announcement.",
    };
  }

  const supabase = await getSupabase();
  const { error } = await supabase
    .from("site_announcements")
    .insert(parsed.data);

  if (error) {
    console.error("Failed to create announcement:", error);
    return { success: false, error: error.message };
  }

  revalidateAnnouncements();
  return { success: true };
}

export async function updateAnnouncement(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id) || id <= 0) {
    return { success: false, error: "Invalid announcement." };
  }

  const parsed = parseAnnouncementForm(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid announcement.",
    };
  }

  const supabase = await getSupabase();
  const { error } = await supabase
    .from("site_announcements")
    .update(parsed.data)
    .eq("id", id);

  if (error) {
    console.error("Failed to update announcement:", error);
    return { success: false, error: error.message };
  }

  revalidateAnnouncements();
  return { success: true };
}

export async function toggleAnnouncementActive(id: number, is_active: boolean) {
  if (!Number.isFinite(id) || id <= 0) {
    return { success: false, error: "Invalid announcement." };
  }

  const supabase = await getSupabase();
  const { error } = await supabase
    .from("site_announcements")
    .update({ is_active })
    .eq("id", id);

  if (error) {
    console.error("Failed to toggle announcement:", error);
    return { success: false, error: error.message };
  }

  revalidateAnnouncements();
  return { success: true };
}

export async function deleteAnnouncement(id: number) {
  if (!Number.isFinite(id) || id <= 0) {
    return { success: false, error: "Invalid announcement." };
  }

  const supabase = await getSupabase();
  const { error } = await supabase
    .from("site_announcements")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete announcement:", error);
    return { success: false, error: error.message };
  }

  revalidateAnnouncements();
  return { success: true };
}
