import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";

type FAQProps = {
  title?: string;
};

const FAQ = async ({ title = "Frequently Asked Questions" }: FAQProps) => {
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
    .select("id, question, answer")
    .eq("is_active", true)
    .order("sort_order")
    .order("id");

  if (error) {
    console.error("Failed to load FAQs:", error);
    return null;
  }

  const items = data ?? [];
  if (items.length === 0) return null;

  return (
    <section className="w-full bg-black/90 px-6 py-12 text-white sm:px-10 lg:px-24 lg:py-20">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <div className="text-center">
          <h2 className="font-lexend text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-3 font-questrial text-sm text-white/80 sm:text-base lg:text-lg">
            Find quick answers to the questions our guests ask most often.
          </p>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <details
              key={item.id}
              className="group rounded-lg border border-white/10 bg-black/60 p-4 transition-colors duration-200 hover:border-yellow-400/70 sm:p-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                <span className="font-lexend text-sm font-semibold sm:text-base lg:text-lg">
                  {item.question}
                </span>
                <span className="shrink-0 rounded-full border border-white/20 bg-white/5 px-2 py-1 font-lexend text-xs text-white/80 transition-transform duration-200 group-open:rotate-90">
                  +
                </span>
              </summary>
              <p className="mt-3 font-questrial text-sm text-white/80 sm:text-base lg:text-lg">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
