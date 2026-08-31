import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import type { Faq } from "@/lib/app.types";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import FaqAdmin from "@/components/admin/FaqAdmin";

export default async function AdminFaqPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
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

  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("sort_order")
    .order("id");

  if (error) {
    return (
      <div className="p-8 font-questrial text-red-600">
        Failed to load FAQs. Make sure the <code>faqs</code> table exists, then
        run <code>pnpm gen:types</code>.
      </div>
    );
  }

  const faqs = (data ?? []) as Faq[];

  return (
    <div>
      <AdminPageHeader title="FAQs" />
      <FaqAdmin faqs={faqs} />
    </div>
  );
}
