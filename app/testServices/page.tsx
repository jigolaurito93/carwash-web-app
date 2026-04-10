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
    <div className="px-8 py-32">
      <div className="fixed top-0 right-0 left-0 h-20 bg-black" />
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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {categoryServices.map((service) => {
                const isLayout1 = category.card_layout === "layout1";
                const isLayout2 = category.card_layout === "layout2";

                return (
                  <div
                    key={service.id}
                    className="max-w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-shadow hover:shadow-xl"
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

                      {isLayout1 && service.layout1_data && (
                        <Layout1Card service={service} />
                      )}

                      {isLayout2 && service.layout2_data && (
                        <Layout2Card service={service} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
