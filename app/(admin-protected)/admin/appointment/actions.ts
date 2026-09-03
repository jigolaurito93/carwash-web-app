"use server";

import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import { appointmentSchema } from "@/lib/validations/appointment-schema";
import { validateAppointmentSlot } from "@/lib/appointment-hours";

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

function revalidateAppointments() {
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/appointment");
}

function parseAppointmentForm(formData: FormData) {
  return appointmentSchema.safeParse({
    first_name: String(formData.get("first_name") ?? ""),
    last_name: String(formData.get("last_name") ?? ""),
    phone_number: String(formData.get("phone_number") ?? ""),
    email: String(formData.get("email") ?? ""),
    service_id: Number(formData.get("service_id")),
    appointment_date: String(formData.get("appointment_date") ?? ""),
  });
}

function customerName(firstName: string, lastName: string | null) {
  return [firstName, lastName].filter(Boolean).join(" ");
}

async function assertAppointmentSlot(
  supabase: Awaited<ReturnType<typeof getSupabase>>,
  formData: FormData,
  appointmentDate: string,
) {
  const { data: hours, error } = await supabase
    .from("shop_hours")
    .select("day_name, open_time, close_time, is_closed");

  if (error) {
    return { error: error.message };
  }

  const slotError = validateAppointmentSlot(
    hours ?? [],
    String(formData.get("local_date") ?? ""),
    String(formData.get("local_time") ?? ""),
    appointmentDate,
  );
  if (slotError) {
    return { error: slotError };
  }

  return { ok: true as const };
}

async function resolveService(
  supabase: Awaited<ReturnType<typeof getSupabase>>,
  serviceId: number,
  options: { requireActive: boolean },
) {
  const { data, error } = await supabase
    .from("services")
    .select("id, name, is_active")
    .eq("id", serviceId)
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }
  if (!data) {
    return { error: "Please select a service." };
  }
  if (options.requireActive && data.is_active === false) {
    return { error: "That service is no longer available." };
  }

  return { service: data };
}

export async function createAppointment(formData: FormData) {
  const parsed = parseAppointmentForm(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid appointment.",
    };
  }

  const supabase = await getSupabase();
  const resolved = await resolveService(supabase, parsed.data.service_id, {
    requireActive: true,
  });
  if ("error" in resolved) {
    return { success: false, error: resolved.error };
  }

  const slot = await assertAppointmentSlot(
    supabase,
    formData,
    parsed.data.appointment_date,
  );
  if ("error" in slot) {
    return { success: false, error: slot.error };
  }

  const { error } = await supabase.from("appointment").insert({
    first_name: parsed.data.first_name,
    last_name: parsed.data.last_name,
    customer_name: customerName(parsed.data.first_name, parsed.data.last_name),
    phone_number: parsed.data.phone_number,
    email: parsed.data.email,
    service_id: resolved.service.id,
    service: resolved.service.name,
    appointment_date: parsed.data.appointment_date,
    status: "scheduled",
  });

  if (error) {
    console.error("Failed to create appointment:", error);
    return { success: false, error: error.message };
  }

  revalidateAppointments();
  return { success: true };
}

export async function updateAppointment(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id) || id <= 0) {
    return { success: false, error: "Invalid appointment." };
  }

  const parsed = parseAppointmentForm(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid appointment.",
    };
  }

  const supabase = await getSupabase();
  const { data: existing, error: existingError } = await supabase
    .from("appointment")
    .select("service_id")
    .eq("id", id)
    .maybeSingle();

  if (existingError) {
    console.error("Failed to load appointment:", existingError);
    return { success: false, error: existingError.message };
  }
  if (!existing) {
    return { success: false, error: "Appointment not found." };
  }

  const resolved = await resolveService(supabase, parsed.data.service_id, {
    requireActive: parsed.data.service_id !== existing.service_id,
  });
  if ("error" in resolved) {
    return { success: false, error: resolved.error };
  }

  const slot = await assertAppointmentSlot(
    supabase,
    formData,
    parsed.data.appointment_date,
  );
  if ("error" in slot) {
    return { success: false, error: slot.error };
  }

  const { error } = await supabase
    .from("appointment")
    .update({
      first_name: parsed.data.first_name,
      last_name: parsed.data.last_name,
      customer_name: customerName(
        parsed.data.first_name,
        parsed.data.last_name,
      ),
      phone_number: parsed.data.phone_number,
      email: parsed.data.email,
      service_id: resolved.service.id,
      service: resolved.service.name,
      appointment_date: parsed.data.appointment_date,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Failed to update appointment:", error);
    return { success: false, error: error.message };
  }

  revalidateAppointments();
  return { success: true };
}

export async function deleteAppointment(id: number) {
  if (!Number.isFinite(id) || id <= 0) {
    return { success: false, error: "Invalid appointment." };
  }

  const supabase = await getSupabase();
  const { error } = await supabase.from("appointment").delete().eq("id", id);

  if (error) {
    console.error("Failed to delete appointment:", error);
    return { success: false, error: error.message };
  }

  revalidateAppointments();
  return { success: true };
}
