import { supabase } from "@/lib/supabase";

export default async function AdminServicesPage() {
  const { data } = await supabase
    .from("services")
    .select("*")
    .order("sort_order");

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Manage Services</h1>
      <pre className="rounded bg-gray-100 p-4">
        {JSON.stringify(data, null, 2)}
      </pre>
      {/* TODO: Add UI for adding/editing/deleting services */}
    </div>
  );
}
