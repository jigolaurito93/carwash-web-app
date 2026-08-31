import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import type { AboutContent } from "@/lib/app.types";
import { whyChooseUsSchema } from "@/lib/validations/about-schema";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AboutContentForm from "@/components/admin/AboutContentForm";

export default async function AdminAboutPage() {
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
    .from("about_content")
    .select("*")
    .eq("id", 1)
    .single();

  const why = data ? whyChooseUsSchema.safeParse(data.why_choose_us) : null;

  if (error || !data || !why?.success || data.story_paragraphs.length < 1) {
    return (
      <div className="p-8 font-questrial text-red-600">
        Failed to load about content. Make sure the <code>about_content</code>{" "}
        table exists, then run <code>pnpm gen:types</code>.
      </div>
    );
  }

  const about: AboutContent = {
    id: data.id,
    owner_name: data.owner_name,
    story_paragraphs: data.story_paragraphs,
    mission: data.mission,
    why_choose_us: why.data,
    updated_at: data.updated_at,
  };

  return (
    <div>
      <AdminPageHeader title="About" />
      <AboutContentForm about={about} />
    </div>
  );
}
