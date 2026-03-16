"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import ServicesTableClient from "../services/AllServicesTable";

export default async function AllServicesPage() {
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
    .from("services_all")
    .select("*")
    .order("category")
    .order("sub_category");

  if (error || !services) {
    return (
      <div className="p-8 text-red-500">
        Error loading services: {error?.message || "No data"}
      </div>
    );
  }

  return <ServicesTableClient services={services} />;
}
