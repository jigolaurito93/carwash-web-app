import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { LiaLongArrowAltLeftSolid } from "react-icons/lia";
import type { Database } from "@/lib/database.types";
import type { Category, ServiceRow } from "@/lib/app.types";
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
    supabase.from("categories1").select("*").order("sort_order").order("id"),
    supabase
      .from("services1")
      .select("*, categories1(name)")
      .order("category_id")
      .order("sort_order"),
  ]);

  if (categoriesError || servicesError) {
    return (
      <div className="p-8 font-questrial text-red-600">
        Failed to load services. Make sure the <code>categories1</code> and{" "}
        <code>services1</code> tables exist, then run{" "}
        <code>pnpm gen:types</code>.
      </div>
    );
  }

  const categories = (categoriesData ?? []) as Category[];
  const services = (servicesData ?? []) as ServiceRow[];

  return (
    <div>
      <div className="mb-12 flex items-center justify-between">
        <h1 className="adminHeader">Services</h1>
        <Link
          href="/admin/dashboard"
          className="btnSaveYlw flex items-center gap-2"
        >
          <LiaLongArrowAltLeftSolid className="h-6 w-6" />
          <span>Back To Dashboard</span>
        </Link>
      </div>
      <ServicesAdmin categories={categories} services={services} />
    </div>
  );
}
