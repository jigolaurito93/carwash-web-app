import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import type { Appointment, AppointmentServiceOption } from "@/lib/app.types";
import type { ShopHoursDay } from "@/lib/appointment-hours";
import DashboardClock from "@/components/admin/DashboardClock";
import DashboardSchedule from "@/components/admin/DashboardSchedule";

export default async function AdminDashboardPage() {
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    { data: profile },
    { data: appointmentData, error: appointmentError },
    { data: serviceData },
    { data: hoursData },
  ] = await Promise.all([
    user
      ? supabase
          .from("admin_profiles")
          .select("first_name, last_name")
          .eq("id", user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from("appointment")
      .select(
        "id, first_name, last_name, customer_name, email, phone_number, service, service_id, appointment_date, notes, status, created_at, updated_at",
      )
      .eq("status", "scheduled")
      .order("appointment_date", { ascending: true }),
    supabase
      .from("services")
      .select("id, name, is_active, categories(name)")
      .eq("is_active", true)
      .order("sort_order")
      .order("id"),
    supabase
      .from("shop_hours")
      .select("day_name, open_time, close_time, is_closed"),
  ]);

  const displayName = [profile?.first_name, profile?.last_name]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join(" ");

  const appointments = (appointmentData ?? []) as Appointment[];
  const services = (serviceData ?? []) as AppointmentServiceOption[];
  const hours = (hoursData ?? []) as ShopHoursDay[];

  if (appointmentError) {
    return (
      <div className="p-8 font-questrial text-red-600">
        Failed to load appointments. Run <code>supabase/appointments.sql</code>{" "}
        in the Supabase SQL editor, then <code>pnpm gen:types</code>.
      </div>
    );
  }

  return (
    <div className="">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="mb-1 font-lexend text-4xl font-bold">Dashboard</h1>
          <p className="font-questrial text-2xl font-bold text-gray-500">
            Welcome back{displayName ? `, ${displayName}` : ""}! Here&apos;s
            what&apos;s happening today.
          </p>
        </div>
        <DashboardClock />
      </header>

      <DashboardSchedule
        appointments={appointments}
        services={services}
        hours={hours}
      />
    </div>
  );
}
