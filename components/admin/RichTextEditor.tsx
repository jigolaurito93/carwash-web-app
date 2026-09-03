"use client";

import { useEffect } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import type { JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import {
  FiBold,
  FiCornerUpLeft,
  FiCornerUpRight,
  FiItalic,
  FiLink,
  FiList,
  FiUnderline,
} from "react-icons/fi";
import { MdFormatListNumbered } from "react-icons/md";
import { cn } from "@/lib/utils";

type Props = {
  value: JSONContent;
  onChange: (value: JSONContent) => void;
  disabled?: boolean;
};

const FONT_FAMILIES = [
  { label: "Body (Questrial)", value: "var(--font-questrial)" },
  { label: "Headline (Lexend)", value: "var(--font-lexend-giga)" },
  { label: "Serif", value: "Georgia, serif" },
];

const FONT_SIZES = ["14px", "15px", "16px", "18px", "20px", "24px"];

function toStringAttr(value: unknown) {
  return typeof value === "string" ? value : "";
}

function ToolbarButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded p-2 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40",
        active && "bg-yellow-400 text-black hover:bg-yellow-400",
      )}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value, onChange, disabled }: Props) {
  const editor = useEditor({
    // Next renders this on the server first; without it Tiptap throws on hydrate.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      TextStyleKit.configure({
        backgroundColor: false,
        color: false,
        lineHeight: false,
      }),
    ],
    content: value,
    editable: !disabled,
    editorProps: {
      attributes: {
        class: "legal-editor",
      },
    },
    onUpdate: ({ editor: instance }) => onChange(instance.getJSON()),
  });

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);

  const state = useEditorState({
    editor,
    selector: ({ editor: instance }) => ({
      isBold: instance?.isActive("bold") ?? false,
      isItalic: instance?.isActive("italic") ?? false,
      isUnderline: instance?.isActive("underline") ?? false,
      isBulletList: instance?.isActive("bulletList") ?? false,
      isOrderedList: instance?.isActive("orderedList") ?? false,
      isLink: instance?.isActive("link") ?? false,
      blockType: instance?.isActive("heading", { level: 2 })
        ? "heading"
        : instance?.isActive("heading", { level: 3 })
          ? "subheading"
          : "paragraph",
      fontFamily: toStringAttr(instance?.getAttributes("textStyle").fontFamily),
      fontSize: toStringAttr(instance?.getAttributes("textStyle").fontSize),
      canUndo: instance?.can().undo() ?? false,
      canRedo: instance?.can().redo() ?? false,
    }),
  });

  if (!editor || !state) {
    return (
      <div className="min-h-96 rounded-lg border border-gray-200 bg-white p-5 font-questrial text-sm text-gray-400">
        Loading editor...
      </div>
    );
  }

  const setBlockType = (next: string) => {
    const chain = editor.chain().focus();
    if (next === "heading") chain.setNode("heading", { level: 2 }).run();
    else if (next === "subheading")
      chain.setNode("heading", { level: 3 }).run();
    else chain.setParagraph().run();
  };

  const setLink = () => {
    const current = toStringAttr(editor.getAttributes("link").href);
    const url = window.prompt("Link address", current || "https://");
    if (url === null) return;

    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url.trim() })
      .run();
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-3 py-2">
        <select
          aria-label="Paragraph style"
          value={state.blockType}
          disabled={disabled}
          onChange={(event) => setBlockType(event.target.value)}
          className="cursor-pointer rounded border border-gray-200 bg-white px-2 py-1.5 font-questrial text-sm text-gray-700 disabled:opacity-40"
        >
          <option value="paragraph">Normal text</option>
          <option value="heading">Heading</option>
          <option value="subheading">Subheading</option>
        </select>

        <select
          aria-label="Font"
          value={state.fontFamily}
          disabled={disabled}
          onChange={(event) => {
            const next = event.target.value;
            if (next === "") editor.chain().focus().unsetFontFamily().run();
            else editor.chain().focus().setFontFamily(next).run();
          }}
          className="cursor-pointer rounded border border-gray-200 bg-white px-2 py-1.5 font-questrial text-sm text-gray-700 disabled:opacity-40"
        >
          <option value="">Default font</option>
          {FONT_FAMILIES.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>

        <select
          aria-label="Font size"
          value={state.fontSize}
          disabled={disabled}
          onChange={(event) => {
            const next = event.target.value;
            if (next === "") editor.chain().focus().unsetFontSize().run();
            else editor.chain().focus().setFontSize(next).run();
          }}
          className="cursor-pointer rounded border border-gray-200 bg-white px-2 py-1.5 font-questrial text-sm text-gray-700 disabled:opacity-40"
        >
          <option value="">Default size</option>
          {FONT_SIZES.map((size) => (
            <option key={size} value={size}>
              {size.replace("px", "")}
            </option>
          ))}
        </select>

        <span className="mx-1 h-6 w-px bg-gray-200" />

        <ToolbarButton
          label="Bold"
          active={state.isBold}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <FiBold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={state.isItalic}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <FiItalic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Underline"
          active={state.isUnderline}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <FiUnderline className="h-4 w-4" />
        </ToolbarButton>

        <span className="mx-1 h-6 w-px bg-gray-200" />

        <ToolbarButton
          label="Bulleted list"
          active={state.isBulletList}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <FiList className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={state.isOrderedList}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <MdFormatListNumbered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Add or edit link"
          active={state.isLink}
          disabled={disabled}
          onClick={setLink}
        >
          <FiLink className="h-4 w-4" />
        </ToolbarButton>

        <span className="mx-1 h-6 w-px bg-gray-200" />

        <ToolbarButton
          label="Undo"
          disabled={disabled || !state.canUndo}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <FiCornerUpLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Redo"
          disabled={disabled || !state.canRedo}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <FiCornerUpRight className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
