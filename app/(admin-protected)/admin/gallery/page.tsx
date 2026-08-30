import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { LiaLongArrowAltLeftSolid } from "react-icons/lia";
import type { Database } from "@/lib/database.types";
import type { GalleryImage } from "@/lib/app.types";
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
      <div className="mb-12 flex items-center justify-between">
        <h1 className="adminHeader">Gallery</h1>
        <Link
          href="/admin/dashboard"
          className="btnSaveYlw flex items-center gap-2"
        >
          <LiaLongArrowAltLeftSolid className="h-6 w-6" />
          <span>Back To Dashboard</span>
        </Link>
      </div>
      <GalleryAdmin images={images} />
    </div>
  );
}
