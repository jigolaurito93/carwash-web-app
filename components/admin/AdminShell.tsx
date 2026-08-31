"use client";

import LogoutButton from "@/components/admin/LogoutButton";
import { adminNavLinks } from "@/components/admin/admin-nav";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HiOutlineGlobeAlt } from "react-icons/hi2";
import { IoMdCloseCircle } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-20 flex h-14 items-center justify-between bg-black px-4 text-white md:hidden">
        <span className="font-lexend text-lg font-bold text-yellow-400">
          Onyx Admin
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-questrial text-sm text-yellow-400 hover:text-yellow-300"
          >
            View website
          </Link>
          <button
            type="button"
            aria-label="Open admin menu"
            onClick={() => setIsOpen(true)}
            className="cursor-pointer p-1"
          >
            <RxHamburgerMenu className="size-7" />
          </button>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-black text-white transition-transform duration-300 md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <button
          type="button"
          aria-label="Close admin menu"
          className="absolute top-4 left-4 cursor-pointer"
          onClick={() => setIsOpen(false)}
        >
          <IoMdCloseCircle className="size-9" />
        </button>
        <nav className="flex h-full flex-col items-center justify-center gap-6 font-questrial text-2xl">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 text-yellow-400"
          >
            <HiOutlineGlobeAlt className="size-6" />
            View website
          </Link>
          {adminNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "hover:text-yellow-400",
                pathname === link.href && "text-yellow-400",
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4">
            <LogoutButton />
          </div>
        </nav>
      </div>

      <aside className="hidden min-h-screen w-64 shrink-0 flex-col bg-black p-6 text-white md:flex">
        <h2 className="font-lexend text-2xl font-bold text-yellow-400">
          Onyx Admin
        </h2>
        <Link
          href="/"
          className="mt-6 flex items-center justify-center gap-2 rounded bg-yellow-400 px-3 py-2 font-questrial text-sm font-bold tracking-wide text-black uppercase hover:bg-yellow-500"
        >
          <HiOutlineGlobeAlt className="size-4" />
          View website
        </Link>
        <nav className="mt-8 space-y-4 font-questrial">
          {adminNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block hover:text-yellow-400",
                pathname === link.href && "text-yellow-400",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-10">
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 p-6 pt-24 pb-24 md:px-8 md:pt-12 md:pb-24">
        {children}
      </main>
    </>
  );
}
