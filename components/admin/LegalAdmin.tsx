"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { FiExternalLink, FiRotateCcw, FiX } from "react-icons/fi";
import type { JSONContent } from "@tiptap/core";
import type { LegalDocument, LegalSlug } from "@/lib/app.types";
import type { Json } from "@/lib/database.types";
import { cn } from "@/lib/utils";
import RichTextEditor from "@/components/admin/RichTextEditor";
import {
  publishLegalDocument,
  restoreLegalVersion,
} from "@/app/(admin-protected)/admin/legal/actions";

type Props = {
  documents: LegalDocument[];
};

const TABS: { slug: LegalSlug; label: string; href: string }[] = [
  { slug: "privacy", label: "Privacy Policy", href: "/privacy" },
  { slug: "terms", label: "Terms of Service", href: "/terms" },
];

const DEFAULT_TITLE: Record<LegalSlug, string> = {
  privacy: "Privacy Policy",
  terms: "Terms of Service",
};

const EMPTY_DOC: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

function toDoc(body: Json | undefined): JSONContent {
  if (
    body &&
    typeof body === "object" &&
    !Array.isArray(body) &&
    body.type === "doc"
  ) {
    return body as unknown as JSONContent;
  }
  return EMPTY_DOC;
}

export default function LegalAdmin({ documents }: Props) {
  const router = useRouter();

  const currentFor = (slug: LegalSlug) =>
    documents.find((doc) => doc.slug === slug && doc.is_current) ?? null;

  const [slug, setSlug] = useState<LegalSlug>("privacy");
  const [title, setTitle] = useState(
    () => currentFor("privacy")?.title ?? DEFAULT_TITLE.privacy,
  );
  const [body, setBody] = useState<JSONContent>(() =>
    toDoc(currentFor("privacy")?.body),
  );
  const [changeSummary, setChangeSummary] = useState("");
  // Bumped whenever content is swapped underneath the editor so Tiptap remounts
  // with the new document instead of keeping its own internal state.
  const [editorKey, setEditorKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [restoring, setRestoring] = useState<LegalDocument | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const versions = documents.filter((doc) => doc.slug === slug);
  const current = currentFor(slug);
  const activeTab = TABS.find((tab) => tab.slug === slug) ?? TABS[0];

  const loadDocument = (nextSlug: LegalSlug) => {
    if (saving) return;
    const doc = currentFor(nextSlug);
    setSlug(nextSlug);
    setTitle(doc?.title ?? DEFAULT_TITLE[nextSlug]);
    setBody(toDoc(doc?.body));
    setChangeSummary("");
    setEditorKey((key) => key + 1);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.set("slug", slug);
    formData.set("title", title);
    formData.set("change_summary", changeSummary);
    formData.set("body", JSON.stringify(body));

    try {
      const result = await publishLegalDocument(formData);
      if (result.success) {
        toast.success(`Published version ${result.version}.`);
        setChangeSummary("");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to publish the document.");
      }
    } catch {
      toast.error("Failed to publish the document.");
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = async () => {
    if (!restoring) return;
    setIsRestoring(true);

    try {
      const result = await restoreLegalVersion(restoring.id);
      if (result.success) {
        toast.success(`Restored version ${restoring.version}.`);
        setTitle(restoring.title);
        setBody(toDoc(restoring.body));
        setChangeSummary("");
        setEditorKey((key) => key + 1);
        setRestoring(null);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to restore this version.");
      }
    } catch {
      toast.error("Failed to restore this version.");
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.slug}
              type="button"
              onClick={() => loadDocument(tab.slug)}
              disabled={saving}
              className={cn(
                "cursor-pointer rounded px-4 py-2 font-questrial text-sm font-bold tracking-wider uppercase transition-colors disabled:opacity-60",
                slug === tab.slug
                  ? "bg-black text-yellow-400"
                  : "border border-gray-200 text-gray-500 hover:text-black",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <Link
          href={activeTab.href}
          target="_blank"
          className="inline-flex items-center gap-2 font-questrial text-sm text-gray-500 hover:text-black"
        >
          <FiExternalLink className="h-4 w-4" />
          View public page
        </Link>
      </div>

      <p className="mb-6 font-questrial text-sm text-gray-500">
        Saving publishes a new version straight away. Nothing is overwritten:
        every earlier version stays in the history below with the note you wrote
        for it.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="labelx block text-xs" htmlFor="legal-title">
            Page title
          </label>
          <input
            id="legal-title"
            required
            maxLength={120}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="inputx text-sm"
            disabled={saving}
          />
        </div>

        <div>
          <span className="labelx block text-xs">Document</span>
          <RichTextEditor
            key={`${slug}-${editorKey}`}
            value={body}
            onChange={setBody}
            disabled={saving}
          />
        </div>

        <div>
          <label className="labelx block text-xs" htmlFor="legal-change">
            What changed and why
          </label>
          <textarea
            id="legal-change"
            required
            maxLength={300}
            rows={2}
            value={changeSummary}
            onChange={(event) => setChangeSummary(event.target.value)}
            placeholder="e.g. Added a section about Google Analytics"
            className="inputx min-h-20 text-sm"
            disabled={saving}
          />
          <p className="mt-1 font-questrial text-xs text-gray-400">
            Saved with your name and the date so there is a record of why this
            version exists.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btnSaveYlw disabled:opacity-60"
          >
            {saving
              ? "Publishing..."
              : `Publish version ${(current?.version ?? 0) + 1}`}
          </button>
        </div>
      </form>

      <section className="mt-14">
        <h2 className="adminHeader text-xl">Version history</h2>
        <p className="mt-2 mb-6 font-questrial text-sm text-gray-500">
          Restoring copies an older document forward as a brand new version. The
          history is never deleted.
        </p>

        {versions.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center font-questrial text-gray-500">
            No versions yet. Publishing above creates version 1.
          </p>
        ) : (
          <div className="space-y-3">
            {versions.map((version) => (
              <div
                key={version.id}
                className={cn(
                  "flex flex-col gap-3 rounded-xl border bg-white p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between",
                  version.is_current ? "border-yellow-400" : "border-gray-200",
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-lexend text-sm font-bold text-gray-900">
                      Version {version.version}
                    </span>
                    {version.is_current ? (
                      <span className="rounded bg-yellow-400 px-2 py-0.5 font-questrial text-xs font-bold tracking-wider text-black uppercase">
                        Live
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 font-questrial text-sm text-gray-700">
                    {version.change_summary}
                  </p>
                  <p className="mt-2 font-questrial text-xs tracking-wider text-gray-400 uppercase">
                    {format(new Date(version.created_at), "MMM d, yyyy h:mm a")}
                    <span className="mx-2 text-gray-300">|</span>
                    {version.edited_by_email}
                  </p>
                </div>
                {version.is_current ? null : (
                  <button
                    type="button"
                    onClick={() => setRestoring(version)}
                    className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 font-questrial text-sm text-blue-600 transition-colors hover:bg-blue-50"
                  >
                    <FiRotateCcw className="h-4 w-4" />
                    Restore
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {restoring && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => !isRestoring && setRestoring(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-lexend text-2xl font-bold text-gray-900">
                Restore version {restoring.version}
              </h2>
              <button
                type="button"
                onClick={() => setRestoring(null)}
                disabled={isRestoring}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-6 font-questrial text-gray-700">
              This publishes the content of version {restoring.version} as a new
              version {(current?.version ?? 0) + 1}. It goes live immediately.
            </p>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setRestoring(null)}
                disabled={isRestoring}
                className="btnCancel"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRestore}
                disabled={isRestoring}
                className="btnSaveYlw disabled:opacity-60"
              >
                {isRestoring ? "Restoring..." : "Restore"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
