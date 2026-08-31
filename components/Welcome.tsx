import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";

export default async function Welcome() {
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
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-stretch gap-6 bg-black/90 px-8 py-20 text-white sm:px-40 md:flex-row md:gap-0 md:px-0 md:py-0 lg:p-0 xl:h-screen">
      <div className="hidden min-h-full md:flex md:w-1/2">
        <Image
          alt={data.image_alt}
          src={data.image_path}
          width={1000}
          height={1000}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex min-h-full flex-col gap-5 md:w-1/2 md:justify-center md:px-10 lg:px-18 2xl:px-32">
        <div className="flex flex-col text-center text-white lg:mb-7">
          <div className="font-bungee text-3xl font-bold text-yellow-400 lg:text-4xl xl:text-5xl 2xl:text-6xl">
            {data.headline}
          </div>
          <div className="font-bungee 2xl:text-2xl">
            &rdquo;{data.tagline}&rdquo;
          </div>
        </div>
        <div className="font-lexend text-sm">{data.intro}</div>
        <div className="mt-6 font-bungee text-2xl font-bold lg:text-3xl">
          {data.subheading}
        </div>
        {data.body_paragraphs.map((paragraph, index) => (
          <div key={index} className="font-lexend text-sm">
            {paragraph}
          </div>
        ))}
        <div className="mx-auto mt-8 w-fit cursor-pointer rounded-md bg-black px-7 py-3 text-center font-lexend text-sm shadow-lg transition-colors duration-300 hover:bg-black/50 lg:mt-14">
          <Link className="" href={data.cta_href}>
            {data.cta_label}
          </Link>
        </div>
      </div>
    </div>
  );
}
