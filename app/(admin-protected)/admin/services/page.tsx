import { supabase } from "@/lib/supabase";
import ServicesTable from "./ServicesTable";
import OtherServicesTable from "./OtherServices";

export default async function AdminServicesPage() {
  // Fetch from "Services" table on supabase
  const { data: services, error: servicesError } = await supabase
    .from("services")
    .select("*")
    .order("sort_order");

  // Fetch from "Other Services" table on supabase
  const { data: otherServices, error: otherError } = await supabase
    .from("otherServices")
    .select("*")
    .order("sort_order");

  if (servicesError || otherError) {
    return (
      <div className="p-8">
        <h1 className="mb-4 text-2xl font-bold">Manage Services</h1>
        <div className="rounded bg-red-50 p-4 text-red-700">
          Failed to load services.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="mb-6 text-2xl font-bold">Manage Services</h1>

      {/* Main Services */}
      <ServicesTable services={services ?? []} />

      {/* Other Services
      <div className="mt-12">
        <h2 className="mb-6 text-xl font-bold">Other Services</h2>
        <OtherServicesTable services={otherServices ?? []} />
      </div> */}
    </div>
  );
}
