"use client";

import { createBrowserClient } from "@supabase/ssr";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import { HiOutlineGlobeAlt } from "react-icons/hi2";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(
          signInError.message === "Invalid login credentials"
            ? "Invalid email or password."
            : signInError.message,
        );
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
    <div className="relative flex min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/images/carwash-3.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/85 to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(250,204,21,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(250,204,21,0.06),transparent_45%)]" />
      </div>

      <Link
        href="/"
        className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 font-questrial text-sm text-white/70 transition-colors hover:text-yellow-400 sm:left-10 lg:left-14"
      >
        <HiOutlineGlobeAlt className="size-4" />
        Back to website
      </Link>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center lg:min-h-screen lg:flex-row lg:items-stretch">
        <aside className="hidden w-full max-w-md flex-col justify-between px-10 py-12 lg:flex xl:px-12">
          <div className="h-8" aria-hidden />

          <div>
            <div className="mb-8 flex items-center gap-4">
              <Image
                alt="Onyx Premium Carwash logo"
                src="/images/nav-logo-icon.png"
                width={72}
                height={72}
                className="rounded-full bg-black/60 p-1.5 ring-1 ring-yellow-400/40"
                priority
              />
              <div>
                <div className="font-bungee text-5xl leading-none tracking-wide text-white">
                  ONYX
                </div>
                <div className="mt-1 font-lexend text-xs tracking-[0.2em] text-yellow-400 uppercase italic">
                  Premium Carwash
                </div>
              </div>
            </div>

            <p className="font-questrial text-lg leading-relaxed text-white/60">
              Sign in to manage services, hours, gallery, and shop content.
            </p>
            <p className="mt-4 font-lexend text-sm tracking-wider text-white/35 uppercase">
              Authorized staff only
            </p>
          </div>

          <p className="font-questrial text-base text-white/30">
            &ldquo;The Gold Standard of Clean&rdquo;
          </p>
        </aside>

        <main className="flex min-h-screen w-full max-w-md flex-1 items-center justify-center px-6 py-20 sm:px-10 lg:min-h-0 lg:px-10 lg:py-12 xl:px-12">
          <div className="w-full">
            <div className="mb-6 flex flex-col items-center gap-2.5 lg:hidden">
              <Image
                alt="Onyx Premium Carwash logo"
                src="/images/nav-logo-icon.png"
                width={72}
                height={72}
                className="rounded-full bg-black/60 p-1.5 ring-1 ring-yellow-400/40"
                priority
              />
              <div className="text-center">
                <div className="font-bungee text-5xl leading-none tracking-wide text-white">
                  ONYX
                </div>
                <div className="mt-1 font-lexend text-xs tracking-[0.2em] text-yellow-400 uppercase italic">
                  Premium Carwash
                </div>
              </div>
            </div>

            <div className="mb-8 border-b border-white/10 pb-6 text-center lg:border-0 lg:pb-0 lg:text-left">
              <p className="mb-2 font-questrial text-xs tracking-[0.25em] text-yellow-400 uppercase">
                Admin Portal
              </p>
              <h1 className="font-lexend text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Welcome back
              </h1>
              <p className="mt-2 font-questrial text-sm text-white/50">
                Enter your credentials to continue.
              </p>
            </div>

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
                <label
                  htmlFor="admin-email"
                  className="mb-2 block font-questrial text-xs font-bold tracking-wider text-white/50 uppercase"
                >
                  Email
                </label>
                <div className="relative">
                  <FiMail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/35" />
                  <input
                    id="admin-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    placeholder="you@onyxwash.com"
                    aria-invalid={Boolean(error)}
                    className="w-full rounded-lg border border-white/15 bg-white/5 py-3 pr-4 pl-11 font-questrial text-sm text-white transition-[border-color,box-shadow,background-color] outline-none placeholder:text-white/25 focus:border-yellow-400/60 focus:bg-white/8 focus:ring-2 focus:ring-yellow-400/20 disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="mb-2 block font-questrial text-xs font-bold tracking-wider text-white/50 uppercase"
                >
                  Password
                </label>
                <div className="relative">
                  <FiLock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/35" />
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    placeholder="••••••••"
                    aria-invalid={Boolean(error)}
                    className="w-full rounded-lg border border-white/15 bg-white/5 py-3 pr-12 pl-11 font-questrial text-sm text-white transition-[border-color,box-shadow,background-color] outline-none placeholder:text-white/25 focus:border-yellow-400/60 focus:bg-white/8 focus:ring-2 focus:ring-yellow-400/20 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={loading}
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-1 text-white/40 transition-colors hover:text-yellow-400 disabled:opacity-60"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FiEyeOff className="size-4" />
                    ) : (
                      <FiEye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim() || !password}
                className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 py-3.5 font-questrial text-sm font-bold tracking-[0.2em] text-black uppercase transition-all hover:bg-yellow-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <p className="mt-8 text-center font-questrial text-xs text-white/30 lg:hidden">
              Authorized staff only
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
