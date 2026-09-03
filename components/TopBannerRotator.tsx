"use client";

import { useEffect, useState } from "react";
import { HiOutlineMegaphone } from "react-icons/hi2";
import { cn } from "@/lib/utils";

export type BannerAnnouncement = {
  id: number;
  message: string;
  link_url: string | null;
};

type Props = {
  announcements: BannerAnnouncement[];
};

const ROTATE_MS = 4000;

export default function TopBannerRotator({ announcements }: Props) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);

  const count = announcements.length;
  const safeIndex = count > 0 ? index % count : 0;
  const current = announcements[safeIndex];

  useEffect(() => {
    if (count < 2 || paused) return;

    let fadeTimeout: number;
    const timer = window.setInterval(() => {
      setVisible(false);
      fadeTimeout = window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % count);
        setVisible(true);
      }, 280);
    }, ROTATE_MS);

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(fadeTimeout);
    };
  }, [count, paused]);

  if (!current) return null;

  const content = (
    <span className="inline-flex max-w-full items-center gap-2">
      <HiOutlineMegaphone className="size-4 shrink-0 text-yellow-400" />
      <span className="truncate">{current.message}</span>
    </span>
  );

  return (
    <div
      className="w-screen border-b border-yellow-400/30 bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative mx-auto flex h-9 max-w-6xl items-center justify-center px-4 sm:h-10">
        <p
          className={cn(
            "text-center font-questrial text-xs tracking-wide text-white sm:text-sm",
            "transition-all duration-300 ease-out",
            visible
              ? "translate-y-0 opacity-100"
              : "-translate-y-1.5 opacity-0",
          )}
        >
          {current.link_url ? (
            <a
              href={current.link_url}
              className="inline-flex max-w-full items-center gap-2 text-white underline decoration-yellow-400/70 underline-offset-4 hover:text-yellow-400"
            >
              {content}
            </a>
          ) : (
            content
          )}
        </p>

        {count > 1 ? (
          <div className="absolute right-4 hidden items-center gap-1.5 sm:flex">
            {announcements.map((item, itemIndex) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Show announcement ${itemIndex + 1}`}
                onClick={() => {
                  setVisible(true);
                  setIndex(itemIndex);
                }}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  itemIndex === safeIndex
                    ? "w-4 bg-yellow-400"
                    : "w-1.5 bg-white/35 hover:bg-white/60",
                )}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
