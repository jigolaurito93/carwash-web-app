"use client";

import LogoutButton from "@/components/admin/LogoutButton";
import {
  getAdminNavSections,
  type AdminNavSection,
} from "@/components/admin/admin-nav";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HiChevronDown, HiOutlineGlobeAlt } from "react-icons/hi2";
import { IoMdCloseCircle } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";

export default function AdminShell({
  children,
  isMaster = false,
}: {
  children: React.ReactNode;
  isMaster?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const sections = getAdminNavSections(isMaster);
  const websiteChildActive = Boolean(
    sections
      .find((section) => section.id === "website")
      ?.links.some((link) => link.href === pathname),
  );
  const [websiteOpen, setWebsiteOpen] = useState(websiteChildActive);
  const [wasWebsiteChildActive, setWasWebsiteChildActive] =
    useState(websiteChildActive);

  if (websiteChildActive !== wasWebsiteChildActive) {
    setWasWebsiteChildActive(websiteChildActive);
    if (websiteChildActive) {
      setWebsiteOpen(true);
    }
  }

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
          "fixed inset-0 z-50 flex flex-col bg-black text-white transition-transform duration-300 md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex shrink-0 items-center px-4 py-4">
          <button
            type="button"
            aria-label="Close admin menu"
            className="cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <IoMdCloseCircle className="size-9" />
          </button>
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-[max(2rem,env(safe-area-inset-bottom))] font-questrial">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="mb-8 flex items-center gap-2 text-lg text-yellow-400"
          >
            <HiOutlineGlobeAlt className="size-5" />
            View website
          </Link>
          <AdminNavList
            sections={sections}
            pathname={pathname}
            onNavigate={() => setIsOpen(false)}
            websiteOpen={websiteOpen}
            onToggleWebsite={() => setWebsiteOpen((open) => !open)}
            variant="mobile"
          />
          <div className="pt-8 pb-4">
            <LogoutButton />
          </div>
        </nav>
      </div>

      <div className="hidden w-64 shrink-0 md:block" aria-hidden="true" />
      <aside className="fixed inset-y-0 left-0 z-30 hidden h-screen w-64 flex-col overflow-hidden bg-black p-6 text-white md:flex">
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
        <nav className="mt-8 min-h-0 flex-1 overflow-y-auto overscroll-contain font-questrial">
          <AdminNavList
            sections={sections}
            pathname={pathname}
            websiteOpen={websiteOpen}
            onToggleWebsite={() => setWebsiteOpen((open) => !open)}
            variant="desktop"
          />
        </nav>
        <div className="mt-auto shrink-0 pt-6">
          <LogoutButton />
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-x-hidden p-4 pt-20 pb-24 sm:p-6 sm:pt-24 md:px-8 md:pt-12 md:pb-24">
        {children}
      </main>
    </>
  );
}

function AdminNavList({
  sections,
  pathname,
  onNavigate,
  websiteOpen,
  onToggleWebsite,
  variant,
}: {
  sections: AdminNavSection[];
  pathname: string;
  onNavigate?: () => void;
  websiteOpen: boolean;
  onToggleWebsite: () => void;
  variant: "mobile" | "desktop";
}) {
  const isMobile = variant === "mobile";

  return (
    <div className={cn(isMobile ? "space-y-8" : "space-y-6")}>
      {sections.map((section) => {
        const childActive = section.links.some(
          (link) => link.href === pathname,
        );
        const isCollapsible = isMobile && section.collapsible;
        const expanded = !isCollapsible || websiteOpen;

        return (
          <div key={section.id}>
            {isCollapsible ? (
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={`${section.id}-links`}
                onClick={onToggleWebsite}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between font-lexend text-xs font-bold tracking-wider text-white/45 uppercase",
                  childActive && "text-yellow-400",
                )}
              >
                {section.label}
                <HiChevronDown
                  className={cn(
                    "size-4 text-white/45 transition-transform",
                    expanded && "rotate-180",
                    childActive && "text-yellow-400",
                  )}
                />
              </button>
            ) : (
              <p className="font-lexend text-xs font-bold tracking-wider text-white/45 uppercase">
                {section.label}
              </p>
            )}
            {expanded ? (
              <div
                id={`${section.id}-links`}
                className={cn(
                  isMobile
                    ? "mt-3 space-y-3 text-xl"
                    : "mt-3 space-y-2 text-sm",
                  isCollapsible && "ml-3 border-l border-white/15 pl-4",
                )}
              >
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onNavigate}
                    className={cn(
                      "block hover:text-yellow-400",
                      pathname === link.href && "text-yellow-400",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
