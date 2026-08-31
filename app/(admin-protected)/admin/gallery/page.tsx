import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import type { GalleryImage } from "@/lib/app.types";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import GalleryAdmin from "@/components/admin/GalleryAdmin";

export default async function AdminGalleryPage() {
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
    .from("gallery_images")
    .select("*")
    .order("sort_order")
    .order("id");

  if (error) {
    return (
      <div className="p-8 font-questrial text-red-600">
        Failed to load gallery images. Make sure the <code>gallery_images</code>{" "}
        table exists, then run <code>pnpm gen:types</code>.
      </div>
    );
  }

  const images = (data ?? []) as GalleryImage[];

  return (
    <div>
      <AdminPageHeader title="Gallery" />
      <GalleryAdmin images={images} />
    </div>
  );
}
