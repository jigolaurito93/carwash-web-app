"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type DbUser = {
  id: string;
  display_name: string | null;
  email: string | null;
};

export default function AdminDashboardPage() {
  const [displayName, setDisplayName] = useState<string>("Owner");
  const [email, setEmail] = useState<string>("");
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // 1) Get the auth user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("Error getting auth user:", userError);
          return;
        }
        if (!user) {
          // not logged in
          return;
        }

        // 2) Fetch from your `users` table
        const { data, error } = await supabase
          .from("users") // your table name
          .select("display_name, email")
          .eq("id", user.id)
          .single<DbUser>();

        if (error) {
          console.error("Error fetching user row:", error);
          return;
        }

        if (data?.display_name) setDisplayName(data.display_name);
        if (data?.email) setEmail(data.email ?? "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingUser(false);
      }
    };

    loadUserData();
  }, []);

  return (
    <div className="">
      <div className="fixed top-0 left-0 h-[80px] w-full bg-black" />

      {/* Header */}
      <header className="flex flex-col gap-2">
        <h1 className="mt-20 mb-1 font-lexend text-4xl font-bold">
          Owner Dashboard
        </h1>
        <p className="font-questrial text-2xl font-bold text-gray-500">
          {loadingUser
            ? "Welcome back..."
            : `Welcome back, ${displayName}. Here's what's happening today.`}
        </p>
        {!loadingUser && email && (
          <p className="font-questrial text-sm text-gray-400">
            Logged in as {email}
          </p>
        )}
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

      {/* Main content (unchanged) */}
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
