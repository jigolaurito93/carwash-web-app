import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  consent: z.boolean().refine((value) => value === true, {
    message: "Please agree to the privacy policy before sending.",
  }),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
