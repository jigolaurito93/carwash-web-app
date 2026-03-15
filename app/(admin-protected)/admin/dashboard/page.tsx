"use client";  // ← Added this

import AppointmentFormModal from "@/components/admin/AppointmentFormModal";
import { useState } from "react";

export default function AdminDashboardPage() {
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  return (
    <div className="">
      <div className="fixed top-0 left-0 h-20 w-full bg-black" />

      {/* Header */}
      <header className="flex flex-col gap-2">
        <h1 className="mt-20 mb-1 font-lexend text-4xl font-bold">Dashboard</h1>
        <p className="font-questrial text-2xl font-bold text-gray-500">
          Welcome back, John Doe! Here&apos;s what&apos;s happening today.
        </p>
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
              onClick={() => setShowAppointmentModal(true)}
              className="block w-full rounded bg-black px-4 py-2 text-center text-sm text-yellow-400 hover:bg-gray-900 transition-colors"
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
      {showAppointmentModal && (
        <AppointmentFormModal onClose={() => setShowAppointmentModal(false)} />
      )}
    </div>
  );
}