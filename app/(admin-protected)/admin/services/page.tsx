import { supabase } from "@/lib/supabase";
import ServicesTable from "./ServicesTable";

export default async function AdminServicesPage() {
  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order");

  if (error) {
    return (
      <div className="p-8">
        <h1 className="mb-4 text-2xl font-bold">Manage Services</h1>
        <div className="rounded bg-red-50 p-4 text-red-700">
          Failed to load services: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="mb-6 text-2xl font-bold">Manage Services</h1>
      <ServicesTable services={services ?? []} />
      <div className="mt-6 text-sm text-gray-500">
        {!services?.length
          ? "No services yet. Use Add service to create your first one."
          : `Showing ${services.length} service${services.length !== 1 ? "s" : ""}.`}
      </div>
    </div>
  );
}
