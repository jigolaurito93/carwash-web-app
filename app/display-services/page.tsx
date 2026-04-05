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

  // Helper to get sorted packages for any category
  const getCategoryPackages = (categoryId: number) =>
    (serviceCard as any[])
      .filter(
        (service) => service.services_packages?.categories?.id === categoryId,
      )
      .reduce((acc: { pkgId: number; sortOrder: number }[], service: any) => {
        const pkgId = service.package_id;
        const pkgSortOrder = service.services_packages?.sort_order || 999;
        if (!acc.find((p) => p.pkgId === pkgId)) {
          acc.push({ pkgId, sortOrder: pkgSortOrder });
        }
        return acc;
      }, [])
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item) => item.pkgId);

  const washPackages = getCategoryPackages(1); // Regular, Premium, etc.
  const detailingPackages = getCategoryPackages(3); // Detailing services

  return (
    <div className="flex flex-col px-4 pt-20 pb-32">
      <div className="fixed top-0 left-0 h-20 w-full bg-black" />
      <div className="mx-auto py-10 font-lexend text-xl md:text-3xl">
        Services and Pricing
      </div>

      {/* Wash Services (category 1) */}
      <div className="max-w-9xl mx-auto grid gap-7 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {washPackages.map((packageId) => (
          <ServicesCard3
            key={`wash-${packageId}`}
            services={serviceCard}
            packageId={packageId}
          />
        ))}
      </div>

      {/* Detailing Services (category 3) */}
      <div className="mx-auto py-10 font-lexend text-xl md:text-3xl">
        Detailing Services
      </div>
      <div className="max-w-9xl mx-auto grid gap-7 px-4 pb-20 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {detailingPackages.map((packageId) => (
          <ServicesCard3
            key={`detail-${packageId}`}
            services={serviceCard}
            packageId={packageId}
          />
        ))}
      </div>
    </div>
  );
}
