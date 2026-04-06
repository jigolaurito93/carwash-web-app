// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import type { Database } from "@/lib/database.types";
// import { deleteOtherService } from "./actions";
// import OtherServicesModal from "@/components/admin/OtherServicesModal";
// import { FiPlusCircle } from "react-icons/fi";
// import { toast } from "sonner";

// type OtherServiceRow = Database["public"]["Tables"]["otherServices"]["Row"];

// // Properly display services JSON in bullet form
// function renderTypes(types: any) {
//   if (!types || !Array.isArray(types))
//     return <span className="text-gray-400">—</span>;

//   return (
//     <div className="flex flex-col gap-1">
//       {types.map((t: any, i: number) => (
//         <div
//           key={i}
//           className="flex items-center justify-between gap-4 text-sm"
//         >
//           {/* Group Bullet + Service Name */}
//           <div className="flex items-center gap-2">
//             <span className="h-1 w-1 shrink-0 rounded-full bg-black" />
//             <span className="font-medium text-gray-700">{t.service}</span>
//           </div>

//           {/* Price stays on the right */}
//           <span className="text-gray-500 tabular-nums">${t.price || 0}</span>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default function OtherServicesTable({
//   services,
// }: {
//   services: OtherServiceRow[];
// }) {
//   const router = useRouter();

//   // State for Modal
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedService, setSelectedService] =
//     useState<OtherServiceRow | null>(null);

//   const handleEdit = (service: OtherServiceRow) => {
//     setSelectedService(service);
//     setIsModalOpen(true);
//   };

//   const handleCreate = () => {
//     setSelectedService(null);
//     setIsModalOpen(true);
//   };

//   const handleDelete = (id: number, title: string) => {
//     toast.custom(
//       (t) => (
//         <div className="w-87.5 rounded-xl bg-black p-6 shadow-2xl">
//           <div className="flex flex-col items-center text-center">
//             {/* Warning Icon */}
//             <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-black">
//               <span className="text-xl font-bold">!</span>
//             </div>

//             <h3 className="font-lexend text-lg font-bold text-white uppercase">
//               Confirm Deletion
//             </h3>
//             <p className="mt-2 font-questrial text-sm text-gray-400">
//               Are you sure you want to remove{" "}
//               <span className="text-yellow-400">&quot;{title}&quot;</span>? This
//               cannot be undone.
//             </p>

//             <div className="mt-6 flex w-full gap-3">
//               <button
//                 onClick={() => toast.dismiss(t)}
//                 className="flex-1 cursor-pointer rounded-md border border-zinc-700 bg-white py-2 font-questrial text-xs font-bold tracking-wider text-black transition-colors hover:bg-zinc-200"
//               >
//                 CANCEL
//               </button>
//               <button
//                 onClick={async () => {
//                   toast.dismiss(t);
//                   const res = await deleteOtherService(id);
//                   if (res.success) {
//                     toast.success("Service removed.");
//                     router.refresh();
//                   } else {
//                     toast.error("Error: " + res.error);
//                   }
//                 }}
//                 className="flex-1 cursor-pointer rounded-md bg-red-600 py-2 font-questrial text-xs font-bold tracking-wider text-white transition-all hover:bg-red-500 active:scale-95"
//               >
//                 DELETE
//               </button>
//             </div>
//           </div>
//         </div>
//       ),
//       { duration: Infinity },
//     );
//   };

//   return (
//     <div className="mt-12 font-questrial">
//       <div className="mb-6 flex items-center justify-between">
//         <h2 className="font-questrial text-3xl font-bold tracking-wider text-gray-900">
//           Other Services
//         </h2>
//         <button
//           onClick={handleCreate}
//           className="flex cursor-pointer items-center justify-center gap-2 rounded bg-black px-4 py-2 font-questrial text-sm font-bold text-white transition-all hover:bg-zinc-800"
//         >
//           <FiPlusCircle className="h-4 w-4" />
//           Add Service
//         </button>
//       </div>

//       <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
//         <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
//           <thead className="bg-gray-50 font-questrial">
//             <tr>
//               <th className="px-4 py-3 font-semibold text-gray-700">Title</th>
//               <th className="hidden px-4 py-3 font-semibold text-gray-700 sm:table-cell">
//                 Description (Optional)
//               </th>
//               <th className="px-4 py-3 text-center font-semibold text-gray-700">
//                 Services and Pricing
//               </th>
//               <th className="px-4 py-3 text-center font-semibold text-gray-700">
//                 Status
//               </th>
//               <th className="px-4 py-3 text-center font-semibold text-gray-700">
//                 Order
//               </th>
//               <th className="px-4 py-3 text-right font-semibold text-gray-700">
//                 Actions
//               </th>
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-gray-200 bg-white">
//             {services.length === 0 ? (
//               <tr>
//                 <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
//                   No other services found.
//                 </td>
//               </tr>
//             ) : (
//               services.map((row) => (
//                 <tr key={row.id} className="transition-colors hover:bg-gray-50">
//                   <td className="px-4 py-3 align-top font-medium text-gray-900">
//                     {row.title}
//                   </td>
//                   <td className="hidden px-4 py-3 align-top font-medium text-gray-500 sm:table-cell">
//                     {row.subtitle ?? "—"}
//                   </td>
//                   <td className="px-4 py-3 align-top">
//                     {renderTypes(row.types)}
//                   </td>
//                   <td className="px-4 py-3 text-center align-top">
//                     <span
//                       className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
//                         row.is_active
//                           ? "bg-green-100 text-green-800"
//                           : "bg-gray-100 text-gray-600"
//                       }`}
//                     >
//                       {row.is_active ? "Active" : "Hidden"}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-center align-top text-gray-500">
//                     {row.sort_order}
//                   </td>
//                   <td className="px-4 py-3 align-top font-questrial tracking-wider">
//                     <div className="ml-auto flex w-20 flex-col items-stretch gap-2">
//                       <button
//                         onClick={() => handleEdit(row)}
//                         className="cursor-pointer rounded border border-gray-200 bg-white px-2 py-1 text-xs font-bold transition-all hover:bg-yellow-400"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(row.id, row.title)}
//                         className="cursor-pointer rounded border border-red-100 bg-red-50 px-2 py-1 text-xs font-bold text-red-600 transition-all hover:bg-red-600 hover:text-white"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Reusable Modal Component */}
//       {isModalOpen && (
//         <OtherServicesModal
//           service={selectedService}
//           onClose={() => setIsModalOpen(false)}
//         />
//       )}
//     </div>
//   );
// }
