"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactSchema,
  ContactFormValues,
} from "@/lib/validations/contact-schema";

const ContactForm = () => {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactFormValues) {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setSuccess(true);
      reset();
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-xl space-y-6"
    >
      <div>
        <input
          {...register("name")}
          placeholder="Full Name"
          className="w-full rounded-md border px-4 py-3"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <input
          {...register("email")}
          placeholder="Email Address"
          className="w-full rounded-md border px-4 py-3"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <input
          {...register("phone")}
          placeholder="Phone Number (Optional)"
          className="w-full rounded-md border px-4 py-3"
        />
      </div>

      <div>
        <textarea
          {...register("message")}
          placeholder="Your Message"
          rows={4}
          className="w-full rounded-md border px-4 py-3"
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-teal-500 py-3 text-white transition hover:bg-teal-600"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>

      {success && (
        <p className="text-center text-green-600">
          Thank you! We’ll get back to you soon.
        </p>
      )}
    </form>
  );
};

export default ContactForm;
