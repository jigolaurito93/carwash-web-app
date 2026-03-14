// app/admin/dashboard/page.tsx (or wherever your route is)
export default function AdminDashboardPage() {
  const ownerName = "Alex"; // later: read from session/user

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <h1 className="mb-1 text-3xl font-bold">Owner Dashboard</h1>
        <p className="text-sm text-gray-500">
          Welcome back, {ownerName}. Here&apos;s what&apos;s happening today.
        </p>
      </header>

      {/* Top cards */}
      <section className="grid gap-4 md:grid-cols-3">
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
        {/* Upcoming appointments */}
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Upcoming appointments</h2>
          <p className="text-sm text-gray-500">
            No appointments yet. Once you create bookings, they&apos;ll show up
            here.
          </p>
        </div>

        {/* Quick actions */}
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Quick actions</h2>
          <div className="space-y-3">
            <a
              href="/admin/appointments/new"
              className="block w-full rounded bg-black px-4 py-2 text-center text-sm text-yellow-400 hover:bg-gray-900"
            >
              Create appointment
            </a>
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
    </div>
  );
}
