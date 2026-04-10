import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function ServicesPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );

  const { data: services } = await supabase
    .from("services1")
    .select(
      `
      *,
      categories1(name, card_layout)
    `,
    )
    .eq("is_active", true)
    .order("sort_order");

  return (
    <div className="p-8">
      <h1 className="mb-8 text-3xl font-bold">Services</h1>
      <pre>{JSON.stringify(services, null, 2)}</pre>
    </div>
  );
}
