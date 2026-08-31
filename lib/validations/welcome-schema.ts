import { z } from "zod";

export const welcomeBodyParagraphsSchema = z
  .array(
    z
      .string()
      .trim()
      .min(1, "Paragraph cannot be empty")
      .max(2000, "Paragraph is too long"),
  )
  .min(1, "Add at least one body paragraph")
  .max(10, "Too many paragraphs");

export const welcomeSchema = z.object({
  headline: z
    .string()
    .trim()
    .min(1, "Headline is required")
    .max(120, "Headline is too long"),
  tagline: z
    .string()
    .trim()
    .min(1, "Tagline is required")
    .max(200, "Tagline is too long"),
  intro: z
    .string()
    .trim()
    .min(1, "Intro is required")
    .max(2000, "Intro is too long"),
  subheading: z
    .string()
    .trim()
    .min(1, "Subheading is required")
    .max(160, "Subheading is too long"),
  body_paragraphs: welcomeBodyParagraphsSchema,
  cta_label: z
    .string()
    .trim()
    .min(1, "Button label is required")
    .max(80, "Button label is too long"),
  cta_href: z
    .string()
    .trim()
    .min(1, "Button link is required")
    .max(200, "Button link is too long")
    .regex(/^\/[^\s]*$/, "Link must be an internal path starting with /"),
  image_path: z
    .string()
    .trim()
    .min(1, "Image path is required")
    .max(300, "Image path is too long")
    .regex(/^\/[^\s]*$/, "Image path must start with /"),
  image_alt: z
    .string()
    .trim()
    .min(1, "Image alt text is required")
    .max(160, "Image alt text is too long"),
});

export type WelcomeFormValues = z.infer<typeof welcomeSchema>;
