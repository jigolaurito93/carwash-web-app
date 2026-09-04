// app/(public)/services/page.tsx
import { Suspense } from "react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ServiceRow } from "@/lib/app.types";
import Image from "next/image";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceCardsSkeleton from "@/components/services/ServiceCardsSkeleton";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#121212] pb-20 text-white">
      <div className="relative h-screen w-full overflow-hidden">
        {/* Mobile / smaller screens image */}
        <Image
          alt="carwash image mobile"
          src="/images/carwash-9.jpg"
          fill
          priority
          className="object-cover object-top lg:hidden"
        />
        {/* Desktop / lg+ image */}
        <Image
          alt="carwash image desktop"
          src="/images/carwash-8.jpg"
          fill
          priority
          className="hidden object-cover object-top lg:block"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="flex w-full flex-col items-center gap-4 text-center">
            <div className="font-lexend text-7xl font-extrabold tracking-tighter text-yellow-400 drop-shadow-2xl sm:text-7xl lg:text-9xl">
              Services
            </div>
            <div className="mt-2 max-w-110 px-6 font-lexend text-lg font-bold text-white italic sm:max-w-155 lg:max-w-[750] lg:text-xl">
              Explore our premium washes, detailing, and add-ons designed to
              keep your car looking showroom‑fresh.
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={<ServiceCardsSkeleton />}>
        <ServicesCatalog />
      </Suspense>
    </main>
  );
}

async function ServicesCatalog() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
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

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order")
    .order("id");

  const { data: servicesData } = await supabase
    .from("services")
    .select(`*, categories(name)`)
    .eq("is_active", true)
    .order("sort_order");
  const services = (servicesData ?? []) as ServiceRow[];

  const { data: shopInfo } = await supabase
    .from("shop_info")
    .select("phone")
    .single();

  if (!categories?.length) {
    return (
      <div className="p-8">
        <p className="text-gray-500">No categories found.</p>
      </div>
    );
  }

  return (
    <div className="my-16 sm:px-6">
      {categories.map((category) => {
        const categoryServices = services?.filter(
          (s) => s.category_id === category.id,
        );

        if (!categoryServices?.length) return null;

        return (
          <section key={category.id} className="px-4 py-10">
            <div className="mb-12 text-center">
              <h2
                id={category.slug}
                className="mb-4 font-lexend text-3xl font-extrabold tracking-tight text-white drop-shadow-2xl"
              >
                {category.name}
              </h2>
              <div className="mx-auto h-1 w-24 rounded-full bg-linear-to-r from-blue-500 to-purple-600"></div>
            </div>

            <div className="mx-auto grid max-w-350 grid-cols-1 gap-8 sm:max-w-200 sm:grid-cols-2 lg:max-w-250 lg:grid-cols-3 xl:max-w-355 xl:grid-cols-4">
              {categoryServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  phone={shopInfo?.phone}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
