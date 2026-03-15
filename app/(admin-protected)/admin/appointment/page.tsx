// app/admin/appointments/page.tsx
import AppointmentsClient from "@/components/admin/AppointmentsClient";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function AppointmentsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    },
  );

  const { data: appointments, error } = await supabase
    .from("appointment")
    .select("*")
    .order("appointment_date", { ascending: true });

  if (error) {
    return <div className="p-8 text-red-500">Error loading appointments</div>;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Clean header */}
      <div className="flex items-center justify-between">
        <h1 className="adminHeader">Manage Appointments</h1>
        <div className="flex items-center gap-4">
          <a
            href="/admin/dashboard"
            className="btnSaveYlw rounded-xl px-6 py-2 text-sm font-semibold"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>

      {/* Client component renders create button + table */}
      <AppointmentsClient appointments={appointments ?? []} />
    </div>
  );
}
