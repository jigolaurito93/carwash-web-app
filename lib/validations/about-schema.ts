import { z } from "zod";
import { WHY_CHOOSE_ICON_KEYS } from "@/lib/about-icons";

export const whyChooseUsItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title is too long"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(500, "Description is too long"),
  icon: z.enum(WHY_CHOOSE_ICON_KEYS).optional(),
});

export const whyChooseUsSchema = z
  .array(whyChooseUsItemSchema)
  .length(4, "Exactly 4 Why Choose Us items are required");

export const storyParagraphsSchema = z
  .array(
    z
      .string()
      .trim()
      .min(1, "Paragraph cannot be empty")
      .max(2000, "Paragraph is too long"),
  )
  .min(1, "Add at least one story paragraph")
  .max(20, "Too many paragraphs");

export const aboutSchema = z.object({
  owner_name: z
    .string()
    .trim()
    .min(1, "Owner name is required")
    .max(100, "Owner name is too long"),
  story_paragraphs: storyParagraphsSchema,
  mission: z
    .string()
    .trim()
    .min(1, "Mission is required")
    .max(2000, "Mission is too long"),
  why_choose_us: whyChooseUsSchema,
});

export type AboutFormValues = z.infer<typeof aboutSchema>;
export type WhyChooseUsFormItem = z.infer<typeof whyChooseUsItemSchema>;
