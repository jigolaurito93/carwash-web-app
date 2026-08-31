import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import type { WelcomeContent } from "@/lib/app.types";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import WelcomeContentForm from "@/components/admin/WelcomeContentForm";

export default async function AdminWelcomePage() {
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
    .from("welcome_content")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data || data.body_paragraphs.length < 1) {
    return (
      <div className="p-8 font-questrial text-red-600">
        Failed to load welcome content. Make sure the{" "}
        <code>welcome_content</code> table exists, then run{" "}
        <code>pnpm gen:types</code>.
      </div>
    );
  }

  const welcome: WelcomeContent = {
    id: data.id,
    headline: data.headline,
    tagline: data.tagline,
    intro: data.intro,
    subheading: data.subheading,
    body_paragraphs: data.body_paragraphs,
    cta_label: data.cta_label,
    cta_href: data.cta_href,
    image_path: data.image_path,
    image_alt: data.image_alt,
    updated_at: data.updated_at,
  };

  return (
    <div>
      <AdminPageHeader title="Welcome" />
      <WelcomeContentForm welcome={welcome} />
    </div>
  );
}
