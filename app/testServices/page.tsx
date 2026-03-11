import { supabase } from "@/lib/supabase";
import ServicesCard2 from "@/components/services/ServicesCard2";
import ServicesCard from "@/components/services/ServicesCard";

const TestServices = async () => {
  // Fetch main services
  const { data: services, error: servicesError } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  // Fetch other services
  const { data: otherServices, error: otherError } = await supabase
    .from("otherServices")
    .select("*")
    .order("sort_order", { ascending: true });

  // Fetch detailing services
  const { data: detailingServices, error: detailingError } = await supabase
    .from("detailingServices")
    .select("*")
    .order("sort_order", { ascending: true });

  // Check for errors
  if (servicesError || otherError || detailingError) {
    return (
      <div className="flex items-center justify-center pt-40 text-red-500">
        Failed to load services.
      </div>
    );
  }

  // Map main services to ServicesCard2 shape
  const formattedServices = services?.map((s) => ({
    title: s.name,
    description: s.subtitle ?? "",
    features: s.types ?? [],
    vehicles: {
      "Most Cars / Sedans": s.price_car ?? 0,
      "Mid-Size / Crossover": s.price_mid ?? 0,
      "Full-Size / Large": s.price_full ?? 0,
    },
  }));

  // Map otherServices to ServicesCard shape
  const formattedOtherServices = otherServices?.map((s) => ({
    title: s.title ?? s.name ?? "",
    subtitle: s.subtitle ?? s.description ?? "",
    services: s.services ?? [], // Must match { service: string, price: string, description?: string }[]
  }));

  // Map detailingServices to ServicesCard shape
  const formattedDetailingServices = detailingServices?.map((s) => ({
    title: s.name,
    description: s.subtitle ?? "",
    features: s.types ?? [],
    vehicles: {
      "Most Cars / Sedans": s.price_car ?? 0,
      "Mid-Size / Crossover": s.price_mid ?? 0,
      "Full-Size / Large": s.price_full ?? 0,
    },
  }));

  return (
    <div className="flex flex-col px-4 pt-20 pb-32">
      {/* Black bar on top of navbar */}
      <div className="fixed top-0 left-0 h-20 w-full bg-black" />

      {/* Services and Pricing */}
      <div className="mx-auto py-10 font-lexend text-xl md:text-3xl">
        Services and Pricing
      </div>
      <div className="max-w-9xl mx-auto grid gap-7 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {formattedServices?.map((service, i) => (
          <ServicesCard2 key={i} serviceCard={service} />
        ))}
      </div>

      {/* Other Services */}
      {formattedOtherServices && formattedOtherServices.length > 0 && (
        <>
          <div className="mx-auto py-10 font-lexend text-xl md:text-3xl">
            Other Services
          </div>
          <div className="max-w-9xl mx-auto grid gap-7 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {formattedOtherServices.map((service, i) => (
              <ServicesCard key={i} serviceCard={service} />
            ))}
          </div>
        </>
      )}

      {/* Detailing Services */}
      {formattedDetailingServices && formattedDetailingServices.length > 0 && (
        <>
          <div className="mx-auto py-10 font-lexend text-xl md:text-3xl">
            Detailing Services
          </div>
          <div className="max-w-9xl mx-auto grid gap-7 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {formattedDetailingServices.map((service, i) => (
              <ServicesCard2 key={i} serviceCard={service} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TestServices;
