// app/services1/page.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ServiceRow } from "@/lib/database.types";
import { HiShieldCheck } from "react-icons/hi";

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
    .order("order_by")
    .order("id");

  // fetch all active services and include their category
  const { data: services }: { data: ServiceRow[] | null } = await supabase
    .from("services1")
    .select(`*, categories1(name)`)
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
    <main className="min-h-screen bg-[#121212] pb-20 text-white sm:px-6">
      {/* Title */}
      <section className="px-6 pt-28 sm:px-10 lg:px-24 lg:pt-24">
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
          <section key={category.id} className="px-4 py-10">
            {/* Category Title */}
            <div className="mb-12 text-center">
              <h2
                id={category.slug}
                className="mb-4 font-lexend text-3xl font-extrabold tracking-tight text-white drop-shadow-2xl"
              >
                {category.name}
              </h2>
              <div className="mx-auto h-1 w-24 rounded-full bg-linear-to-r from-blue-500 to-purple-600"></div>
            </div>

            {/* Service Cards */}
            <div className="mx-auto grid max-w-350 grid-cols-1 gap-8 sm:max-w-200 sm:grid-cols-2 lg:max-w-250 lg:grid-cols-3 xl:max-w-355 xl:grid-cols-4">
              {categoryServices.map((service) => {
                const isLayout1 = service.card_layout === "layout1";
                const isLayout2 = service.card_layout === "layout2";

                return (
                  <div
                    key={service.id}
                    className="hover:shadow-3xl mx-auto grid w-full max-w-90 grid-rows-[96px_1fr] overflow-hidden rounded-2xl bg-[#1c1c1c] backdrop-blur-sm transition-all xl:max-w-250"
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

                    {/* Row 2: Features or Add-ons */}
                    <div className="row-start-2 overflow-y-auto p-6">
                      {isLayout1 && service.layout1_data && (
                        <div className="mb-8 space-y-2">
                          <h4 className="text-md mb-4 font-semibold tracking-wide text-yellow-400">
                            What&apos;s included
                          </h4>
                          <ul className="space-y-2 text-sm text-white/90">
                            {service.layout1_data.includes
                              ?.filter((i: string) => i.trim())
                              .map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-2"
                                >
                                  <HiShieldCheck className="mt-1 h-4 w-4 shrink-0 text-green-400" />
                                  <span className="leading-5">
                                    {item.trim()}
                                  </span>
                                </div>
                              ))}
                          </ul>
                        </div>
                      )}
                      {isLayout2 && service.layout2_data && (
                        <div className="mb-8 space-y-2">
                          <h4 className="text-md mb-4 font-semibold tracking-wide text-yellow-400">
                            What&apos;s included
                          </h4>
                          <ul className="space-y-1 text-sm text-white/90">
                            {Object.entries(
                              service.layout2_data.items || {},
                            ).map(([name, price]) => (
                              <li key={name} className="flex items-start gap-2">
                                <span className="leading-5">{name}</span>
                                <span className="ml-auto font-medium">
                                  ${price.toFixed(2)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Row 3: Only layout1 has the 3‑line price block */}
                    {isLayout1 && service.layout1_data && (
                      <div className="row-start-3 flex flex-col justify-center space-y-1 border-t border-white/10 bg-gray-900/50 p-6 pt-4">
                        <div className="flex justify-between text-sm">
                          <span className="font-bold text-gray-400">
                            Most Cars / Sedans:
                          </span>
                          <span className="font-bold text-white">
                            $
                            {service.layout1_data.small_car_price
                              .toFixed(2)
                              .replace(/\.?0+$/, "")}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-bold text-gray-400">
                            Mid-Size / Crossover:
                          </span>
                          <span className="font-bold text-white">
                            $
                            {service.layout1_data.medium_car_price
                              .toFixed(2)
                              .replace(/\.?0+$/, "")}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-bold text-gray-400">
                            Full-Size / Large:
                          </span>
                          <span className="font-bold text-white">
                            $
                            {service.layout1_data.large_car_price
                              .toFixed(2)
                              .replace(/\.?0+$/, "")}
                          </span>
                        </div>
                      </div>
                    )}
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
