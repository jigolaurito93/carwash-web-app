"use client";

import { useState } from "react";
// 1. Change this import
import { createBrowserClient } from "@supabase/ssr";
import { FormEvent } from "react";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      console.log("✅ Login Successful!", data.user);

      // 3. Refresh & Redirect
      // router.refresh();
      // router.push("/admin/dashboard");
      window.location.href = "/admin/dashboard";
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 lg:max-w-md"
      >
        <h1 className="mb-10 font-lexend text-3xl font-bold md:text-4xl lg:mb-15 lg:text-5xl">
          Admin Login
        </h1>
        {error && (
          <p className="absolute top-68 font-questrial text-lg font-bold text-red-500">
            {error}
          </p>
        )}
        <div className="font-questrial text-lg">
          <label className="tracking-wider">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-sm border-2 px-2 py-1"
          />
        </div>
        <div className="font-questrial text-lg">
          <label className="tracking-wider">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-sm border-2 px-2 py-1"
          />
        </div>
        <button
          type="submit"
          className="mt-7 w-full cursor-pointer rounded bg-black px-4 py-2 font-questrial text-xl tracking-widest text-white"
        >
          Login
        </button>
      </form>
    </div>
  );
}
