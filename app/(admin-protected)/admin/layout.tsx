import LogoutButton from "@/components/admin/LogoutButton";
import Link from "next/link";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export const metadata = {
  title: "Onyx | Admin Dashboard",
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // NOTE: We removed the Supabase client and redirect() because
  // the Middleware already verified the user before this code even runs.

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      <aside className="hidden w-64 bg-black p-6 pt-28 text-white md:block">
        <h2 className="font-lexend text-2xl font-bold text-yellow-400">
          Onyx Admin
        </h2>
        <nav className="mt-10 space-y-4 font-questrial">
          <Link href="/admin/dashboard" className="block hover:text-yellow-400">
            Dashboard
          </Link>
          <Link
            href="/admin/appointments"
            className="block hover:text-yellow-400"
          >
            Appointments
          </Link>
          <Link href="/admin/services" className="block hover:text-yellow-400">
            Services
          </Link>
          <Link href="/admin/gallery" className="block hover:text-yellow-400">
            Gallery
          </Link>
          <Link href="/admin/profile" className="block hover:text-yellow-400">
            Account Setting
          </Link>
        </nav>

        {/* This pushes everything below it to the bottom */}
        <div className="mt-auto pt-10">
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 p-8 pt-20">{children}</main>
    </div>
  );
}
