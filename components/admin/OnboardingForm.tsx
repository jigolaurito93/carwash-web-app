"use client";

import { completeOnboarding } from "@/app/admin/onboarding/actions";
import AdminAuthFrame, {
  adminAuthInputClass,
  adminAuthLabelClass,
} from "@/components/admin/AdminAuthFrame";
import { FormEvent, useState } from "react";
import { FiBriefcase, FiMail, FiPhone, FiUser } from "react-icons/fi";

type Props = {
  email: string;
};

const fieldClass = adminAuthInputClass;

export default function OnboardingForm({ email }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.set("first_name", firstName);
    formData.set("last_name", lastName);
    formData.set("phone", phone);
    formData.set("job_title", jobTitle);

    try {
      const result = await completeOnboarding(formData);
      if (!result.success) {
        setError(result.error ?? "Could not save your profile.");
        setLoading(false);
        return;
      }
      window.location.href = "/admin/dashboard";
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <AdminAuthFrame
      title="Complete your profile"
      subtitle="We need a few details before you can use the CMS."
      asideText="Fill out your admin profile. You will not be able to manage shop content until this form is complete."
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 font-questrial text-sm text-red-300"
          >
            {error}
          </div>
        )}

        <div>
          <label htmlFor="onboarding-email" className={adminAuthLabelClass}>
            Email
          </label>
          <div className="relative">
            <FiMail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/35" />
            <input
              id="onboarding-email"
              type="email"
              value={email}
              readOnly
              disabled
              className={`${fieldClass} cursor-not-allowed opacity-70`}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="first-name" className={adminAuthLabelClass}>
              First name
            </label>
            <div className="relative">
              <FiUser className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/35" />
              <input
                id="first-name"
                name="first_name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading}
                placeholder="Jordan"
                className={fieldClass}
              />
            </div>
          </div>
          <div>
            <label htmlFor="last-name" className={adminAuthLabelClass}>
              Last name
            </label>
            <div className="relative">
              <FiUser className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/35" />
              <input
                id="last-name"
                name="last_name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading}
                placeholder="Lee"
                className={fieldClass}
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="phone" className={adminAuthLabelClass}>
            Contact number
          </label>
          <div className="relative">
            <FiPhone className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/35" />
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
              placeholder="(555) 123-4567"
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="job-title" className={adminAuthLabelClass}>
            Job title <span className="normal-case">(optional)</span>
          </label>
          <div className="relative">
            <FiBriefcase className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/35" />
            <input
              id="job-title"
              name="job_title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              disabled={loading}
              placeholder="Manager"
              className={fieldClass}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={
            loading || !firstName.trim() || !lastName.trim() || !phone.trim()
          }
          className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 py-3.5 font-questrial text-sm font-bold tracking-[0.2em] text-black uppercase transition-all hover:bg-yellow-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
              Saving…
            </>
          ) : (
            "Continue to CMS"
          )}
        </button>
      </form>
    </AdminAuthFrame>
  );
}
