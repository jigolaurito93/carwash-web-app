import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import DashboardClock from "@/components/admin/DashboardClock";

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

  const { data: profile } = user
    ? await supabase
        .from("admin_profiles")
        .select("first_name, last_name")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };

  const displayName = [profile?.first_name, profile?.last_name]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join(" ");

  return (
    <div className="">
      {/* Header */}
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

      {/* Top cards */}
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-black p-4 text-yellow-400">
          <p className="text-xs tracking-wide text-gray-300 uppercase">
            Today&apos;s appointments
          </p>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>

        <div className="rounded-lg bg-black p-4 text-yellow-400">
          <p className="text-xs tracking-wide text-gray-300 uppercase">
            Completed washes
          </p>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>

        <div className="rounded-lg bg-black p-4 text-yellow-400">
          <p className="text-xs tracking-wide text-gray-300 uppercase">
            Open slots left
          </p>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
      </section>

      {/* Main content */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Upcoming appointments</h2>
          <p className="text-sm text-gray-500">
            No appointments yet. Once you create bookings, they&apos;ll show up
            here.
          </p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Quick actions</h2>
          <div className="space-y-3">
            {/* ← MODAL BUTTON */}
            <button
              // onClick={() => setShowAppointmentModal(true)}
              className="block w-full rounded bg-black px-4 py-2 text-center text-sm text-yellow-400 transition-colors hover:bg-gray-900"
            >
              Create appointment
            </button>

            <a
              href="/admin/services"
              className="block w-full rounded bg-black px-4 py-2 text-center text-sm text-yellow-400 hover:bg-gray-900"
            >
              Manage services
            </a>
            <a
              href="/admin/gallery"
              className="block w-full rounded bg-black px-4 py-2 text-center text-sm text-yellow-400 hover:bg-gray-900"
            >
              Manage gallery
            </a>
          </div>
        </div>
      </section>

      {/* ← APPOINTMENT MODAL */}
      {/* {showAppointmentModal && (
        <AppointmentFormModal onClose={() => setShowAppointmentModal(false)} />
      )} */}
    </div>
  );
}
