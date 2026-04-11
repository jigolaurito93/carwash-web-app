// app/services1/page.tsx
import Layout1Card from "@/components/services/Layout1Card";
import Layout2Card from "@/components/services/Layout2Card";
import { ServiceRow } from "@/lib/database.types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function ServicesPageTest() {
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

  // fetch all categories
  const { data: categories } = await supabase
    .from("categories1")
    .select("*")
    .order("id");

  // fetch all active services and include their category
  const { data: services }: { data: ServiceRow[] | null } = await supabase
    .from("services1")
    .select(`*, categories1(name, card_layout)`)
    .eq("is_active", true)
    .order("sort_order");

  if (!categories?.length) {
    return (
      <div className="p-8">
        <h1 className="mb-8 text-3xl font-bold">Services</h1>
        <p className="text-gray-500">No categories found.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#121212] text-white">
      {/* Title */}
      <section className="px-6 pt-20 sm:px-10 lg:px-24 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-lexend text-4xl font-extrabold tracking-tight text-yellow-400 drop-shadow-2xl sm:text-5xl lg:text-6xl">
            Services
          </h1>
          <p className="mt-4 font-questrial text-sm text-white/80 sm:text-base lg:text-lg">
            Behind every perfect finish. See the full range of our premium
            washes, detailing services, and add-ons designed to make your car
            look showroom-ready.
          </p>
        </div>
      </section>

      {categories.map((category) => {
        const categoryServices = services?.filter(
          (s) => s.category_id === category.id,
        );

        if (!categoryServices?.length) return null;

        return (
          <section key={category.id} className="px-4 py-20">
            {/* Category Title */}
            <h2
              id={category.slug}
              className="mb-12 text-center font-lexend text-3xl font-extrabold tracking-tight text-white drop-shadow-2xl"
            >
              {category.name}
            </h2>

            {/* Service Cards */}
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {categoryServices.map((service) => {
                const isLayout1 = category.card_layout === "layout1";
                const isLayout2 = category.card_layout === "layout2";

                return (
                  <div
                    key={service.id}
                    className="hover:shadow-3xl grid min-h-125 w-full grid-rows-[96px_1fr_120px] overflow-hidden rounded-2xl bg-[#1c1c1c] shadow-2xl backdrop-blur-sm transition-all"
                  >
                    {/* Row 1: Header */}
                    <div className="row-start-1 flex h-24 shrink-0 items-center justify-center bg-yellow-400 p-4">
                      <div className="space-y-1 text-center">
                        <h3 className="font-lexend text-xl leading-tight font-bold text-gray-900">
                          {service.name}
                        </h3>
                        {service.description && (
                          <p className="font-lexend text-xs leading-tight text-gray-700">
                            {service.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Features only */}
                    <div className="row-start-2 overflow-y-auto p-6">
                      {isLayout1 && service.layout1_data && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold tracking-wide text-white">
                            What's included
                          </h4>
                          <ul className="list-inside list-disc space-y-1 pr-2 text-sm text-white/90">
                            {service.layout1_data?.includes
                              ?.filter((i: string) => i.trim())
                              .map((item, idx) => (
                                <li key={idx}>{item.trim()}</li>
                              ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Row 3: Prices - PERFECTLY ALIGNED */}
                    <div className="row-start-3 flex flex-col justify-center space-y-1 border-t border-white/10 bg-gray-900/50 p-6 pt-4">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-gray-400">
                          Most Cars / Sedans:
                        </span>
                        <span className="font-bold text-white">
                          ${service.layout1_data?.small_car_price?.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-gray-400">
                          Mid-Size / Crossover:
                        </span>
                        <span className="font-bold text-white">
                          ${service.layout1_data?.medium_car_price?.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-gray-400">
                          Full-Size / Large:
                        </span>
                        <span className="font-bold text-white">
                          ${service.layout1_data?.large_car_price?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </main>
  );
}
