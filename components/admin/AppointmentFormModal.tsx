import React from "react";

const AppointmentFormModal = () => {
  return <div>AppointmentFormModal</div>;
};

export default AppointmentFormModal;

// "use client";

// import { useState, useEffect, useRef } from "react";
// import { DatePickerTime } from "../ui/date-picker-time";
// import {
//   createAppointment,
//   deleteAppointment,
//   updateAppointment,
// } from "@/app/(admin-protected)/admin/dashboard/actions"; // Add update/delete actions
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";

// type Appointment = {
//   id: string;
//   customer_name: string;
//   phone_number: string | null;
//   appointment_date: string;
//   service: string;
//   notes: string | null;
//   status: string;
// };

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   mode: "create" | "edit";
//   appointment: Appointment | null;
//   onDelete?: () => void; // Optional callback for delete confirmation
// };

// export default function AppointmentFormModal({
//   open,
//   onClose,
//   mode,
//   appointment,
//   onDelete,
// }: Props) {
//   const [customerName, setCustomerName] = useState("");
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>();
//   const [service, setService] = useState("Basic Wash ($20)");
//   const [notes, setNotes] = useState("");
//   const [phone, setPhone] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const modalRef = useRef<HTMLDivElement>(null);
//   const [isCalendarOpen, setIsCalendarOpen] = useState(false);
//   const router = useRouter();

//   // Reset and populate form when modal opens or appointment changes
//   useEffect(() => {
//     if (!open) {
//       // Reset form when modal closes
//       setCustomerName("");
//       setSelectedDate(undefined);
//       setService("Basic Wash ($20)");
//       setNotes("");
//       setPhone("");
//       setIsCalendarOpen(false);
//       setIsSubmitting(false);
//       return;
//     }

//     if (mode === "edit" && appointment) {
//       // Populate form for edit mode
//       setCustomerName(appointment.customer_name);
//       setPhone(appointment.phone_number || "");
//       setService(appointment.service);
//       setNotes(appointment.notes || "");

//       // Parse appointment date
//       const date = new Date(appointment.appointment_date);
//       if (!isNaN(date.getTime())) {
//         setSelectedDate(date);
//       }
//     } else {
//       // Reset for create mode
//       setCustomerName("");
//       setPhone("");
//       setService("Basic Wash ($20)");
//       setNotes("");
//       setSelectedDate(undefined);
//     }
//   }, [open, mode, appointment]);

//   // Close on outside click (EXCEPT calendar)
//   useEffect(() => {
//     if (!open) return;

//     const handleClickOutside = (event: MouseEvent) => {
//       if (isCalendarOpen) return;
//       if (
//         modalRef.current &&
//         !modalRef.current.contains(event.target as Node)
//       ) {
//         onClose();
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [onClose, isCalendarOpen, open]);

//   // Prevent body scroll
//   useEffect(() => {
//     if (open) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "unset";
//     }
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, [open]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     if (!selectedDate) {
//       toast.error("Please select a date and time");
//       setIsSubmitting(false);
//       return;
//     }
//     if (!service) {
//       toast.error("Please select service");
//       setIsSubmitting(false);
//       return;
//     }

//     const payload = {
//       customer_name: customerName || "unknown",
//       appointment_date: selectedDate.toISOString(),
//       service,
//       notes: notes || null,
//       phone_number: phone || null,
//     };

//     let result;
//     if (mode === "create") {
//       result = await createAppointment(payload);
//     } else {
//       // You'll need to add updateAppointment action
//       result = await updateAppointment(appointment!.id, payload);
//     }

//     setIsSubmitting(false);

//     if (result?.success) {
//       toast.success(
//         mode === "create"
//           ? "Appointment created successfully"
//           : "Appointment updated successfully",
//       );
//       router.refresh();
//       onClose();
//     } else {
//       toast.error(result?.error || "Something went wrong");
//     }
//   };

//   const handleDelete = async () => {
//     if (!appointment) return;

//     if (confirm("Are you sure you want to delete this appointment?")) {
//       const result = await deleteAppointment(appointment.id);
//       if (result?.success) {
//         toast.success("Appointment deleted successfully");
//         router.refresh();
//         onClose();
//       } else {
//         toast.error(result?.error || "Failed to delete appointment");
//       }
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
//       <div
//         ref={modalRef}
//         className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-2xl"
//       >
//         {/* Header */}
//         <div className="border-b border-gray-100 p-6">
//           <div className="flex items-center justify-between">
//             <h2 className="font-lexend text-2xl font-bold text-gray-900">
//               {mode === "create" ? "New Appointment" : `Edit Appointment`}
//             </h2>
//             <button
//               onClick={onClose}
//               className="-m-2 rounded-full p-2 text-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900"
//               disabled={isSubmitting}
//             >
//               ×
//             </button>
//           </div>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-6 p-6">
//           {/* Customer Name */}
//           <div>
//             <label className="mb-2 block text-xs font-medium tracking-wide text-gray-700 uppercase">
//               Customer Name
//             </label>
//             <input
//               value={customerName}
//               onChange={(e) => setCustomerName(e.target.value)}
//               className="inputx"
//               placeholder="John Doe"
//               required
//               disabled={isSubmitting}
//             />
//           </div>

//           {/* Phone Number */}
//           <div>
//             <label className="mb-2 block text-xs font-medium tracking-wide text-gray-700 uppercase">
//               Phone Number
//             </label>
//             <input
//               type="tel"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               className="inputx"
//               placeholder="(123) 456-7890"
//               disabled={isSubmitting}
//             />
//           </div>

//           {/* Date Picker */}
//           <div>
//             <label className="mb-4 block text-xs font-medium tracking-wide text-gray-700 uppercase">
//               Appointment Date & Time
//             </label>
//             <DatePickerTime
//               date={selectedDate}
//               onDateChange={setSelectedDate}
//               isCalendarOpen={isCalendarOpen}
//               onCalendarOpenChange={setIsCalendarOpen}
//             />
//           </div>

//           {/* Service */}
//           <div>
//             <label className="mb-2 block text-xs font-medium tracking-wide text-gray-700 uppercase">
//               Service
//             </label>
//             <select
//               value={service}
//               onChange={(e) => setService(e.target.value)}
//               className="inputx"
//               required
//               disabled={isSubmitting}
//             >
//               {[
//                 "Basic Wash ($20)",
//                 "Premium Wash ($35)",
//                 "Deluxe Wash ($50)",
//               ].map((s, i) => (
//                 <option key={i} value={s}>
//                   {s}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Notes */}
//           <div>
//             <label className="mb-2 block text-xs font-medium tracking-wide text-gray-700 uppercase">
//               Notes (Optional)
//             </label>
//             <textarea
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               className="inputx resize-vertical h-24"
//               placeholder="Customer preferences, special instructions, vehicle details..."
//               maxLength={500}
//               disabled={isSubmitting}
//             />
//             <p className="mt-1 text-xs text-gray-500">
//               {notes.length}/500 characters
//             </p>
//           </div>

//           {/* Buttons */}
//           <div className="flex gap-3 pt-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 rounded-xl border border-gray-300 px-6 py-3 text-lg font-semibold text-gray-700 hover:bg-gray-50"
//               disabled={isSubmitting}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="btnSaveYlw flex-1 rounded-xl px-6 py-3 text-lg font-semibold"
//               disabled={isSubmitting}
//             >
//               {isSubmitting
//                 ? "Saving..."
//                 : mode === "create"
//                   ? "Create Appointment"
//                   : "Update Appointment"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
