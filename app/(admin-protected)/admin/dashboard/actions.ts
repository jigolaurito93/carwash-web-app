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

// export async function createAppointment(payload: any) {
//   const supabase = await getSupabase();

//   // 2. Optional: Add a quick check to see if they are actually logged in
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) return { success: false, error: "Unauthorized" };

//   const { error } = await supabase.from("appointment").insert(payload);
//   if (error) return { success: false, error: error.message };

//   // Clears the server-side cache so the next request gets fresh data from the DB.
//   revalidatePath("/admin/appointment");
//   return { success: true };
// }

// export async function updateAppointment(id: string, payload: any) {
//   const supabase = await getSupabase();

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) return { success: false, error: "Unauthorized" };

//   const { error } = await supabase
//     .from("appointment")
//     .update(payload)
//     .eq("id", id);

//   if (error) return { success: false, error: error.message };

//   // Clears the server-side cache so the next request gets fresh data from the DB.
//   revalidatePath("/admin/appointment");
//   return { success: true };
// }

// export async function deleteAppointment(id: string) {
//   const supabase = await getSupabase();

//   // Security check
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) return { success: false, error: "Unauthorized" };

//   const { error } = await supabase.from("appointment").delete().eq("id", id);

//   if (error) return { success: false, error: error.message };

//   revalidatePath("/admin/appointment");
//   revalidatePath("/appointment");
//   return { success: true };
// }
