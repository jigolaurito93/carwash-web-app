"use server";

import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
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

function revalidateGallery() {
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

export async function revalidateGalleryPages() {
  revalidateGallery();
}

export async function updateGalleryImage(formData: FormData) {
  const id = Number(formData.get("id"));
  const captionRaw = String(formData.get("caption") ?? "").trim();
  const alt_text = String(formData.get("alt_text") ?? "").trim();
  const sort_order = Number(formData.get("sort_order"));

  if (!Number.isFinite(id) || id <= 0 || !Number.isFinite(sort_order)) {
    return { success: false, error: "Invalid caption or sort order." };
  }

  const supabase = await getSupabase();
  const { error } = await supabase
    .from("gallery_images")
    .update({
      caption: captionRaw.length > 0 ? captionRaw : null,
      alt_text,
      sort_order: Math.trunc(sort_order),
    })
    .eq("id", id);

  if (error) {
    console.error("Failed to update gallery image:", error);
    return { success: false, error: error.message };
  }

  revalidateGallery();
  return { success: true };
}

export async function deleteGalleryImage(id: number, storagePath: string) {
  if (!Number.isFinite(id) || id <= 0 || !storagePath) {
    return { success: false, error: "Invalid image." };
  }

  const supabase = await getSupabase();

  const { error: storageError } = await supabase.storage
    .from("gallery")
    .remove([storagePath]);

  if (storageError) {
    console.error("Failed to delete gallery file:", storageError);
    return { success: false, error: storageError.message };
  }

  const { error } = await supabase.from("gallery_images").delete().eq("id", id);

  if (error) {
    console.error("Failed to delete gallery image row:", error);
    return { success: false, error: error.message };
  }

  revalidateGallery();
  return { success: true };
}
