import { OtherCard } from "@/components/services/OtherCard";
import { TieredCard } from "@/components/services/TieredCard";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type CustomerService = {
  id: number;
  name: string;
  description?: string;
  features: string | Array<{ service: string; price: number }>;
  price_small?: number | null;
  price_medium?: number | null;
  price_large?: number | null;
  is_active: boolean;
  sort_order: number;
  service_type: "tiered" | "other";
  created_at: string;
  updated_at: string;
  category: "main" | "detailing" | "other";
};

export default async function AdminServicesPage() {
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

  const { data: services, error } = await supabase
    .from("customer_services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error || !services?.length) {
    return <div className="p-8 text-center">No services found</div>;
  }

  // Group services by type
  const mainServices = services.filter((s) => s.category === "main");
  const detailingServices = services.filter((s) => s.category === "detail");
  const otherServices = services.filter(
    (s) => s.category === "other",
  ) as CustomerService[];

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 pt-32 pb-16 sm:px-6 lg:px-8 lg:pt-16">
        {/* Main Title */}

        <h1 className="mb-12 text-center text-4xl font-bold md:text-6xl lg:mb-20">
          Services & Pricing
        </h1>

        <div className="flex flex-col">
          {/* Main Services Section */}
          <section>
            <div className="mb-8 text-center">
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                Main Services
              </h2>
              <div className="mx-auto h-1 w-24 rounded-full bg-linear-to-r from-blue-500 to-purple-600"></div>
            </div>
            <section className="mx-auto grid max-w-375 gap-8 px-4 pb-20 sm:max-w-200 sm:grid-cols-2 lg:max-w-300 lg:grid-cols-3 2xl:max-w-350 2xl:grid-cols-4">
              {mainServices.map((service) => (
                <TieredCard key={service.id} service={service} />
              ))}
            </section>
          </section>

          {/* Detailing Services Section */}
          <section>
            <div className="mb-8 text-center">
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                Detailing Services
              </h2>
              <div className="mx-auto h-1 w-24 rounded-full bg-linear-to-r from-emerald-500 to-teal-600"></div>
            </div>
            <section className="mx-auto grid max-w-375 gap-8 px-4 pb-20 sm:max-w-200 sm:grid-cols-2 lg:max-w-300 lg:grid-cols-3 2xl:max-w-350 2xl:grid-cols-4">
              {detailingServices.map((service, i) => (
                <div key={i}>
                  <div className="mb-4 flex justify-end gap-4">
                    <div className="rounded border bg-red-600 px-4 py-2 text-white">
                      Delete
                    </div>
                    <div className="rounded border bg-green-600 px-4 py-2 text-white">
                      Edit
                    </div>
                  </div>
                  <TieredCard key={service.id} service={service} />
                </div>
              ))}
            </section>
          </section>

          {/* Other Services Section */}
          <section>
            <div className="mb-8 text-center">
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                Other Services
              </h2>
              <div className="mx-auto h-1 w-24 rounded-full bg-linear-to-r from-orange-500 to-red-600"></div>
            </div>
            <section className="mx-auto grid max-w-375 gap-8 px-4 pb-20 sm:max-w-200 sm:grid-cols-2 lg:max-w-300 lg:grid-cols-3 2xl:max-w-350 2xl:grid-cols-4">
              {otherServices.map((service) => (
                <OtherCard key={service.id} service={service} />
              ))}
            </section>
          </section>
        </div>
      </div>
    </div>
  );
}
