import { createServerClient } from "@supabase/ssr";
import ServicesCard3 from "@/components/services/ServicesCard3";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";

export default async function DisplayServices() {
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

  const { data: serviceCard, error } = await supabase
    .from("all_services")
    .select(
      `
      *,
      services_packages (
        name,
        types,
        description,
        sort_order,
        categories (id, name)
      )
    `,
    )
    .eq("is_active", true)
    .order("sort_order");

  if (error || !serviceCard?.length) {
    return (
      <div className="flex flex-col px-4 pt-20 pb-32">
        <div className="fixed top-0 left-0 h-20 w-full bg-black" />
        <div className="mx-auto py-10 font-lexend text-xl md:text-3xl">
          Services and Pricing
        </div>
        <div className="pt-20 text-center">No services available</div>
      </div>
    );
  }

  // Filter category_id === 1 and get unique package_ids SORTED
  const category1Packages = serviceCard
    .filter((service) => service.services_packages?.categories?.id === 1)
    .reduce(
      (acc, service) => {
        const pkgId = service.package_id;
        const pkgSortOrder = service.services_packages?.sort_order || 999;
        if (!acc.find((p) => p.pkgId === pkgId)) {
          acc.push({ pkgId, sortOrder: pkgSortOrder });
        }
        return acc;
      },
      [] as { pkgId: number; sortOrder: number }[],
    )
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => item.pkgId);

  console.log("Category 1 unique packages:", category1Packages);

  return (
    <div className="flex flex-col px-4 pt-20 pb-32">
      <div className="fixed top-0 left-0 h-20 w-full bg-black" />
      <div className="mx-auto py-10 font-lexend text-xl md:text-3xl">
        Services and Pricing
      </div>

      <div className="max-w-9xl mx-auto grid gap-7 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {category1Packages.map((packageId) => (
          <ServicesCard3
            key={packageId}
            services={serviceCard}
            packageId={packageId}
          />
        ))}
      </div>
    </div>
  );
}
