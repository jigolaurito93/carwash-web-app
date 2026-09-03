import { z } from "zod";

export const announcementSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(200, "Message is too long"),
  link_url: z
    .string()
    .trim()
    .max(500, "Link is too long")
    .optional()
    .transform((value) => (value ? value : null))
    .pipe(
      z.union([
        z.null(),
        z.string().url("Enter a valid URL"),
        z.string().startsWith("/", "Enter a valid URL or path starting with /"),
      ]),
    ),
  sort_order: z.number().int("Sort order must be a whole number"),
  is_active: z.boolean(),
});

export type AnnouncementFormValues = z.infer<typeof announcementSchema>;
