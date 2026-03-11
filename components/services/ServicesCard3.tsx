import { supabase } from "@/lib/supabase";
import ServicesCard2 from "@/components/services/ServicesCard2";

const TestServices = async () => {
  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    return (
      <div className="flex items-center justify-center pt-40 text-red-500">
        Failed to load services: {error.message}
      </div>
    );
  }

  // Map Supabase rows to the shape ServicesCard2 expects
  const formattedServices = services?.map((s) => ({
    title: s.name,
    description: s.subtitle ?? "",
    features: s.types ?? [],
    vehicles: {
      Car: s.price_car ?? 0,
      Mid: s.price_mid ?? 0,
      Full: s.price_full ?? 0,
    },
  }));

  return (
    <div className="flex flex-col px-4 pt-20 pb-32">
      {/* Black bar on top of navbar */}
      <div className="fixed top-0 left-0 h-[80px] w-full bg-black" />

      {/* Services and Pricing */}
      <div className="mx-auto py-10 font-lexend text-xl md:text-3xl">
        Services and Pricing
      </div>

      <div className="max-w-9xl mx-auto grid gap-7 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {formattedServices?.map((service, i) => (
          <ServicesCard2 key={i} serviceCard={service} />
        ))}
      </div>
    </div>
  );
};

export default TestServices;
