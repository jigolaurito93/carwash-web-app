"use client";

import { setAdminPassword } from "@/app/admin/set-password/actions";
import AdminAuthFrame, {
  adminAuthInputClass,
  adminAuthLabelClass,
} from "@/components/admin/AdminAuthFrame";
import { FormEvent, useMemo, useState } from "react";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";

type Props = {
  email: string;
};

function PasswordField({
  id,
  label,
  name,
  value,
  onChange,
  disabled,
  autoComplete,
  show,
  onToggleShow,
}: {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  autoComplete: string;
  show: boolean;
  onToggleShow: () => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={adminAuthLabelClass}>
        {label}
      </label>
      <div className="relative">
        <FiLock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/35" />
        <input
          id={id}
          type={show ? "text" : "password"}
          name={name}
          autoComplete={autoComplete}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="••••••••••••"
          className={`${adminAuthInputClass} pr-12`}
        />
        <button
          type="button"
          onClick={onToggleShow}
          disabled={disabled}
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-1 text-white/40 transition-colors hover:text-yellow-400 disabled:opacity-60"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? (
            <FiEyeOff className="size-4" />
          ) : (
            <FiEye className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
}

export default function SetPasswordForm({ email }: Props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checks = useMemo(
    () => [
      { label: "At least 12 characters", ok: password.length >= 12 },
      { label: "One lowercase letter", ok: /[a-z]/.test(password) },
      { label: "One uppercase letter", ok: /[A-Z]/.test(password) },
      { label: "One number", ok: /[0-9]/.test(password) },
      { label: "One special character", ok: /[^A-Za-z0-9]/.test(password) },
      {
        label: "Does not contain your email",
        ok:
          password.length > 0 &&
          !password.toLowerCase().includes(email.trim().toLowerCase()) &&
          !(
            email.split("@")[0].length >= 3 &&
            password.toLowerCase().includes(email.split("@")[0].toLowerCase())
          ),
      },
      {
        label: "Passwords match",
        ok: password.length > 0 && password === confirmPassword,
      },
    ],
    [password, confirmPassword, email],
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.set("password", password);
    formData.set("confirmPassword", confirmPassword);

    try {
      const result = await setAdminPassword(formData);
      if (!result.success) {
        setError(result.error ?? "Invalid password.");
        setLoading(false);
        return;
      }
      window.location.href = "/admin/onboarding";
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <AdminAuthFrame
      title="Create your password"
      subtitle="Choose a strong password to finish setting up your account."
      asideText="You've been invited to the Onyx admin portal. Set a password, then complete your profile."
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
          <label htmlFor="invite-email" className={adminAuthLabelClass}>
            Email
          </label>
          <div className="relative">
            <FiMail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/35" />
            <input
              id="invite-email"
              type="email"
              value={email}
              readOnly
              disabled
              className={`${adminAuthInputClass} cursor-not-allowed opacity-70`}
            />
          </div>
        </div>

        <PasswordField
          id="new-password"
          label="Password"
          name="password"
          value={password}
          onChange={setPassword}
          disabled={loading}
          autoComplete="new-password"
          show={showPassword}
          onToggleShow={() => setShowPassword((prev) => !prev)}
        />

        <PasswordField
          id="confirm-password"
          label="Confirm password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={setConfirmPassword}
          disabled={loading}
          autoComplete="new-password"
          show={showConfirm}
          onToggleShow={() => setShowConfirm((prev) => !prev)}
        />

        <ul className="space-y-1.5 font-questrial text-xs">
          {checks.map((check) => (
            <li
              key={check.label}
              className={check.ok ? "text-yellow-400" : "text-white/40"}
            >
              {check.ok ? "✓" : "○"} {check.label}
            </li>
          ))}
        </ul>

        <button
          type="submit"
          disabled={loading || !password || !confirmPassword}
          className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 py-3.5 font-questrial text-sm font-bold tracking-[0.2em] text-black uppercase transition-all hover:bg-yellow-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
              Saving…
            </>
          ) : (
            "Save password"
          )}
        </button>
      </form>
    </AdminAuthFrame>
  );
}
