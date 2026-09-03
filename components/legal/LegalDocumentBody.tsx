import type { ReactNode } from "react";
import {
  renderJSONContentToReactElement,
  type JSONNodeType,
} from "@tiptap/static-renderer/json/react";
import type { Json } from "@/lib/database.types";
import { legalBodySchema } from "@/lib/validations/legal-schema";

type RenderNode = {
  type?: string;
  attrs?: Record<string, unknown>;
  text?: string;
};

type RenderMark = {
  attrs?: Record<string, unknown>;
};

type NodeProps = {
  node: RenderNode;
  children?: ReactNode;
};

type MarkProps = {
  mark: RenderMark;
  children?: ReactNode;
};

function attrString(attrs: Record<string, unknown> | undefined, key: string) {
  const value = attrs?.[key];
  return typeof value === "string" ? value : undefined;
}

const renderLegalBody = renderJSONContentToReactElement({
  nodeMapping: {
    doc: ({ children }: NodeProps) => <>{children}</>,
    paragraph: ({ children }: NodeProps) => (
      <p className="my-4 font-questrial text-[15px] leading-7 text-zinc-700">
        {children}
      </p>
    ),
    heading: ({ node, children }: NodeProps) => {
      const level = node.attrs?.level;
      if (level === 3) {
        return (
          <h3 className="mt-8 mb-2 font-lexend text-base font-bold text-zinc-900">
            {children}
          </h3>
        );
      }
      return (
        <h2 className="mt-10 mb-3 font-lexend text-xl font-bold text-zinc-900">
          {children}
        </h2>
      );
    },
    bulletList: ({ children }: NodeProps) => (
      <ul className="my-4 list-disc space-y-2 pl-6 font-questrial text-[15px] leading-7 text-zinc-700">
        {children}
      </ul>
    ),
    orderedList: ({ children }: NodeProps) => (
      <ol className="my-4 list-decimal space-y-2 pl-6 font-questrial text-[15px] leading-7 text-zinc-700">
        {children}
      </ol>
    ),
    listItem: ({ children }: NodeProps) => (
      <li className="[&>p]:my-0">{children}</li>
    ),
    blockquote: ({ children }: NodeProps) => (
      <blockquote className="my-4 border-l-2 border-yellow-500 pl-4 text-zinc-600 italic">
        {children}
      </blockquote>
    ),
    horizontalRule: () => <hr className="my-8 border-zinc-200" />,
    hardBreak: () => <br />,
    text: ({ node }: NodeProps) => <>{node.text}</>,
  },
  markMapping: {
    bold: ({ children }: MarkProps) => (
      <strong className="font-bold text-zinc-900">{children}</strong>
    ),
    italic: ({ children }: MarkProps) => <em>{children}</em>,
    underline: ({ children }: MarkProps) => <u>{children}</u>,
    strike: ({ children }: MarkProps) => <s>{children}</s>,
    code: ({ children }: MarkProps) => (
      <code className="rounded bg-zinc-200 px-1 py-0.5 text-sm">
        {children}
      </code>
    ),
    link: ({ mark, children }: MarkProps) => (
      <a
        href={attrString(mark.attrs, "href")}
        target="_blank"
        rel="noopener noreferrer"
        className="text-yellow-600 underline underline-offset-2 hover:text-yellow-700"
      >
        {children}
      </a>
    ),
    textStyle: ({ mark, children }: MarkProps) => (
      <span
        style={{
          fontFamily: attrString(mark.attrs, "fontFamily"),
          fontSize: attrString(mark.attrs, "fontSize"),
        }}
      >
        {children}
      </span>
    ),
  },
  unhandledNode: ({ children }: NodeProps) => <>{children}</>,
  unhandledMark: ({ children }: MarkProps) => <>{children}</>,
});

export default function LegalDocumentBody({ body }: { body: Json }) {
  if (!legalBodySchema.safeParse(body).success) {
    return (
      <p className="font-questrial text-sm text-zinc-500">
        This document is being updated. Please check back shortly.
      </p>
    );
  }

  return <>{renderLegalBody({ content: body as unknown as JSONNodeType })}</>;
}
