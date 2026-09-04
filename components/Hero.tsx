import Image from "next/image";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";
import HeroCta from "@/components/HeroCta";

export default async function Hero() {
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

  const { data: shopInfo } = await supabase
    .from("shop_info")
    .select("phone")
    .single();

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Image
        src="/images/carwash-1.jpg"
        alt="Carwash Image"
        fill
        priority
        className="object-cover object-top"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 px-12">
        <div className="rounded-sm border px-12 font-bungee text-6xl font-bold text-white shadow-lg transition-colors duration-300 ease-in-out select-none hover:bg-white/40 hover:text-black sm:text-9xl">
          ONYX
        </div>
        <div className="font-lexend text-[17px] font-bold text-white italic sm:text-[33px]">
          PREMIUM CARWASH
        </div>
        <div className="text-center font-lexend text-sm text-white sm:text-lg lg:text-xl">
          &rdquo;The Gold Standard of Clean&rdquo;
        </div>
        <HeroCta phone={shopInfo?.phone ?? null} />
      </div>
    </div>
  );
}
