"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import AllServicesTableClient from "./AllServicesTableClient";

export default async function AllServicesTestPage() {
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

  const { data: services, error } = await supabase
    .from("all_services")
    .select(
      `
      *,
      services_packages!package_id (
        name,
        categories!category_id (name)
      )
    `,
    )
    .order("name");

  if (error) {
    console.error("❌ SUPABASE ERROR:", error);
    return <div className="p-8 text-red-500">Error: {error.message}</div>;
  }

  if (!services || services.length === 0) {
    console.log("⚠️  NO SERVICES FOUND");
    return <div className="p-8 text-gray-500">No services found</div>;
  }

  return <AllServicesTableClient services={services} />;
}
