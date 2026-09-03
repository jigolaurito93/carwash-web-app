import Image from "next/image";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { PiTargetBold } from "react-icons/pi";
import type { Database } from "@/lib/database.types";
import type { AboutContent, WhyChooseUsItem } from "@/lib/app.types";
import { getWhyChooseIcon } from "@/lib/about-icons";
import { whyChooseUsSchema } from "@/lib/validations/about-schema";

function StoryParagraph({
  text,
  ownerName,
}: {
  text: string;
  ownerName: string;
}) {
  const name = ownerName.trim();
  if (!name || !text.includes(name)) {
    return <div>{text}</div>;
  }

  const parts = text.split(name);
  return (
    <div>
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 ? (
            <span className="text-2xl font-bold text-yellow-400 lg:text-4xl">
              {name}
            </span>
          ) : null}
        </span>
      ))}
    </div>
  );
}

export default async function About() {
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
      <div className="flex min-h-screen items-center justify-center bg-[#121212] p-8 text-white">
        <p className="font-questrial text-lg">
          About content is unavailable right now.
        </p>
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
      <div className="relative h-screen w-full overflow-hidden">
        <Image
          alt="carwash image mobile"
          src="/images/carwash-6.jpg"
          fill
          priority
          className="object-cover object-top lg:hidden"
        />
        <Image
          alt="carwash image desktop"
          src="/images/carwash-7.jpg"
          fill
          priority
          className="hidden object-cover object-top lg:block"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="flex w-full flex-col items-center gap-4 text-center">
            <div className="font-lexend text-6xl font-extrabold tracking-tighter text-yellow-400 drop-shadow-2xl sm:text-7xl lg:text-9xl">
              About Onyx
            </div>
            <div className="mt-2 max-w-125 px-6 font-lexend text-xs font-bold text-white italic sm:text-lg lg:max-w-[700] lg:text-xl">
              Premium hand car washing focused on quality, protection, and
              attention to detail.
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center bg-black/90 px-9 py-10 text-white md:px-24 md:py-20 lg:min-h-screen lg:px-36">
        <div className="text-center font-lexend text-5xl font-bold lg:text-6xl">
          Owner Story
        </div>
        <div className="mx-auto mt-8 flex flex-col items-center justify-center gap-5 font-questrial tracking-wide md:text-2xl lg:mt-16 lg:max-w-220 lg:text-2xl lg:tracking-widest">
          {about.story_paragraphs.map((paragraph, index) => (
            <StoryParagraph
              key={index}
              text={paragraph}
              ownerName={about.owner_name}
            />
          ))}
        </div>
      </div>

      <div className="px-9 py-10 md:px-24 md:py-20 lg:px-36">
        <div className="flex flex-col items-center justify-center gap-4 text-center font-lexend text-5xl font-bold md:flex-row lg:text-6xl">
          <div>Our Mission</div>
          <PiTargetBold className="text-yellow-400" size={80} />
        </div>
        <div className="mx-auto mt-8 text-center font-questrial md:text-2xl lg:mt-16 lg:max-w-220 lg:text-3xl">
          {about.mission}
        </div>
      </div>

      <div className="space-y-10 bg-black/90 px-9 py-10 text-white md:px-24 md:py-20 lg:px-12 2xl:px-36">
        <div className="flex flex-col items-center justify-center gap-4 text-center font-lexend text-5xl font-bold md:flex-row lg:text-6xl">
          <div className="tracking-tighter uppercase">Why Choose Us</div>
        </div>

        <div className="mx-auto mt-8 grid grid-cols-1 space-y-12 text-center font-questrial md:mt-16 md:grid-cols-2 md:space-y-8 md:space-x-8 md:text-2xl lg:grid-cols-4 lg:space-x-4 xl:mt-20 2xl:space-x-16">
          {about.why_choose_us.map((item: WhyChooseUsItem, index) => {
            const Icon = getWhyChooseIcon(item.icon, index);
            return (
              <div key={index} className="flex flex-col items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 md:h-14 md:w-14 lg:h-12 lg:w-12 2xl:h-14 2xl:w-14">
                  <Icon className="h-1/2 w-1/2 text-black" />
                </div>
                <div className="text-2xl font-bold tracking-tight text-yellow-400 uppercase lg:text-2xl">
                  {item.title}
                </div>
                <div className="max-w-xl text-xl lg:text-lg 2xl:text-xl">
                  {item.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
