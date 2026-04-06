// import { supabase } from "@/lib/supabase";
// import Link from "next/link";
// import { LiaLongArrowAltLeftSolid } from "react-icons/lia";

// export default async function AdminGalleryPage() {
//   // const { data } = await supabase
//   //   .from("gallery_images")
//   //   .select("*")
//   //   .order("sort_order");

//   return (
//     <div className="p-8">
//       <div className="mb-12 flex items-center justify-between">
//         <h1 className="adminHeader">Manage Services</h1>
//         <Link
//           href="/admin/dashboard"
//           className="btnSaveYlw flex items-center gap-2"
//         >
//           <LiaLongArrowAltLeftSolid className="h-6 w-6" />
//           <span>Back To Dashboard</span>
//         </Link>
//       </div>
//       {/* <pre className="rounded bg-gray-100 p-4">
//         {JSON.stringify(data, null, 2)}
//       </pre> */}
//       {/* TODO: Add UI for uploading/editing/deleting gallery images */}
//     </div>
//   );
// }
