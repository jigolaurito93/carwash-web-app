"use server";

import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import { faqSchema } from "@/lib/validations/faq-schema";

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

function revalidateFaqs() {
  revalidatePath("/admin/faq");
  revalidatePath("/contact");
}

function parseFaqForm(formData: FormData) {
  return faqSchema.safeParse({
    question: String(formData.get("question") ?? ""),
    answer: String(formData.get("answer") ?? ""),
    sort_order: Number(formData.get("sort_order")),
    is_active:
      formData.get("is_active") === "on" ||
      formData.get("is_active") === "true",
  });
}

export async function createFaq(formData: FormData) {
  const parsed = parseFaqForm(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid FAQ.",
    };
  }

  const supabase = await getSupabase();
  const { error } = await supabase.from("faqs").insert(parsed.data);

  if (error) {
    console.error("Failed to create FAQ:", error);
    return { success: false, error: error.message };
  }

  revalidateFaqs();
  return { success: true };
}

export async function updateFaq(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id) || id <= 0) {
    return { success: false, error: "Invalid FAQ." };
  }

  const parsed = parseFaqForm(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid FAQ.",
    };
  }

  const supabase = await getSupabase();
  const { error } = await supabase
    .from("faqs")
    .update(parsed.data)
    .eq("id", id);

  if (error) {
    console.error("Failed to update FAQ:", error);
    return { success: false, error: error.message };
  }

  revalidateFaqs();
  return { success: true };
}

export async function toggleFaqActive(id: number, is_active: boolean) {
  if (!Number.isFinite(id) || id <= 0) {
    return { success: false, error: "Invalid FAQ." };
  }

  const supabase = await getSupabase();
  const { error } = await supabase
    .from("faqs")
    .update({ is_active })
    .eq("id", id);

  if (error) {
    console.error("Failed to toggle FAQ:", error);
    return { success: false, error: error.message };
  }

  revalidateFaqs();
  return { success: true };
}

export async function deleteFaq(id: number) {
  if (!Number.isFinite(id) || id <= 0) {
    return { success: false, error: "Invalid FAQ." };
  }

  const supabase = await getSupabase();
  const { error } = await supabase.from("faqs").delete().eq("id", id);

  if (error) {
    console.error("Failed to delete FAQ:", error);
    return { success: false, error: error.message };
  }

  revalidateFaqs();
  return { success: true };
}
