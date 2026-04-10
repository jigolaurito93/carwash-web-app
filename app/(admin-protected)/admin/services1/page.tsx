// app/services1/page.tsx (or wherever you’re routing)
import { ServiceRow } from "@/lib/database.types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// types.ts
export type Layout1Data = {
  includes: string[];
  small_car_price: number;
  medium_car_price: number;
  large_car_price: number;
};

export type Layout2Data = {
  items: Record<string, number>;
};

export default async function ServicesPage() {
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
    <div className="p-8">
      <h1 className="mb-12 text-3xl font-bold">Services</h1>

      {categories.map((category) => {
        // filter services belonging to this category
        const categoryServices = services?.filter(
          (s) => s.category_id === category.id,
        );

        // skip rendering section if no services in this category
        if (!categoryServices?.length) return null;

        return (
          <section key={category.id} className="mb-12">
            <h2
              id={category.slug}
              className="mb-6 text-2xl font-bold text-gray-900"
            >
              {category.name}
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categoryServices.map((service) => (
                <div
                  key={service.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-shadow hover:shadow-xl"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      {service.name}
                    </h3>

                    {service.description && (
                      <p className="mt-2 text-gray-600">
                        {service.description}
                      </p>
                    )}

                    {/*
                      Example:
                      - Main Wash (layout1) → show price grid
                      - Add‑Ons (layout2) → show items list
                    */}
                    {category.card_layout === "layout1" &&
                      service.layout1_data && (
                        <div className="mt-4">
                          <h4 className="mb-2 text-sm font-semibold text-gray-800">
                            What&apos;s included
                          </h4>
                          <ul className="mb-3 list-inside list-disc text-sm text-gray-600">
                            {service.layout1_data.includes
                              .filter((i: string) => i.trim())
                              .map((item: string, idx: number) => (
                                <li key={idx}>{item.trim()}</li>
                              ))}
                          </ul>

                          <div className="grid grid-cols-3 gap-3 text-sm">
                            <div>
                              <span className="text-gray-600">Small:</span>{" "}
                              <span className="font-semibold">
                                ${service.layout1_data.small_car_price}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Medium:</span>{" "}
                              <span className="font-semibold">
                                ${service.layout1_data.medium_car_price}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Large:</span>{" "}
                              <span className="font-semibold">
                                ${service.layout1_data.large_car_price}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                    {category.card_layout === "layout2" &&
                      service.layout2_data && (
                        <div className="mt-4">
                          <h4 className="mb-2 text-sm font-semibold text-gray-800">
                            Add‑ons
                          </h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {Object.entries(service.layout2_data.items).map(
                              ([name, price]) => (
                                <li key={name} className="flex justify-between">
                                  <span>{name}</span>
                                  <span className="font-semibold">
                                    ${price.toFixed(2)}
                                  </span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
