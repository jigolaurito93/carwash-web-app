"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactSchema,
  ContactFormValues,
} from "@/lib/validations/contact-schema";

const ContactForm = () => {
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      consent: false,
    },
  });

  async function onSubmit(data: ContactFormValues) {
    setSuccess(false);
    setSubmitError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSuccess(true);
        reset();
        return;
      }

      const payload = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      setSubmitError(
        payload?.error ?? "Something went wrong. Please try again.",
      );
    } catch {
      setSubmitError(
        "Could not send your message. Check your connection and try again.",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-90 space-y-6 md:w-100 lg:w-125 lg:max-w-none"
      noValidate
    >
      <div>
        <input
          {...register("name")}
          placeholder="Full Name"
          className="w-full rounded-sm border border-black/30 px-4 py-3"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <input
          {...register("email")}
          placeholder="Email Address"
          className="w-full rounded-sm border border-black/30 px-4 py-3"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <input
          {...register("phone")}
          placeholder="Phone Number (Optional)"
          className="w-full rounded-sm border border-black/30 px-4 py-3"
        />
      </div>

      <div>
        <textarea
          {...register("message")}
          placeholder="Your Message"
          rows={4}
          className="w-full rounded-sm border border-black/30 px-4 py-3"
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
        )}
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            {...register("consent")}
            className="mt-1 h-4 w-4 shrink-0 accent-yellow-400"
          />
          <span>
            I agree to the processing of my information as described in the{" "}
            <Link
              href="/privacy"
              className="font-medium underline underline-offset-2 hover:text-yellow-600"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.consent && (
          <p className="mt-1 text-sm text-red-500">{errors.consent.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-sm bg-teal-500 py-3 text-white transition hover:bg-teal-600"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>

      {submitError && (
        <p
          role="alert"
          className="rounded-sm border border-red-500/40 bg-red-50 px-4 py-3 text-center text-sm text-red-600"
        >
          {submitError}
        </p>
      )}

      {success && (
        <p className="text-center text-green-600">
          Thank you! We’ll get back to you soon.
        </p>
      )}
    </form>
  );
};

export default ContactForm;
