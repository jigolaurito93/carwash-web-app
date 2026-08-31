"use server";

import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import { welcomeSchema } from "@/lib/validations/welcome-schema";

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

function parseWelcomeForm(formData: FormData) {
  return welcomeSchema.safeParse({
    headline: String(formData.get("headline") ?? ""),
    tagline: String(formData.get("tagline") ?? ""),
    intro: String(formData.get("intro") ?? ""),
    subheading: String(formData.get("subheading") ?? ""),
    body_paragraphs: formData
      .getAll("body_paragraphs")
      .map((value) => String(value)),
    cta_label: String(formData.get("cta_label") ?? ""),
    cta_href: String(formData.get("cta_href") ?? ""),
    image_path: String(formData.get("image_path") ?? ""),
    image_alt: String(formData.get("image_alt") ?? ""),
  });
}

export async function updateWelcomeContent(formData: FormData) {
  const parsed = parseWelcomeForm(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid welcome content.",
    };
  }

  const supabase = await getSupabase();
  const { error } = await supabase
    .from("welcome_content")
    .update({
      headline: parsed.data.headline,
      tagline: parsed.data.tagline,
      intro: parsed.data.intro,
      subheading: parsed.data.subheading,
      body_paragraphs: [...parsed.data.body_paragraphs],
      cta_label: parsed.data.cta_label,
      cta_href: parsed.data.cta_href,
      image_path: parsed.data.image_path,
      image_alt: parsed.data.image_alt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) {
    console.error("Failed to update welcome content:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/welcome");
  revalidatePath("/");
  return { success: true };
}
