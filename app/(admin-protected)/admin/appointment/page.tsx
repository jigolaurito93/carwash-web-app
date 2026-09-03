import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import type { Appointment, AppointmentServiceOption } from "@/lib/app.types";
import type { ShopHoursDay } from "@/lib/appointment-hours";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AppointmentsClient from "@/components/admin/AppointmentsClient";

export default async function AppointmentsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
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

  const [
    { data: appointmentData, error: appointmentError },
    { data: serviceData, error: serviceError },
    { data: hoursData, error: hoursError },
  ] = await Promise.all([
    supabase
      .from("appointment")
      .select(
        "id, first_name, last_name, customer_name, email, phone_number, service, service_id, appointment_date, notes, status, created_at, updated_at",
      )
      .order("appointment_date", { ascending: true }),
    supabase
      .from("services")
      .select("id, name, is_active, categories(name)")
      .order("sort_order")
      .order("id"),
    supabase
      .from("shop_hours")
      .select("day_name, open_time, close_time, is_closed"),
  ]);

  if (appointmentError || serviceError || hoursError) {
    return (
      <div className="p-8 font-questrial text-red-600">
        Failed to load appointments. Run <code>supabase/appointments.sql</code>{" "}
        in the Supabase SQL editor, then <code>pnpm gen:types</code>.
      </div>
    );
  }

  const appointments = (appointmentData ?? []) as Appointment[];
  const services = (serviceData ?? []) as AppointmentServiceOption[];
  const hours = (hoursData ?? []) as ShopHoursDay[];

  return (
    <div>
      <AdminPageHeader title="Appointments" />
      <AppointmentsClient
        appointments={appointments}
        services={services}
        hours={hours}
      />
    </div>
  );
}
