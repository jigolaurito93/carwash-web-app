import { supabase } from "@/lib/supabase";
import ServicesTable from "./ServicesTable";
import OtherServicesTable from "./OtherServices";
import { LiaLongArrowAltLeftSolid } from "react-icons/lia";
import Link from "next/link";
import AllServicesTable from "./AllServicesTable";

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
      <div className="mb-12 flex items-center justify-between">
        <h1 className="adminHeader">Manage Services</h1>
        <Link
          href="/admin/dashboard"
          className="btnSaveYlw flex items-center gap-2"
        >
          <LiaLongArrowAltLeftSolid className="h-6 w-6" />
          <span>Back To Dashboard</span>
        </Link>
      </div>

      {/* Main Services */}
      <ServicesTable services={services ?? []} />

      {/* Other Services */}
      <OtherServicesTable services={otherServices ?? []} />

      {/* All Services */}
      <div>
        <AllServicesTable />
      </div>
    </div>
  );
}
