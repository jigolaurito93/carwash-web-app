"use server";

import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { LegalSlug } from "@/lib/app.types";
import type { Database, Json } from "@/lib/database.types";
import {
  legalDocumentSchema,
  legalSlugSchema,
} from "@/lib/validations/legal-schema";

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
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
}

function revalidateLegal() {
  revalidatePath("/admin/legal");
  revalidatePath("/privacy");
  revalidatePath("/terms");
}

type Supabase = Awaited<ReturnType<typeof getSupabase>>;

type PublishResult =
  | { success: true; version: number }
  | { success: false; error: string };

type PublishInput = {
  slug: LegalSlug;
  title: string;
  body: Json;
  change_summary: string;
};

// Every publish appends a new version and retires the previous one, so the
// history stays intact and doubles as the audit trail.
async function appendVersion(
  supabase: Supabase,
  input: PublishInput,
): Promise<PublishResult> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "Your session expired. Sign in again." };
  }

  const { data: latest, error: latestError } = await supabase
    .from("legal_documents")
    .select("version")
    .eq("slug", input.slug)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestError) {
    console.error("Failed to read legal document history:", latestError);
    return { success: false, error: latestError.message };
  }

  const nextVersion = (latest?.version ?? 0) + 1;

  const { error: retireError } = await supabase
    .from("legal_documents")
    .update({ is_current: false })
    .eq("slug", input.slug)
    .eq("is_current", true);

  if (retireError) {
    console.error("Failed to retire the previous version:", retireError);
    return { success: false, error: retireError.message };
  }

  const { error: insertError } = await supabase.from("legal_documents").insert({
    slug: input.slug,
    title: input.title,
    body: input.body,
    version: nextVersion,
    change_summary: input.change_summary,
    edited_by: user.id,
    edited_by_email: user.email ?? "unknown",
    is_current: true,
  });

  if (insertError) {
    console.error("Failed to publish the legal document:", insertError);
    return { success: false, error: insertError.message };
  }

  revalidateLegal();
  return { success: true, version: nextVersion };
}

export async function publishLegalDocument(
  formData: FormData,
): Promise<PublishResult> {
  const rawBody = String(formData.get("body") ?? "");

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return { success: false, error: "The document content could not be read." };
  }

  const parsed = legalDocumentSchema.safeParse({
    slug: String(formData.get("slug") ?? ""),
    title: String(formData.get("title") ?? ""),
    change_summary: String(formData.get("change_summary") ?? ""),
    body: parsedBody,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid document.",
    };
  }

  const supabase = await getSupabase();
  return appendVersion(supabase, {
    slug: parsed.data.slug,
    title: parsed.data.title,
    body: parsed.data.body as Json,
    change_summary: parsed.data.change_summary,
  });
}

export async function restoreLegalVersion(id: number): Promise<PublishResult> {
  if (!Number.isFinite(id) || id <= 0) {
    return { success: false, error: "Invalid version." };
  }

  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("legal_documents")
    .select("slug, title, body, version")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    console.error("Failed to load the version to restore:", error);
    return { success: false, error: error?.message ?? "Version not found." };
  }

  const slug = legalSlugSchema.safeParse(data.slug);
  if (!slug.success) {
    return { success: false, error: "Invalid version." };
  }

  return appendVersion(supabase, {
    slug: slug.data,
    title: data.title,
    body: data.body,
    change_summary: `Restored version ${data.version}`,
  });
}
