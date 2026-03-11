"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type ServiceUpdate = Database["public"]["Tables"]["services"]["Update"];
type ServiceInsert = Database["public"]["Tables"]["services"]["Insert"];

export async function createService(
  payload: ServiceInsert,
): Promise<{ success: true } | { success: false; error: string }> {
  const { error } = await supabase.from("services").insert(payload);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/services");
  return { success: true };
}

export async function updateService(
  id: number,
  payload: ServiceUpdate,
): Promise<{ success: true } | { success: false; error: string }> {
  const { error } = await supabase
    .from("services")
    .update(payload)
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/services");
  return { success: true };
}

export async function createOtherService(payload) {
  const { error } = await supabase.from("otherServices").insert(payload);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/services");
  return { success: true };
}

export async function updateOtherService(id, payload) {
  const { error } = await supabase
    .from("otherServices")
    .update(payload)
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/services");
  return { success: true };
}
