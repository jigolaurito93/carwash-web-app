"use client";

import { useEffect, useId, useSyncExternalStore } from "react";
import { FiCalendar, FiX } from "react-icons/fi";
import { HiOutlineMegaphone } from "react-icons/hi2";
import { format } from "date-fns";
import {
  defaultModalTitle,
  parseYmdLocal,
  type PublicAnnouncement,
} from "@/lib/announcements";
import { cn } from "@/lib/utils";

type Props = {
  announcement: PublicAnnouncement;
};

const DISMISS_EVENT = "onyx-announcement-dismissed";
const sessionDismissed = new Map<number, string>();

function dismissKey(id: number) {
  return `onyx-announcement-dismissed:${id}`;
}

function dismissToken(announcement: PublicAnnouncement) {
  return `${announcement.message}|${announcement.title ?? ""}|${announcement.expires_at ?? ""}`;
}

function wasDismissed(announcement: PublicAnnouncement) {
  const token = dismissToken(announcement);
  if (sessionDismissed.get(announcement.id) === token) return true;
  try {
    return window.localStorage.getItem(dismissKey(announcement.id)) === token;
  } catch {
    return false;
  }
}

function rememberDismissed(announcement: PublicAnnouncement) {
  const token = dismissToken(announcement);
  sessionDismissed.set(announcement.id, token);
  try {
    window.localStorage.setItem(dismissKey(announcement.id), token);
  } catch {
    // Private mode can still close via in-memory state.
  }
  window.dispatchEvent(new Event(DISMISS_EVENT));
}

function subscribeDismissals(onStoreChange: () => void) {
  window.addEventListener(DISMISS_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(DISMISS_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export default function AnnouncementPopupModal({ announcement }: Props) {
  const titleId = useId();
  const descriptionId = useId();
  const dismissed = useSyncExternalStore(
    subscribeDismissals,
    () => wasDismissed(announcement),
    () => true,
  );
  const title =
    announcement.title?.trim() || defaultModalTitle(announcement.kind);
  const closedDate = announcement.closes_on
    ? parseYmdLocal(announcement.closes_on)
    : null;
  const isClosure = announcement.kind === "closure";

  useEffect(() => {
    if (dismissed) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") rememberDismissed(announcement);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [dismissed, announcement]);

  if (dismissed) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      onClick={() => rememberDismissed(announcement)}
    >
      <div
        className={cn(
          "relative w-full max-w-md overflow-hidden rounded-2xl border bg-[#121212] text-white shadow-2xl",
          isClosure ? "border-red-400/40" : "border-yellow-400/40",
        )}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <div
          className={cn(
            "h-1.5 w-full",
            isClosure ? "bg-red-500" : "bg-yellow-400",
          )}
        />
        <button
          type="button"
          onClick={() => rememberDismissed(announcement)}
          className="absolute top-3 right-3 rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Close announcement"
        >
          <FiX className="h-5 w-5" />
        </button>

        <div className="px-6 pt-8 pb-6 sm:px-8">
          <div
            className={cn(
              "mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 font-questrial text-[11px] font-bold tracking-[0.18em] uppercase",
              isClosure
                ? "bg-red-500/15 text-red-300"
                : "bg-yellow-400/15 text-yellow-400",
            )}
          >
            {isClosure ? (
              <FiCalendar className="h-3.5 w-3.5" />
            ) : (
              <HiOutlineMegaphone className="h-3.5 w-3.5" />
            )}
            {isClosure
              ? "Closed"
              : announcement.kind === "promo"
                ? "Special"
                : "Notice"}
          </div>

          <h2
            id={titleId}
            className="pr-8 font-lexend text-2xl font-bold tracking-tight"
          >
            {title}
          </h2>
          {closedDate ? (
            <p className="mt-2 font-questrial text-sm text-yellow-400">
              {format(closedDate, "EEEE, MMMM d")}
            </p>
          ) : null}
          <p
            id={descriptionId}
            className="mt-4 font-questrial text-base leading-relaxed text-white/80"
          >
            {announcement.message}
          </p>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => rememberDismissed(announcement)}
              className="rounded-lg border border-white/20 px-5 py-2.5 font-questrial text-sm font-bold tracking-wider text-white/80 uppercase transition-colors hover:border-white/40 hover:text-white"
            >
              Close
            </button>
            {announcement.link_url ? (
              <a
                href={announcement.link_url}
                onClick={() => rememberDismissed(announcement)}
                className="rounded-lg bg-yellow-400 px-5 py-2.5 text-center font-questrial text-sm font-bold tracking-wider text-black uppercase transition-colors hover:bg-yellow-500"
              >
                Learn more
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
