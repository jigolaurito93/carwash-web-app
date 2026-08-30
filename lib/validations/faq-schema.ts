import { z } from "zod";

export const faqSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, "Question is required")
    .max(300, "Question is too long"),
  answer: z
    .string()
    .trim()
    .min(1, "Answer is required")
    .max(2000, "Answer is too long"),
  sort_order: z.number().int("Sort order must be a whole number"),
  is_active: z.boolean(),
});

export type FaqFormValues = z.infer<typeof faqSchema>;
