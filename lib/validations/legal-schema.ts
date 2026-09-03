import { z } from "zod";

export const legalSlugSchema = z.enum(["privacy", "terms"]);

// Tiptap serialises to a ProseMirror document. Only the outer shape is checked
// here; the editor schema already constrains everything nested inside it.
export const legalBodySchema = z.looseObject({
  type: z.literal("doc"),
  content: z.array(z.unknown()).min(1, "The document cannot be empty"),
});

export const legalDocumentSchema = z.object({
  slug: legalSlugSchema,
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(120, "Title is too long"),
  change_summary: z
    .string()
    .trim()
    .min(1, "Describe what changed and why")
    .max(300, "Change note is too long"),
  body: legalBodySchema,
});

export type LegalDocumentFormValues = z.infer<typeof legalDocumentSchema>;
