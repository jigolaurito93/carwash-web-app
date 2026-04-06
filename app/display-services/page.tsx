// import { createServerClient } from "@supabase/ssr";
// import ServicesCard3 from "@/components/services/ServicesCard3";
// import ServicesCard4 from "@/components/services/ServicesCard4";
// import { cookies } from "next/headers";
// import type { AllService, Database } from "@/lib/database.types";

// export default async function DisplayServices() {
//   const cookieStore = await cookies();
//   const supabase = createServerClient<Database>(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return cookieStore.getAll();
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value, options }) =>
//             cookieStore.set(name, value, options),
//           );
//         },
//       },
//     },
//   );

//   const { data: services, error } = await supabase
//     .from("all_services")
//     .select(
//       `
//       *,
//       services_packages (
//         name,
//         types,
//         description,
//         sort_order,
//         categories (id, name)
//       )
//     `,
//     )
//     .eq("is_active", true)
//     .order("sort_order");

//   if (error || !services?.length) {
//     return (
//       <div className="flex flex-col px-4 pt-20 pb-32">
//         <div className="fixed top-0 left-0 h-20 w-full bg-black" />
//         <div className="mx-auto py-10 font-lexend text-xl md:text-3xl">
//           Services and Pricing
//         </div>
//         <div className="pt-20 text-center">No services available</div>
//       </div>
//     );
//   }

//   // Get sorted package IDs by category
//   const getCategoryPackages = (categoryId: number) =>
//     services
//       .filter(
//         (service: AllService) =>
//           service.services_packages?.categories?.id === categoryId,
//       )
//       .reduce((acc: { pkgId: number; sortOrder: number }[], service: any) => {
//         const pkgId = service.package_id;
//         const pkgSortOrder = service.services_packages?.sort_order || 999;
//         if (!acc.find((p) => p.pkgId === pkgId)) {
//           acc.push({ pkgId, sortOrder: pkgSortOrder });
//         }
//         return acc;
//       }, [])
//       .sort((a, b) => a.sortOrder - b.sortOrder)
//       .map((item) => item.pkgId);

//   const washPackages = getCategoryPackages(1);
//   const detailingPackages = getCategoryPackages(3);

//   // Other Services (category 2) - grouped & sorted
//   const otherServicesCards = services
//     .filter((service: any) => service.services_packages?.categories?.id === 2)
//     .reduce((acc: any[], service: any) => {
//       const pkg = service.services_packages;
//       const existingCard = acc.find((card: any) => card.title === pkg?.name);

//       if (existingCard) {
//         existingCard.services.push({
//           service: service.name || "",
//           price: service.price?.toString() || "0",
//         });
//       } else {
//         acc.push({
//           title: pkg?.name || "Unknown",
//           subtitle: pkg?.description || "",
//           sortOrder: pkg?.sort_order || 999,
//           services: [
//             {
//               service: service.name || "",
//               price: service.price?.toString() || "0",
//             },
//           ],
//         });
//       }
//       return acc;
//     }, [])
//     .sort((a: any, b: any) => (a.sortOrder || 999) - (b.sortOrder || 999));

//   return (
//     <div className="flex flex-col px-4 pt-20 pb-32">
//       <div className="fixed top-0 left-0 h-20 w-full bg-black" />

//       <h1 className="mx-auto py-10 font-lexend text-xl md:text-3xl">
//         Services and Pricing
//       </h1>

//       {/* Wash Services */}
//       <section className="max-w-9xl mx-auto grid gap-7 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
//         {washPackages.map((packageId) => (
//           <ServicesCard3
//             key={`wash-${packageId}`}
//             services={services}
//             packageId={packageId}
//           />
//         ))}
//       </section>

//       {/* Other Services */}
//       <h2 className="mx-auto py-10 font-lexend text-xl md:text-3xl">
//         Other Services
//       </h2>
//       <section className="max-w-9xl mx-auto grid gap-7 px-4 pb-20 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
//         {otherServicesCards.map((serviceCard: any, index: number) => (
//           <ServicesCard4
//             key={`${serviceCard.title}-${index}`}
//             serviceCard={serviceCard}
//           />
//         ))}
//       </section>

//       {/* Detailing Services */}
//       <h2 className="mx-auto py-10 font-lexend text-xl md:text-3xl">
//         Detailing Services
//       </h2>
//       <section className="max-w-9xl mx-auto grid gap-7 px-4 pb-20 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
//         {detailingPackages.map((packageId) => (
//           <ServicesCard3
//             key={`detail-${packageId}`}
//             services={services}
//             packageId={packageId}
//           />
//         ))}
//       </section>
//     </div>
//   );
// }
