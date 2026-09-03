import { z } from "zod";

export const adminProfileSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(80, "First name is too long"),
  last_name: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(80, "Last name is too long"),
  phone: z
    .string()
    .trim()
    .min(1, "Contact number is required")
    .refine(
      (value) => value.replace(/\D/g, "").length >= 10,
      "Enter a valid contact number",
    ),
  job_title: z.string().trim().max(80, "Job title is too long").nullable(),
});

export type AdminProfileFormValues = z.infer<typeof adminProfileSchema>;
