"use server";

import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import { popupAnnouncementSchema } from "@/lib/validations/popup-announcement-schema";

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

function revalidatePopups() {
  revalidatePath("/admin/popups");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/services");
  revalidatePath("/gallery");
  revalidatePath("/contact");
}

function parsePopupForm(formData: FormData) {
  return popupAnnouncementSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    message: String(formData.get("message") ?? ""),
    kind: String(formData.get("kind") ?? "notice"),
    layout_key: String(formData.get("layout_key") ?? "default"),
    link_url: String(formData.get("link_url") ?? ""),
    sort_order: Number(formData.get("sort_order")),
    is_active:
      formData.get("is_active") === "on" ||
      formData.get("is_active") === "true",
    starts_at: String(formData.get("starts_at") ?? ""),
    expires_at: String(formData.get("expires_at") ?? ""),
    closes_on: String(formData.get("closes_on") ?? ""),
  });
}

function saveErrorMessage(message: string) {
  if (/does not exist|schema cache|column/i.test(message)) {
    return "Run supabase/popup-announcements.sql in the Supabase SQL editor, then try again.";
  }
  return message;
}

export async function createPopupAnnouncement(formData: FormData) {
  const parsed = parsePopupForm(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid popup.",
    };
  }

  const supabase = await getSupabase();
  const { error } = await supabase.from("popup_announcements").insert({
    ...parsed.data,
    closes_on: parsed.data.kind === "closure" ? parsed.data.closes_on : null,
  });

  if (error) {
    console.error("Failed to create popup announcement:", error);
    return { success: false, error: saveErrorMessage(error.message) };
  }

  revalidatePopups();
  return { success: true };
}

export async function updatePopupAnnouncement(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id) || id <= 0) {
    return { success: false, error: "Invalid popup." };
  }

  const parsed = parsePopupForm(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid popup.",
    };
  }

  const supabase = await getSupabase();
  const { error } = await supabase
    .from("popup_announcements")
    .update({
      ...parsed.data,
      closes_on: parsed.data.kind === "closure" ? parsed.data.closes_on : null,
    })
    .eq("id", id);

  if (error) {
    console.error("Failed to update popup announcement:", error);
    return { success: false, error: saveErrorMessage(error.message) };
  }

  revalidatePopups();
  return { success: true };
}

export async function togglePopupAnnouncementActive(
  id: number,
  is_active: boolean,
) {
  if (!Number.isFinite(id) || id <= 0) {
    return { success: false, error: "Invalid popup." };
  }

  const supabase = await getSupabase();
  const { error } = await supabase
    .from("popup_announcements")
    .update({ is_active })
    .eq("id", id);

  if (error) {
    console.error("Failed to toggle popup announcement:", error);
    return { success: false, error: saveErrorMessage(error.message) };
  }

  revalidatePopups();
  return { success: true };
}

export async function deletePopupAnnouncement(id: number) {
  if (!Number.isFinite(id) || id <= 0) {
    return { success: false, error: "Invalid popup." };
  }

  const supabase = await getSupabase();
  const { error } = await supabase
    .from("popup_announcements")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete popup announcement:", error);
    return { success: false, error: error.message };
  }

  revalidatePopups();
  return { success: true };
}
