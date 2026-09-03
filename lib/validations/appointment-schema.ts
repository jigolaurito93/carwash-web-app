import { z } from "zod";

export const appointmentSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(80, "First name is too long"),
  last_name: z
    .string()
    .trim()
    .max(80, "Last name is too long")
    .transform((value) => (value.length > 0 ? value : null)),
  phone_number: z
    .string()
    .trim()
    .min(1, "Contact number is required")
    .refine(
      (value) => value.replace(/\D/g, "").length >= 10,
      "Enter a valid contact number",
    ),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .refine(
      (value) => value === "" || z.string().email().safeParse(value).success,
      "Enter a valid email address",
    )
    .transform((value) => (value.length > 0 ? value : null)),
  service_id: z
    .number()
    .int("Please select a service")
    .positive("Please select a service"),
  appointment_date: z
    .string()
    .trim()
    .min(1, "Please select a date and time")
    .refine(
      (value) => !Number.isNaN(Date.parse(value)),
      "Please select a valid date and time",
    ),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;
