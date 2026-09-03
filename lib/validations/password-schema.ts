import { z } from "zod";

const passwordValueSchema = z
  .string()
  .min(12, "Password must be at least 12 characters")
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[0-9]/, "Password must include a number")
  .regex(/[^A-Za-z0-9]/, "Password must include a special character");

export function createPasswordSchema(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const localPart = normalizedEmail.split("@")[0] ?? "";

  return z
    .object({
      password: passwordValueSchema,
      confirmPassword: z.string().min(1, "Confirm your password"),
    })
    .superRefine((value, ctx) => {
      const passwordLower = value.password.toLowerCase();
      if (
        normalizedEmail &&
        (passwordLower.includes(normalizedEmail) ||
          (localPart.length >= 3 && passwordLower.includes(localPart)))
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["password"],
          message: "Password must not contain your email",
        });
      }

      if (value.password !== value.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: "Passwords do not match",
        });
      }
    });
}

export type PasswordFormValues = z.infer<
  ReturnType<typeof createPasswordSchema>
>;
