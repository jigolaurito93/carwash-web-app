import { z } from "zod";
import { ANNOUNCEMENT_KINDS } from "@/lib/announcements";

const optionalUrl = z
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
  );

const optionalIso = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : null))
  .pipe(
    z.union([
      z.null(),
      z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
        message: "Enter a valid date and time",
      }),
    ]),
  );

const optionalYmd = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : null))
  .pipe(
    z.union([
      z.null(),
      z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a valid date"),
    ]),
  );

export const announcementSchema = z
  .object({
    title: z
      .string()
      .trim()
      .max(80, "Title is too long")
      .optional()
      .transform((value) => (value ? value : null)),
    message: z
      .string()
      .trim()
      .min(1, "Message is required")
      .max(500, "Message is too long"),
    kind: z.enum(ANNOUNCEMENT_KINDS),
    link_url: optionalUrl,
    sort_order: z.number().int("Sort order must be a whole number"),
    is_active: z.boolean(),
    show_in_banner: z.boolean(),
    show_as_modal: z.boolean(),
    starts_at: optionalIso,
    expires_at: optionalIso,
    closes_on: optionalYmd,
  })
  .superRefine((data, ctx) => {
    if (data.kind === "closure" && !data.closes_on) {
      ctx.addIssue({
        code: "custom",
        message: "Pick the date the shop is closed.",
        path: ["closes_on"],
      });
    }

    if (data.kind !== "closure" && data.closes_on) {
      ctx.addIssue({
        code: "custom",
        message: "Closed-on is only used for closed-day announcements.",
        path: ["closes_on"],
      });
    }

    if (data.is_active && !data.show_in_banner && !data.show_as_modal) {
      ctx.addIssue({
        code: "custom",
        message: "Turn on the banner, the popup, or both.",
        path: ["show_as_modal"],
      });
    }

    if (data.starts_at && data.expires_at) {
      const startsAt = Date.parse(data.starts_at);
      const expiresAt = Date.parse(data.expires_at);
      if (expiresAt <= startsAt) {
        ctx.addIssue({
          code: "custom",
          message: "Expiration must be after the start time.",
          path: ["expires_at"],
        });
      }
    }
  });

export type AnnouncementFormValues = z.infer<typeof announcementSchema>;
