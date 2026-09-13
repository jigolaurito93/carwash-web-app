"use client";

import { createElement, useEffect, useId, useSyncExternalStore } from "react";
import type { PopupAnnouncement } from "@/lib/popup-announcements";
import { getPopupLayoutComponent } from "@/components/announcements/layouts";

type Props = {
  announcement: PopupAnnouncement;
};

const DISMISS_EVENT = "onyx-popup-dismissed";
const sessionDismissed = new Map<number, string>();

function dismissKey(id: number) {
  return `onyx-popup-dismissed:${id}`;
}

function dismissToken(announcement: PopupAnnouncement) {
  return `${announcement.layout_key}|${announcement.message}|${announcement.title ?? ""}|${announcement.expires_at ?? ""}`;
}

function wasDismissed(announcement: PopupAnnouncement) {
  const token = dismissToken(announcement);
  if (sessionDismissed.get(announcement.id) === token) return true;
  try {
    return window.localStorage.getItem(dismissKey(announcement.id)) === token;
  } catch {
    return false;
  }
}

function rememberDismissed(announcement: PopupAnnouncement) {
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
      className="fixed inset-0 z-80 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      onClick={() => rememberDismissed(announcement)}
    >
      {createElement(getPopupLayoutComponent(announcement.layout_key), {
        announcement,
        onDismiss: () => rememberDismissed(announcement),
        titleId,
        descriptionId,
      })}
    </div>
  );
}
