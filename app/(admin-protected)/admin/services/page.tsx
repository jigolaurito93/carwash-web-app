import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import type { Category, ServiceRow } from "@/lib/app.types";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import CategoriesAdmin from "@/components/admin/CategoriesAdmin";
import ServicesAdmin from "@/components/admin/ServicesAdmin";

export default async function AdminServicesPage() {
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

  const [
    { data: categoriesData, error: categoriesError },
    { data: servicesData, error: servicesError },
  ] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order").order("id"),
    supabase
      .from("services")
      .select("*, categories(name)")
      .order("category_id")
      .order("sort_order"),
  ]);

  if (categoriesError || servicesError) {
    return (
      <div className="p-8 font-questrial text-red-600">
        Failed to load services. Make sure the <code>categories</code> and{" "}
        <code>services</code> tables exist, then run <code>pnpm gen:types</code>
        .
      </div>
    );
  }

  const categories = (categoriesData ?? []) as Category[];
  const services = (servicesData ?? []) as ServiceRow[];

  return (
    <div>
      <AdminPageHeader title="Services" />
      <CategoriesAdmin categories={categories} services={services} />
      <ServicesAdmin categories={categories} services={services} />
    </div>
  );
}
