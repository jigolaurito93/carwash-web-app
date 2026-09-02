import AdminShell from "@/components/admin/AdminShell";
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
    <div className="flex min-h-screen min-w-0 overflow-x-hidden bg-gray-50">
      <Toaster position="top-center" />
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
