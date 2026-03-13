import { ReactNode } from "react";

export const metadata = {
  title: "Onyx | Admin Dashboard",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  // NOTE: We removed the Supabase client and redirect() because
  // the Middleware already verified the user before this code even runs.

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* If you have a Sidebar or Nav, put it here */}
      <aside className="hidden w-64 bg-black p-6 text-white md:block">
        <h2 className="font-lexend text-2xl font-bold text-yellow-400">
          Onyx Admin
        </h2>
        <nav className="mt-10 space-y-4 font-questrial">
          <a href="/admin/dashboard" className="block hover:text-yellow-400">
            Dashboard
          </a>
          <a href="/admin/appointments" className="block hover:text-yellow-400">
            Appointments
          </a>
          {/* Add logout button or other links here */}
        </nav>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
