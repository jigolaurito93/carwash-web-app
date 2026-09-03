import { Suspense } from "react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import type { GalleryImage } from "@/lib/app.types";
import GalleryGrid from "@/components/GalleryGrid";
import GalleryGridSkeleton from "@/components/gallery/GalleryGridSkeleton";

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-black/95 pt-28 text-white">
      <section className="px-6 py-16 sm:px-10 lg:px-24 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-lexend text-4xl font-extrabold tracking-tight text-yellow-400 drop-shadow-2xl sm:text-5xl lg:text-6xl">
            Onyx Gallery
          </h1>
          <p className="mt-4 font-questrial text-sm text-white/80 sm:text-base lg:text-lg">
            A look behind the shine. Explore real moments from the Onyx Hand
            Premium Wash experience from foamy hand washes to flawless finishes.
          </p>
        </div>
      </section>

      <Suspense fallback={<GalleryGridSkeleton />}>
        <GalleryImages />
      </Suspense>
    </main>
  );
}

async function GalleryImages() {
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
    .eq("is_active", true)
    .order("sort_order")
    .order("id");

  if (error) {
    console.error("Failed to load gallery images:", error);
  }

  const images = (error ? [] : (data ?? [])) as GalleryImage[];

  return <GalleryGrid images={images} />;
}
