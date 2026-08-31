"use server";

import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { Database, Json } from "@/lib/database.types";
import { categorySchema } from "@/lib/validations/category-schema";
import {
  serviceSchema,
  type ServiceFormValues,
} from "@/lib/validations/service-schema";

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

function revalidateServices() {
  revalidatePath("/admin/services");
  revalidatePath("/services");
}

function toServiceRow(parsed: ServiceFormValues) {
  return {
    name: parsed.name,
    description: parsed.description,
    notes: parsed.notes,
    category_id: parsed.category_id,
    card_layout: parsed.card_layout,
    sort_order: parsed.sort_order,
    is_active: parsed.is_active,
    layout1_data: parsed.layout1_data as Json | null,
    layout2_data: parsed.layout2_data as Json | null,
    layout3_data: parsed.layout3_data,
    layout4_data: parsed.layout4_data as Json | null,
  };
}

async function assertSortOrderAvailable(
  supabase: Awaited<ReturnType<typeof getSupabase>>,
  categoryId: number,
  sortOrder: number,
  excludeId?: number,
) {
  let query = supabase
    .from("services")
    .select("id")
    .eq("category_id", categoryId)
    .eq("sort_order", sortOrder);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query.maybeSingle();
  if (error) {
    return error.message;
  }
  if (data) {
    return `Sort order ${sortOrder} is already taken for this category.`;
  }
  return null;
}

export async function createService(input: unknown) {
  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid service.",
    };
  }

  const supabase = await getSupabase();
  const taken = await assertSortOrderAvailable(
    supabase,
    parsed.data.category_id,
    parsed.data.sort_order,
  );
  if (taken) {
    return { success: false, error: taken };
  }

  const { error } = await supabase
    .from("services")
    .insert(toServiceRow(parsed.data));

  if (error) {
    console.error("Failed to create service:", error);
    return { success: false, error: error.message };
  }

  revalidateServices();
  return { success: true };
}

export async function updateService(id: number, input: unknown) {
  if (!Number.isFinite(id) || id <= 0) {
    return { success: false, error: "Invalid service." };
  }

  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid service.",
    };
  }

  const supabase = await getSupabase();
  const taken = await assertSortOrderAvailable(
    supabase,
    parsed.data.category_id,
    parsed.data.sort_order,
    id,
  );
  if (taken) {
    return { success: false, error: taken };
  }

  const { error } = await supabase
    .from("services")
    .update(toServiceRow(parsed.data))
    .eq("id", id);

  if (error) {
    console.error("Failed to update service:", error);
    return { success: false, error: error.message };
  }

  revalidateServices();
  return { success: true };
}

export async function toggleServiceActive(id: number, is_active: boolean) {
  if (!Number.isFinite(id) || id <= 0) {
    return { success: false, error: "Invalid service." };
  }

  const supabase = await getSupabase();
  const { error } = await supabase
    .from("services")
    .update({ is_active })
    .eq("id", id);

  if (error) {
    console.error("Failed to toggle service:", error);
    return { success: false, error: error.message };
  }

  revalidateServices();
  return { success: true };
}

export async function deleteService(id: number) {
  if (!Number.isFinite(id) || id <= 0) {
    return { success: false, error: "Invalid service." };
  }

  const supabase = await getSupabase();
  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) {
    console.error("Failed to delete service:", error);
    return { success: false, error: error.message };
  }

  revalidateServices();
  return { success: true };
}

async function assertCategorySlugAvailable(
  supabase: Awaited<ReturnType<typeof getSupabase>>,
  slug: string,
  excludeId?: number,
) {
  let query = supabase.from("categories").select("id").eq("slug", slug);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query.maybeSingle();
  if (error) {
    return error.message;
  }
  if (data) {
    return `Slug "${slug}" is already taken.`;
  }
  return null;
}

async function assertCategorySortOrderAvailable(
  supabase: Awaited<ReturnType<typeof getSupabase>>,
  sortOrder: number,
  excludeId?: number,
) {
  let query = supabase
    .from("categories")
    .select("id")
    .eq("sort_order", sortOrder);

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query.maybeSingle();
  if (error) {
    return error.message;
  }
  if (data) {
    return `Sort order ${sortOrder} is already taken.`;
  }
  return null;
}

export async function createCategory(input: unknown) {
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid category.",
    };
  }

  const supabase = await getSupabase();
  const slugTaken = await assertCategorySlugAvailable(
    supabase,
    parsed.data.slug,
  );
  if (slugTaken) {
    return { success: false, error: slugTaken };
  }

  const orderTaken = await assertCategorySortOrderAvailable(
    supabase,
    parsed.data.sort_order,
  );
  if (orderTaken) {
    return { success: false, error: orderTaken };
  }

  const { error } = await supabase.from("categories").insert(parsed.data);

  if (error) {
    console.error("Failed to create category:", error);
    return { success: false, error: error.message };
  }

  revalidateServices();
  return { success: true };
}

export async function updateCategory(id: number, input: unknown) {
  if (!Number.isFinite(id) || id <= 0) {
    return { success: false, error: "Invalid category." };
  }

  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid category.",
    };
  }

  const supabase = await getSupabase();
  const slugTaken = await assertCategorySlugAvailable(
    supabase,
    parsed.data.slug,
    id,
  );
  if (slugTaken) {
    return { success: false, error: slugTaken };
  }

  const orderTaken = await assertCategorySortOrderAvailable(
    supabase,
    parsed.data.sort_order,
    id,
  );
  if (orderTaken) {
    return { success: false, error: orderTaken };
  }

  const { error } = await supabase
    .from("categories")
    .update(parsed.data)
    .eq("id", id);

  if (error) {
    console.error("Failed to update category:", error);
    return { success: false, error: error.message };
  }

  revalidateServices();
  return { success: true };
}

export async function deleteCategory(id: number) {
  if (!Number.isFinite(id) || id <= 0) {
    return { success: false, error: "Invalid category." };
  }

  const supabase = await getSupabase();
  const { count, error: countError } = await supabase
    .from("services")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (countError) {
    console.error("Failed to check category services:", countError);
    return { success: false, error: countError.message };
  }

  if (count && count > 0) {
    return {
      success: false,
      error: "Delete or move this category's services first.",
    };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    console.error("Failed to delete category:", error);
    return { success: false, error: error.message };
  }

  revalidateServices();
  return { success: true };
}
