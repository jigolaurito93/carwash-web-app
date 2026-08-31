"use client";

import { useRef, useState, type SubmitEvent } from "react";
import { toast } from "sonner";
import {
  FiChevronDown,
  FiChevronUp,
  FiPlusCircle,
  FiTrash2,
} from "react-icons/fi";
import type { AboutContent } from "@/lib/app.types";
import {
  DEFAULT_WHY_CHOOSE_ICONS,
  WHY_CHOOSE_ICON_KEYS,
  WHY_CHOOSE_ICON_LABELS,
  getWhyChooseIcon,
  isWhyChooseIconKey,
  type WhyChooseIconKey,
} from "@/lib/about-icons";
import { updateAboutContent } from "@/app/(admin-protected)/admin/about/actions";
import { cn } from "@/lib/utils";

type Props = {
  about: AboutContent;
};

type ParagraphRow = {
  id: string;
  text: string;
};

const MAX_STORY_PARAGRAPHS = 20;

export default function AboutContentForm({ about }: Props) {
  const [saving, setSaving] = useState(false);
  const [paragraphs, setParagraphs] = useState<ParagraphRow[]>(() => {
    const initial =
      about.story_paragraphs.length > 0 ? about.story_paragraphs : [""];
    return initial.map((text, index) => ({ id: `p-${index}`, text }));
  });
  const nextParagraphId = useRef(paragraphs.length);

  const [iconKeys, setIconKeys] = useState<WhyChooseIconKey[]>(() =>
    [0, 1, 2, 3].map((index) => {
      const icon = about.why_choose_us[index]?.icon;
      if (icon && isWhyChooseIconKey(icon)) {
        return icon;
      }
      return DEFAULT_WHY_CHOOSE_ICONS[index] ?? "hand";
    }),
  );
  const [openIconPicker, setOpenIconPicker] = useState<number | null>(null);

  const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await updateAboutContent(formData);

      if (result.success) {
        toast.success("About page updated!");
      } else {
        toast.error(result.error || "Failed to update about page.");
      }
    } catch {
      toast.error("Failed to update about page.");
    } finally {
      setSaving(false);
    }
  };

  const addParagraph = () => {
    if (paragraphs.length >= MAX_STORY_PARAGRAPHS) return;
    const id = `p-${nextParagraphId.current}`;
    nextParagraphId.current += 1;
    setParagraphs((current) => [...current, { id, text: "" }]);
  };

  const removeParagraph = (id: string) => {
    if (paragraphs.length <= 1) return;
    setParagraphs((current) => current.filter((row) => row.id !== id));
  };

  const items = [0, 1, 2, 3].map(
    (index) => about.why_choose_us[index] ?? { title: "", description: "" },
  );

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-12">
      <section className="space-y-6">
        <h2 className="adminHeader">Owner Story</h2>
        <div>
          <label className="labelx block text-xs" htmlFor="owner_name">
            Owner name
          </label>
          <input
            id="owner_name"
            name="owner_name"
            defaultValue={about.owner_name}
            className="inputx w-full text-sm"
            disabled={saving}
            required
          />
          <p className="mt-1 font-questrial text-xs text-gray-500">
            This name is highlighted in yellow wherever it appears in the story.
          </p>
        </div>
        {paragraphs.map((paragraph, index) => (
          <div key={paragraph.id}>
            <div className="mb-1 flex items-center justify-between gap-3">
              <label
                className="labelx mb-0 block text-xs"
                htmlFor={`story_${paragraph.id}`}
              >
                Paragraph {index + 1}
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
              id={`story_${paragraph.id}`}
              name="story_paragraphs"
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
          disabled={saving || paragraphs.length >= MAX_STORY_PARAGRAPHS}
          className="btnCancel inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiPlusCircle className="h-4 w-4" />
          Add paragraph
        </button>
      </section>

      <section className="space-y-6">
        <h2 className="adminHeader">Mission</h2>
        <div>
          <label className="labelx block text-xs" htmlFor="mission">
            Mission statement
          </label>
          <textarea
            id="mission"
            name="mission"
            defaultValue={about.mission}
            className="inputx min-h-28 text-sm"
            disabled={saving}
            required
          />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="adminHeader">Why Choose Us</h2>
        <p className="font-questrial text-sm text-gray-500">
          Each card shows its current icon. Open Change icon to pick another.
        </p>
        {items.map((item, index) => {
          const selected = iconKeys[index] ?? "hand";
          const SelectedIcon = getWhyChooseIcon(selected, index);
          const pickerOpen = openIconPicker === index;
          return (
            <div
              key={index}
              className="space-y-4 rounded border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-yellow-400">
                  <SelectedIcon
                    className="h-1/2 w-1/2 text-black"
                    aria-hidden
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="labelx mb-0 block text-xs">
                    Card {index + 1}
                  </span>
                  <span className="font-questrial text-sm text-gray-600">
                    {WHY_CHOOSE_ICON_LABELS[selected]}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenIconPicker(pickerOpen ? null : index)}
                  disabled={saving}
                  className="btnCancel inline-flex items-center gap-1 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-expanded={pickerOpen}
                >
                  {pickerOpen ? (
                    <FiChevronUp className="h-4 w-4" />
                  ) : (
                    <FiChevronDown className="h-4 w-4" />
                  )}
                  {pickerOpen ? "Hide icons" : "Change icon"}
                </button>
              </div>
              <input
                type="hidden"
                name={`why_${index}_icon`}
                value={selected}
              />
              {pickerOpen ? (
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                  {WHY_CHOOSE_ICON_KEYS.map((key) => {
                    const Icon = getWhyChooseIcon(key, index);
                    const isSelected = selected === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setIconKeys((current) =>
                            current.map((value, i) =>
                              i === index ? key : value,
                            ),
                          );
                          setOpenIconPicker(null);
                        }}
                        disabled={saving}
                        title={WHY_CHOOSE_ICON_LABELS[key]}
                        className={cn(
                          "flex cursor-pointer flex-col items-center gap-1 rounded-lg border p-2 transition-colors",
                          isSelected
                            ? "border-yellow-400 bg-yellow-50"
                            : "border-gray-200 hover:border-gray-300",
                          saving && "cursor-not-allowed opacity-60",
                        )}
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400">
                          <Icon
                            className="h-1/2 w-1/2 text-black"
                            aria-hidden
                          />
                        </div>
                        <span className="font-questrial text-[10px] tracking-wide text-gray-500 uppercase">
                          {WHY_CHOOSE_ICON_LABELS[key]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
              <div>
                <label
                  className="labelx block text-xs"
                  htmlFor={`why_${index}_title`}
                >
                  Title
                </label>
                <input
                  id={`why_${index}_title`}
                  name={`why_${index}_title`}
                  defaultValue={item.title}
                  className="inputx w-full text-sm"
                  disabled={saving}
                  required
                />
              </div>
              <div>
                <label
                  className="labelx block text-xs"
                  htmlFor={`why_${index}_description`}
                >
                  Description
                </label>
                <textarea
                  id={`why_${index}_description`}
                  name={`why_${index}_description`}
                  defaultValue={item.description}
                  className="inputx min-h-24 text-sm"
                  disabled={saving}
                  required
                />
                <p className="mt-1 font-questrial text-xs text-gray-500">
                  Keep this to 1–2 short sentences, and close to the same length
                  as the other cards. One long description will make the row
                  look uneven.
                </p>
              </div>
            </div>
          );
        })}
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
