"use server";

import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { Database, Json } from "@/lib/database.types";
import { aboutSchema } from "@/lib/validations/about-schema";
import { DEFAULT_WHY_CHOOSE_ICONS } from "@/lib/about-icons";

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

function parseAboutForm(formData: FormData) {
  return aboutSchema.safeParse({
    owner_name: String(formData.get("owner_name") ?? ""),
    story_paragraphs: formData
      .getAll("story_paragraphs")
      .map((value) => String(value)),
    mission: String(formData.get("mission") ?? ""),
    why_choose_us: [0, 1, 2, 3].map((index) => ({
      title: String(formData.get(`why_${index}_title`) ?? ""),
      description: String(formData.get(`why_${index}_description`) ?? ""),
      icon:
        String(formData.get(`why_${index}_icon`) ?? "") ||
        DEFAULT_WHY_CHOOSE_ICONS[index],
    })),
  });
}

export async function updateAboutContent(formData: FormData) {
  const parsed = parseAboutForm(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid about content.",
    };
  }

  const supabase = await getSupabase();
  const { error } = await supabase
    .from("about_content")
    .update({
      owner_name: parsed.data.owner_name,
      story_paragraphs: [...parsed.data.story_paragraphs],
      mission: parsed.data.mission,
      why_choose_us: parsed.data.why_choose_us as Json,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) {
    console.error("Failed to update about content:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/about");
  revalidatePath("/about");
  return { success: true };
}
