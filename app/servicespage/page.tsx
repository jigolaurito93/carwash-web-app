import { OtherCard } from "@/components/services/OtherCard";
import { TieredCard } from "@/components/services/TieredCard";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type CustomerService = {
  id: number;
  name: string;
  description?: string;
  features: string | Array<{ service: string; price: number }>; // Tiered: string | Other: array
  price_small?: number | null;
  price_medium?: number | null;
  price_large?: number | null;
  is_active: boolean;
  sort_order: number;
  service_type: "tiered" | "other"; // ✅ Updated for your tables
  created_at: string;
  updated_at: string;
};

// ✅ Helper types for clean code
type AddonPrice = {
  service: string;
  price: number;
};

type TieredFeatures = string; // "Feature1\nFeature2"

export default async function ServicesPage() {
  // Separate function later
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
  //Separate function later

  // data fetching
  const { data: services, error } = await supabase
    .from("customer_services") // ✅ Your new VIEW
    .select("*") // ✅ Simple - no joins needed
    .eq("is_active", true)
    .order("sort_order");

  // Handle errors + render cards
  if (error || !services?.length) {
    return <div>No services found</div>;
  }

  return (
    <div className="mx-auto max-w-6xl p-8">
      <h1 className="mb-12 text-4xl font-bold">Services & Pricing</h1>
      {services.map((service) => (
        <div key={`${service.service_type}-${service.id}`}>
          {service.service_type === "tiered" ? (
            <TieredCard service={service} />
          ) : (
            <OtherCard service={service} />
          )}
        </div>
      ))}
    </div>
  );
}
