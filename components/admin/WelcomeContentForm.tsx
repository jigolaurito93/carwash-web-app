"use client";

import { useRef, useState, type SubmitEvent } from "react";
import { toast } from "sonner";
import { FiPlusCircle, FiTrash2 } from "react-icons/fi";
import type { WelcomeContent } from "@/lib/app.types";
import { updateWelcomeContent } from "@/app/(admin-protected)/admin/welcome/actions";

type Props = {
  welcome: WelcomeContent;
};

type ParagraphRow = {
  id: string;
  text: string;
};

const MAX_BODY_PARAGRAPHS = 10;

export default function WelcomeContentForm({ welcome }: Props) {
  const [saving, setSaving] = useState(false);
  const [paragraphs, setParagraphs] = useState<ParagraphRow[]>(() => {
    const initial =
      welcome.body_paragraphs.length > 0 ? welcome.body_paragraphs : [""];
    return initial.map((text, index) => ({ id: `p-${index}`, text }));
  });
  const nextParagraphId = useRef(paragraphs.length);

  const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await updateWelcomeContent(formData);

      if (result.success) {
        toast.success("Welcome section updated!");
      } else {
        toast.error(result.error || "Failed to update welcome section.");
      }
    } catch {
      toast.error("Failed to update welcome section.");
    } finally {
      setSaving(false);
    }
  };

  const addParagraph = () => {
    if (paragraphs.length >= MAX_BODY_PARAGRAPHS) return;
    const id = `p-${nextParagraphId.current}`;
    nextParagraphId.current += 1;
    setParagraphs((current) => [...current, { id, text: "" }]);
  };

  const removeParagraph = (id: string) => {
    if (paragraphs.length <= 1) return;
    setParagraphs((current) => current.filter((row) => row.id !== id));
  };

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-12">
      <section className="space-y-6">
        <h2 className="adminHeader">Headline</h2>
        <div>
          <label className="labelx block text-xs" htmlFor="headline">
            Headline
          </label>
          <input
            id="headline"
            name="headline"
            defaultValue={welcome.headline}
            className="inputx w-full text-sm"
            disabled={saving}
            required
          />
        </div>
        <div>
          <label className="labelx block text-xs" htmlFor="tagline">
            Tagline
          </label>
          <input
            id="tagline"
            name="tagline"
            defaultValue={welcome.tagline}
            className="inputx w-full text-sm"
            disabled={saving}
            required
          />
          <p className="mt-1 font-questrial text-xs text-gray-500">
            Shown under the headline in quotes.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="adminHeader">Copy</h2>
        <div>
          <label className="labelx block text-xs" htmlFor="intro">
            Intro
          </label>
          <textarea
            id="intro"
            name="intro"
            defaultValue={welcome.intro}
            className="inputx min-h-28 text-sm"
            disabled={saving}
            required
          />
        </div>
        <div>
          <label className="labelx block text-xs" htmlFor="subheading">
            Subheading
          </label>
          <input
            id="subheading"
            name="subheading"
            defaultValue={welcome.subheading}
            className="inputx w-full text-sm"
            disabled={saving}
            required
          />
        </div>
        {paragraphs.map((paragraph, index) => (
          <div key={paragraph.id}>
            <div className="mb-1 flex items-center justify-between gap-3">
              <label
                className="labelx mb-0 block text-xs"
                htmlFor={`body_${paragraph.id}`}
              >
                Body paragraph {index + 1}
              </label>
              <button
                type="button"
                onClick={() => removeParagraph(paragraph.id)}
                disabled={saving || paragraphs.length <= 1}
                className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                title={
                  paragraphs.length <= 1
                    ? "At least one paragraph is required"
                    : "Delete paragraph"
                }
              >
                <FiTrash2 className="h-4 w-4" />
                <span className="sr-only">Delete paragraph {index + 1}</span>
              </button>
            </div>
            <textarea
              id={`body_${paragraph.id}`}
              name="body_paragraphs"
              value={paragraph.text}
              onChange={(event) =>
                setParagraphs((current) =>
                  current.map((row) =>
                    row.id === paragraph.id
                      ? { ...row, text: event.target.value }
                      : row,
                  ),
                )
              }
              className="inputx min-h-28 text-sm"
              disabled={saving}
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addParagraph}
          disabled={saving || paragraphs.length >= MAX_BODY_PARAGRAPHS}
          className="btnCancel inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiPlusCircle className="h-4 w-4" />
          Add paragraph
        </button>
      </section>

      <section className="space-y-6">
        <h2 className="adminHeader">Button</h2>
        <div>
          <label className="labelx block text-xs" htmlFor="cta_label">
            Label
          </label>
          <input
            id="cta_label"
            name="cta_label"
            defaultValue={welcome.cta_label}
            className="inputx w-full text-sm"
            disabled={saving}
            required
          />
        </div>
        <div>
          <label className="labelx block text-xs" htmlFor="cta_href">
            Link
          </label>
          <input
            id="cta_href"
            name="cta_href"
            defaultValue={welcome.cta_href}
            className="inputx w-full text-sm"
            disabled={saving}
            required
          />
          <p className="mt-1 font-questrial text-xs text-gray-500">
            Internal path only, for example /about.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="adminHeader">Image</h2>
        <div>
          <label className="labelx block text-xs" htmlFor="image_path">
            Image path
          </label>
          <input
            id="image_path"
            name="image_path"
            defaultValue={welcome.image_path}
            className="inputx w-full text-sm"
            disabled={saving}
            required
          />
          <p className="mt-1 font-questrial text-xs text-gray-500">
            File in public/, for example /images/carwash-2.jpg.
          </p>
        </div>
        <div>
          <label className="labelx block text-xs" htmlFor="image_alt">
            Alt text
          </label>
          <input
            id="image_alt"
            name="image_alt"
            defaultValue={welcome.image_alt}
            className="inputx w-full text-sm"
            disabled={saving}
            required
          />
        </div>
      </section>

      <div className="border-t pt-6">
        <button
          type="submit"
          disabled={saving}
          className="btnSaveYlw disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
