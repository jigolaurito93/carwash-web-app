import Link from "next/link";
import { cookies } from "next/headers";
import { format } from "date-fns";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";
import type { LegalDocument, LegalSlug } from "@/lib/app.types";
import LegalDocumentBody from "@/components/legal/LegalDocumentBody";

const OTHER_DOCUMENT: Record<LegalSlug, { href: string; label: string }> = {
  privacy: { href: "/terms", label: "Terms of Service" },
  terms: { href: "/privacy", label: "Privacy Policy" },
};

const FALLBACK_TITLE: Record<LegalSlug, string> = {
  privacy: "Privacy Policy",
  terms: "Terms of Service",
};

export default async function LegalPage({ slug }: { slug: LegalSlug }) {
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
    .from("legal_documents")
    .select("*")
    .eq("slug", slug)
    .eq("is_current", true)
    .maybeSingle();

  if (error) {
    console.error(`Failed to load the ${slug} document:`, error.message);
  }

  const document = (error ? null : data) as LegalDocument | null;
  const other = OTHER_DOCUMENT[slug];

  return (
    <main className="min-h-screen bg-black/95 pt-28 pb-20">
      <div className="px-4 sm:px-6">
        <article className="mx-auto max-w-3xl rounded-2xl border-t-4 border-yellow-400 bg-zinc-50 px-6 py-10 shadow-2xl sm:px-10 sm:py-12">
          <header className="border-b border-zinc-200 pb-6">
            <p className="font-questrial text-xs tracking-[0.2em] text-zinc-400 uppercase">
              Legal
            </p>
            <h1 className="mt-2 font-lexend text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
              {document?.title ?? FALLBACK_TITLE[slug]}
            </h1>
            {document ? (
              <p className="mt-3 font-questrial text-sm text-zinc-500">
                Last updated{" "}
                {format(new Date(document.created_at), "MMMM d, yyyy")}
                <span className="mx-2 text-zinc-300">|</span>
                Version {document.version}
              </p>
            ) : null}
          </header>

          <div className="pt-2">
            {document ? (
              <LegalDocumentBody body={document.body} />
            ) : (
              <p className="mt-6 font-questrial text-[15px] leading-7 text-zinc-600">
                This document has not been published yet. Please{" "}
                <Link href="/contact" className="text-yellow-600 underline">
                  contact us
                </Link>{" "}
                if you need a copy in the meantime.
              </p>
            )}
          </div>

          <footer className="mt-12 flex flex-col gap-2 border-t border-zinc-200 pt-6 font-questrial text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
            <Link href={other.href} className="hover:text-zinc-800">
              Read our {other.label}
            </Link>
            <Link href="/contact" className="hover:text-zinc-800">
              Questions? Contact us
            </Link>
          </footer>
        </article>
      </div>
    </main>
  );
}
