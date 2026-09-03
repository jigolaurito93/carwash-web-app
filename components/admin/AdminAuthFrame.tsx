import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { HiOutlineGlobeAlt } from "react-icons/hi2";

type Props = {
  title: string;
  subtitle: string;
  asideText: string;
  children: ReactNode;
};

export default function AdminAuthFrame({
  title,
  subtitle,
  asideText,
  children,
}: Props) {
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
        <div className="absolute inset-0 bg-linear-to-br from-black via-black/85 to-black/70" />
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
              {asideText}
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
                {title}
              </h1>
              <p className="mt-2 font-questrial text-sm text-white/50">
                {subtitle}
              </p>
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export const adminAuthInputClass =
  "w-full rounded-lg border border-white/15 bg-white/5 py-3 pr-4 pl-11 font-questrial text-sm text-white transition-[border-color,box-shadow,background-color] outline-none placeholder:text-white/25 focus:border-yellow-400/60 focus:bg-white/8 focus:ring-2 focus:ring-yellow-400/20 disabled:opacity-60";

export const adminAuthLabelClass =
  "mb-2 block font-questrial text-xs font-bold tracking-wider text-white/50 uppercase";
