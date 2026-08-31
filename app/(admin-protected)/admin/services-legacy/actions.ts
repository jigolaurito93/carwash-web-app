// "use server";

// import { revalidatePath } from "next/cache";
// // 1. USE THE SERVER CLIENT (SSR)
// import { createServerClient } from "@supabase/ssr";
// import { cookies } from "next/headers";
// import type { Database } from "@/lib/database.types";

// // Helper to get supabase inside the action
// async function getSupabase() {
//   const cookieStore = await cookies();
//   return createServerClient<Database>(
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
// }

// export async function createService(payload: any) {
//   const supabase = await getSupabase();

//   // 2. Optional: Add a quick check to see if they are actually logged in
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) return { success: false, error: "Unauthorized" };

//   const { error } = await supabase.from("services").insert(payload);
//   if (error) return { success: false, error: error.message };

//   // Clears the server-side cache so the next request gets fresh data from the DB.
//   revalidatePath("/admin/services");
//   return { success: true };
// }

// export async function updateService(id: number, payload: any) {
//   const supabase = await getSupabase();

//   const { error } = await supabase
//     .from("services")
//     .update(payload)
//     .eq("id", id);

//   if (error) return { success: false, error: error.message };

//   // Clears the server-side cache so the next request gets fresh data from the DB.
//   revalidatePath("/admin/services");
//   return { success: true };
// }

// export async function deleteService(id: number) {
//   const supabase = await getSupabase();

//   // Security check
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) return { success: false, error: "Unauthorized" };

//   const { error } = await supabase.from("services").delete().eq("id", id);

//   if (error) return { success: false, error: error.message };

//   revalidatePath("/admin/services");
//   revalidatePath("/services"); // Update public page too
//   return { success: true };
// }

// //////////////////////////////////////////////////////////////////////////
// //                    OTHER SERVICES ACTIONS
// //////////////////////////////////////////////////////////////////////////

// // Create A Row in Table
// export async function createOtherService(
//   payload: Database["public"]["Tables"]["otherServices"]["Insert"],
// ) {
//   const supabase = await getSupabase();

//   // Security check
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) return { success: false, error: "Unauthorized" };

//   const { error } = await supabase.from("otherServices").insert(payload);

//   if (error) return { success: false, error: error.message };

//   revalidatePath("/admin/services");
//   return { success: true };
// }

// // Delete A Row in Table
// export async function deleteOtherService(id: number) {
//   const supabase = await getSupabase();

//   // Security check
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) return { success: false, error: "Unauthorized" };

//   const { error } = await supabase.from("otherServices").delete().eq("id", id);

//   if (error) return { success: false, error: error.message };

//   revalidatePath("/admin/services");
//   return { success: true };
// }

// //Update A Row in Table
// export async function updateOtherService(
//   id: number,
//   payload: Database["public"]["Tables"]["otherServices"]["Update"],
// ) {
//   const supabase = await getSupabase();

//   // Security check
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) return { success: false, error: "Unauthorized" };

//   const { error } = await supabase
//     .from("otherServices")
//     .update(payload)
//     .eq("id", id);

//   if (error) return { success: false, error: error.message };

//   revalidatePath("/admin/services");
//   return { success: true };
// }

// // Delete A Row in All Services Table
// export async function deleteAllServiceRow(id: number) {
//   const supabase = await getSupabase();

//   // Security check
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) return { success: false, error: "Unauthorized" };

//   const { error } = await supabase.from("services_all").delete().eq("id", id);

//   if (error) return { success: false, error: error.message };

//   revalidatePath("/admin/all-services");
//   return { success: true };
// }

// // Create A Row in Table
// export async function createAllServiceRow(
//   payload: Database["public"]["Tables"]["services_all"]["Insert"],
// ) {
//   const supabase = await getSupabase();

//   // Security check
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) return { success: false, error: "Unauthorized" };

//   const { error } = await supabase.from("services_all").insert(payload);

//   if (error) return { success: false, error: error.message };

//   revalidatePath("/admin/all-services");
//   return { success: true };
// }

// //Update A Row in Table
// export async function updateAllServiceRow(
//   id: number,
//   payload: Database["public"]["Tables"]["services_all"]["Update"],
// ) {
//   const supabase = await getSupabase();

//   // Security check
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) return { success: false, error: "Unauthorized" };

//   const { error } = await supabase
//     .from("services_all")
//     .update(payload)
//     .eq("id", id);

//   if (error) return { success: false, error: error.message };

//   revalidatePath("/admin/all-services");
//   return { success: true };
// }
