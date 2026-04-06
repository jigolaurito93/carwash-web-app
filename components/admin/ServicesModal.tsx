import React from "react";

const ServicesModal = () => {
  return <div>ServicesModal</div>;
};

export default ServicesModal;

// "use client";

// import { useState, FormEvent } from "react";
// import { useRouter } from "next/navigation";
// import type { Database } from "@/lib/database.types";
// import {
//   createService,
//   updateService,
// } from "@/app/(admin-protected)/admin/services/actions";
// import { FiPlusCircle } from "react-icons/fi";
// import { IoMdCloseCircle } from "react-icons/io";
// import { toast } from "sonner";

// type ServiceRow = Database["public"]["Tables"]["services"]["Row"];

// interface ServicesModalProps {
//   service: ServiceRow | null; // null = Create Mode, object = Edit Mode
//   onClose: () => void;
// }

// export default function ServicesModal({
//   service,
//   onClose,
// }: ServicesModalProps) {
//   const router = useRouter();
//   const isEdit = !!service;

//   // 1. Logic-specific State for the Features list (Types)
//   const [dynamicFeatures, setDynamicFeatures] = useState<string[]>(
//     Array.isArray(service?.types) ? (service.types as string[]) : [""],
//   );
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // 2. Dynamic Feature Handlers
//   const addFeature = () => setDynamicFeatures([...dynamicFeatures, ""]);
//   const removeFeature = (index: number) =>
//     setDynamicFeatures(dynamicFeatures.filter((_, i) => i !== index));
//   const updateFeature = (index: number, value: string) => {
//     const next = [...dynamicFeatures];
//     next[index] = value;
//     setDynamicFeatures(next);
//   };

//   // 3. Submission Logic
//   async function onSubmit(e: FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setError(null);
//     setSaving(true);

//     const formData = new FormData(e.currentTarget);
//     const cleanFeatures = dynamicFeatures.filter((f) => f.trim() !== "");

//     const payload = {
//       name: formData.get("name") as string,
//       subtitle: (formData.get("subtitle") as string) || null,
//       types: cleanFeatures,
//       price_car: Number(formData.get("price_car")) || 0,
//       price_mid: Number(formData.get("price_mid")) || 0,
//       price_full: Number(formData.get("price_full")) || 0,
//       sort_order: Number(formData.get("sort_order")) || 0,
//       is_active: formData.get("is_active") === "on",
//     };

//     const result = isEdit
//       ? await updateService(service.id, payload)
//       : await createService(payload);

//     if (result.success) {
//       toast.success(isEdit ? "Service updated" : "Service created");
//       router.refresh();
//       onClose();
//     } else {
//       toast.error(result.error);
//       setError(result.error);
//       setSaving(false);
//     }
//   }

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
//       onClick={onClose}
//     >
//       <div
//         className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <h2 className="mb-4 font-questrial text-2xl font-bold tracking-tight text-gray-900 uppercase">
//           {isEdit ? `Edit: ${service.name}` : "Add New Service"}
//         </h2>

//         <form onSubmit={onSubmit} className="space-y-4">
//           {error && (
//             <p className="rounded border border-red-100 bg-red-50 p-2 text-sm font-bold text-red-600">
//               {error}
//             </p>
//           )}

//           {/* Basic Info */}
//           <div className="grid gap-4">
//             <div>
//               <label className="mb-1 block font-questrial text-xs font-bold text-gray-400 uppercase">
//                 Service Name
//               </label>
//               <input
//                 name="name"
//                 defaultValue={service?.name || ""}
//                 required
//                 className="w-full border border-gray-200 px-2 py-1 shadow-sm transition-colors outline-none focus:border-gray-400"
//                 placeholder="e.g. Full Detail"
//               />
//             </div>
//             <div>
//               <label className="mb-1 block font-questrial text-xs font-bold text-gray-400 uppercase">
//                 Subtitle
//               </label>
//               <input
//                 name="subtitle"
//                 defaultValue={service?.subtitle || ""}
//                 className="w-full border border-gray-200 px-2 py-1 shadow-sm transition-colors outline-none focus:border-gray-400"
//                 placeholder="e.g. Best for luxury vehicles"
//               />
//             </div>
//           </div>

//           {/* Features Section (Dynamic Rows) */}
//           <div>
//             <label className="mb-2 block font-questrial text-xs font-bold text-gray-400 uppercase">
//               Features & Inclusion
//             </label>
//             <div className="scrollbar-thin max-h-40 space-y-2 overflow-y-auto pr-2">
//               {dynamicFeatures.map((feature, index) => (
//                 <div key={index} className="flex items-center gap-2">
//                   <input
//                     value={feature}
//                     onChange={(e) => updateFeature(index, e.target.value)}
//                     placeholder="e.g. Clay Bar Treatment"
//                     className="flex-1 border border-gray-200 px-2 py-1 text-sm shadow-sm outline-none focus:border-gray-300"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeFeature(index)}
//                     className="text-red-400 transition-colors hover:text-red-600"
//                   >
//                     <IoMdCloseCircle className="h-5 w-5" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//             <button
//               type="button"
//               onClick={addFeature}
//               className="mt-3 flex cursor-pointer items-center gap-2 rounded border border-gray-400 p-2 font-questrial text-xs font-bold tracking-widest text-gray-500 uppercase transition-colors hover:border-yellow-400 hover:bg-yellow-50 hover:text-yellow-700"
//             >
//               <FiPlusCircle /> Add Service Option
//             </button>
//           </div>

//           {/* Pricing Grid */}
//           <div className="grid grid-cols-3 gap-3 border-t border-b border-gray-50 py-4">
//             {[
//               {
//                 label: "Car/Sedan",
//                 name: "price_car",
//                 val: service?.price_car,
//               },
//               { label: "Mid/SUV", name: "price_mid", val: service?.price_mid },
//               {
//                 label: "Full/Truck",
//                 name: "price_full",
//                 val: service?.price_full,
//               },
//             ].map((item) => (
//               <div key={item.name}>
//                 <label className="mb-1 block font-questrial text-xs font-bold tracking-wider text-gray-400 uppercase">
//                   {item.label}
//                 </label>
//                 <input
//                   name={item.name}
//                   type="number"
//                   defaultValue={item.val ?? ""}
//                   className="w-full border border-gray-200 px-2 py-1 text-sm shadow-sm outline-none focus:border-gray-400"
//                 />
//               </div>
//             ))}
//           </div>

//           {/* Bottom Settings */}
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div>
//                 <label className="mb-1 block font-questrial text-xs font-bold text-gray-400 uppercase">
//                   Sort Order
//                 </label>
//                 <input
//                   name="sort_order"
//                   type="number"
//                   defaultValue={service?.sort_order ?? 0}
//                   className="w-16 border border-gray-200 px-2 py-1 shadow-sm outline-none focus:border-gray-400"
//                 />
//               </div>
//               <div className="flex items-center gap-2 pt-5">
//                 <input
//                   type="checkbox"
//                   name="is_active"
//                   defaultChecked={service ? service.is_active : true}
//                   id="service_active"
//                   className="h-4 w-4 cursor-pointer accent-yellow-400"
//                 />
//                 <label
//                   htmlFor="service_active"
//                   className="cursor-pointer font-questrial text-sm font-bold text-gray-700"
//                 >
//                   Active
//                 </label>
//               </div>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="mt-4 flex justify-end gap-3 border-t pt-6">
//             <button
//               type="button"
//               onClick={onClose}
//               className="btnCancel text-sm"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={saving}
//               className={`btnSave text-sm ${
//                 isEdit
//                   ? "bg-yellow-400 text-black hover:bg-yellow-500"
//                   : "bg-black text-white hover:bg-zinc-800"
//               } disabled:bg-gray-400`}
//             >
//               {saving
//                 ? "Saving..."
//                 : isEdit
//                   ? "Update Service"
//                   : "Create Service"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
